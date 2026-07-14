import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

import { createAppServer } from '../src/server.js';

let server;
let baseUrl;

before(async () => {
  server = createAppServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('完整且可验证的交付证据会返回通过结论和稳定凭证', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      task: '实现并合并登录限流修复',
      criteria: ['代码已合并', '自动化测试通过'],
      evidence: [
        {
          criterion: '代码已合并',
          kind: 'github_pr',
          url: 'https://github.com/example/repo/pull/42',
          status: 'verified'
        },
        {
          criterion: '自动化测试通过',
          kind: 'test_run',
          url: 'https://github.com/example/repo/actions/runs/100',
          status: 'verified'
        }
      ]
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.decision, 'pass');
  assert.equal(result.score, 100);
  assert.match(result.receipt.id, /^pfg_[a-f0-9]{16}$/);
  assert.equal(result.receipt.schema, 'proofgate.audit.v1');
});

test('缺少验收证据时必须降级为人工复核并指出缺口', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      task: '交付一个可部署的 API',
      criteria: ['健康检查可访问', '部署地址使用 HTTPS'],
      evidence: [
        {
          criterion: '部署地址使用 HTTPS',
          kind: 'api_endpoint',
          url: 'https://proofgate.example/health',
          status: 'verified'
        }
      ]
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.decision, 'needs_review');
  assert.equal(result.score, 50);
  assert.deepEqual(result.missingCriteria, ['健康检查可访问']);
});

test('指向本机或内网的证据链接不能被判定为可信', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      task: '证明生产接口已上线',
      criteria: ['生产接口可公开访问'],
      evidence: [
        {
          criterion: '生产接口可公开访问',
          kind: 'api_endpoint',
          url: 'https://127.0.0.1/admin',
          status: 'verified'
        }
      ]
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.decision, 'fail');
  assert.equal(result.score, 0);
  assert.deepEqual(result.riskFlags, [
    {
      code: 'private_network_url',
      evidenceIndex: 0
    }
  ]);
});

test('Agent 可以通过 MCP 发现交付证据审计工具', async () => {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.jsonrpc, '2.0');
  assert.equal(result.id, 1);
  assert.deepEqual(
    result.result.tools.map((tool) => tool.name),
    ['audit_delivery_evidence']
  );
});

test('Agent 通过 MCP 调用时复用同一套审计规则', async () => {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'audit_delivery_evidence',
        arguments: {
          task: '验证交付物',
          criteria: ['已提供公开产物'],
          evidence: [
            {
              criterion: '已提供公开产物',
              kind: 'artifact',
              url: 'https://example.com/artifacts/report.json',
              status: 'verified'
            }
          ]
        }
      }
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.result.structuredContent.decision, 'pass');
  assert.equal(result.result.structuredContent.score, 100);
  assert.equal(result.result.content[0].type, 'text');
});

test('部署平台可以通过健康检查确认服务及协议版本', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok',
    service: 'proofgate',
    schema: 'proofgate.audit.v1',
    mcpEndpoint: '/mcp'
  });
});

test('标准 MCP 客户端可以完成初始化握手', async () => {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'proofgate-test', version: '1.0.0' }
      }
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.result.protocolVersion, '2025-03-26');
  assert.deepEqual(result.result.capabilities, { tools: {} });
  assert.equal(result.result.serverInfo.name, 'proofgate');
});

test('输入缺少任务或验收标准时返回可读的参数错误', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ evidence: [] })
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'invalid_request',
    details: [
      'task must be a non-empty string',
      'criteria must contain at least one item'
    ]
  });
});

test('同一验收项存在冲突证据时不能因为另一条已验证证据而通过', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      task: '确认部署版本',
      criteria: ['线上版本与提交一致'],
      evidence: [
        {
          criterion: '线上版本与提交一致',
          kind: 'github_pr',
          url: 'https://github.com/example/repo/commit/abc',
          status: 'verified'
        },
        {
          criterion: '线上版本与提交一致',
          kind: 'artifact',
          url: 'https://example.com/build/version.json',
          status: 'conflicting'
        }
      ]
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.decision, 'fail');
  assert.deepEqual(result.riskFlags, [
    {
      code: 'conflicting_evidence',
      evidenceIndex: 1
    }
  ]);
});

test('格式损坏的 HTTPS 字符串不能绕过证据链接校验', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      task: '验证公开结果',
      criteria: ['结果可访问'],
      evidence: [
        {
          criterion: '结果可访问',
          kind: 'artifact',
          url: 'https://',
          status: 'verified'
        }
      ]
    })
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.decision, 'fail');
  assert.deepEqual(result.riskFlags, [
    {
      code: 'invalid_url',
      evidenceIndex: 0
    }
  ]);
});

test('损坏的 JSON 请求返回错误而不会中断服务', async () => {
  const response = await fetch(`${baseUrl}/audit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{'
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'invalid_json'
  });

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
});

test('OKX 免费端点探测在空 POST 时仍返回可调用说明', async () => {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: 'POST'
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    service: 'proofgate',
    transport: 'mcp-streamable-http',
    tool: 'audit_delivery_evidence',
    status: 'ready'
  });
});
