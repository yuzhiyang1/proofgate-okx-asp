# ProofGate

**Evidence-first delivery audits for the agent economy.**

ProofGate turns task requirements and delivery evidence into a reproducible
decision: `pass`, `needs_review`, or `fail`. Every result includes a stable
receipt that another agent can independently reproduce from the same input.

Built as a free A2MCP service for the **OKX.AI Genesis Hackathon**.

## Why ProofGate

Agent marketplaces already help agents discover work, negotiate, and settle
payments. The weak link is delivery verification: a confident message is not
proof that code was merged, tests passed, an API is public, or a transaction
settled.

ProofGate adds a compact verification gate before acceptance and settlement:

1. Map every acceptance criterion to evidence.
2. Reject malformed, conflicting, local, or private-network evidence links.
3. Calculate coverage and identify missing criteria.
4. Return an agent-readable decision and deterministic receipt.

## Public Interfaces

| Interface | Purpose |
| --- | --- |
| `GET /` | Interactive browser demo |
| `GET /health` | Deployment and review health check |
| `POST /audit` | Plain JSON delivery audit API |
| `POST /mcp` | MCP Streamable HTTP endpoint |

The MCP endpoint exposes one tool:

- `audit_delivery_evidence`

## Quick Start

```bash
npm test
npm start
```

Audit the bundled example:

```bash
curl -X POST http://localhost:3000/audit \
  -H "content-type: application/json" \
  --data-binary @examples/audit-request.json
```

List MCP tools:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Decision Rules

- `pass`: every criterion has public HTTPS evidence marked as verified.
- `needs_review`: one or more criteria are missing verified evidence.
- `fail`: evidence conflicts, has an invalid URL, or points to a local/private
  network.

ProofGate never follows submitted URLs in v0.1. This prevents SSRF and keeps the
result deterministic. Remote source verification is the next additive layer;
the existing receipt contract remains stable.

## Safety

- No API keys or wallet credentials are required.
- Submitted URLs are parsed but never fetched.
- Local and private-network URLs are rejected.
- Malformed requests return bounded JSON errors without exposing stack traces.
- No request body is written to application logs.

## Deployment

The service is dependency-free and supports any Node 22 hosting platform.
`Dockerfile` is included for Railway, Render, Fly.io, or a standard container
host. The process reads the platform-provided `PORT` variable.

## Tests

The integration suite exercises the public HTTP interfaces and covers:

- interactive demo availability and basic accessibility;
- complete evidence;
- missing criteria;
- private-network and malformed URLs;
- conflicting evidence;
- malformed JSON recovery;
- MCP discovery, invocation, and initialization;
- OKX free-endpoint probing.

## License

MIT
