import { auditDelivery } from './audit.js';

const AUDIT_TOOL = {
  name: 'audit_delivery_evidence',
  description: 'Audit task delivery evidence and return a reproducible trust receipt.',
  inputSchema: {
    type: 'object',
    required: ['task', 'criteria', 'evidence'],
    properties: {
      task: {
        type: 'string',
        description: 'A concise description of the delivered task.'
      },
      criteria: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1
      },
      evidence: {
        type: 'array',
        items: {
          type: 'object',
          required: ['criterion', 'kind', 'url', 'status'],
          properties: {
            criterion: { type: 'string' },
            kind: {
              type: 'string',
              enum: ['github_pr', 'test_run', 'transaction', 'api_endpoint', 'artifact']
            },
            url: { type: 'string', format: 'uri' },
            status: {
              type: 'string',
              enum: ['verified', 'unverified', 'conflicting']
            }
          }
        }
      }
    }
  }
};

export function handleMcpRequest(message) {
  if (message.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        protocolVersion: '2025-03-26',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'proofgate',
          version: '0.1.0'
        }
      }
    };
  }

  if (message.method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: { tools: [AUDIT_TOOL] }
    };
  }

  if (
    message.method === 'tools/call' &&
    message.params?.name === AUDIT_TOOL.name
  ) {
    const result = auditDelivery(message.params.arguments ?? {});
    return {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result)
          }
        ],
        structuredContent: result,
        isError: false
      }
    };
  }

  // 未实现的方法按 JSON-RPC 规范返回明确错误，避免 Agent 静默误判。
  return {
    jsonrpc: '2.0',
    id: message.id ?? null,
    error: {
      code: -32601,
      message: 'Method not found'
    }
  };
}
