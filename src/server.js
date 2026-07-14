import { createServer } from 'node:http';

import { auditDelivery, validateAuditInput } from './audit.js';
import { demoPage } from './demo-page.js';
import { handleMcpRequest } from './mcp.js';

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf8').trim();
  return body === '' ? null : JSON.parse(body);
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}

function sendHtml(response, status, html) {
  response.writeHead(status, {
    'content-type': 'text/html; charset=utf-8'
  });
  response.end(html);
}

export function createAppServer() {
  return createServer(async (request, response) => {
    try {
      if (request.method === 'GET' && request.url === '/') {
        sendHtml(response, 200, demoPage);
        return;
      }

      if (request.method === 'GET' && request.url === '/health') {
        sendJson(response, 200, {
          status: 'ok',
          service: 'proofgate',
          schema: 'proofgate.audit.v1',
          mcpEndpoint: '/mcp'
        });
        return;
      }

      if (request.method === 'POST' && request.url === '/audit') {
        const input = await readJson(request);
        const errors = validateAuditInput(input);
        if (errors.length > 0) {
          sendJson(response, 400, {
            error: 'invalid_request',
            details: errors
          });
          return;
        }
        sendJson(response, 200, auditDelivery(input));
        return;
      }

      if (request.method === 'POST' && request.url === '/mcp') {
        const message = await readJson(request);
        if (message === null) {
          sendJson(response, 200, {
            service: 'proofgate',
            transport: 'mcp-streamable-http',
            tool: 'audit_delivery_evidence',
            status: 'ready'
          });
          return;
        }
        sendJson(response, 200, handleMcpRequest(message));
        return;
      }

      sendJson(response, 404, { error: 'not_found' });
    } catch (error) {
      // JSON 解析错误属于调用方输入问题；其他异常不向外泄露实现细节。
      const invalidJson = error instanceof SyntaxError;
      sendJson(response, invalidJson ? 400 : 500, {
        error: invalidJson ? 'invalid_json' : 'internal_error'
      });
    }
  });
}
