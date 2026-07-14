# ProofGate OKX.AI Submission Kit

## Positioning

- Primary category: Software Utility
- Secondary consideration: Best Product and Creative Genius
- Core claim: ProofGate is a verification gate for agent work, not another task marketplace.
- Primary user: an AI agent deciding whether to accept a delivery or release payment.

## ASP Identity

These values are a draft until the owner confirms them for onchain registration.

| Field | Value |
| --- | --- |
| Name | ProofGate |
| Description | ProofGate helps AI agents verify delivery evidence before accepting work or releasing payment. |
| Service name | Delivery Evidence Audit |
| Type | API service |
| Fee | 0 USDT |
| Endpoint | `<PUBLIC_HTTPS_URL>/mcp` |

Service description:

```text
Audits acceptance criteria against public delivery evidence and returns pass, review, or fail with a reproducible receipt.
Provide: 1. task description 2. acceptance criteria 3. evidence links and verification status.
```

## Submission Fields

### Project name

ProofGate

### One-line pitch

Evidence-first delivery audits for AI agents, with reproducible trust receipts.

### Short description

ProofGate helps agents decide whether a task is ready for acceptance or payment. It maps acceptance criteria to public delivery evidence, detects missing or conflicting proof, blocks invalid and private-network URLs, and returns a deterministic receipt that other agents can reproduce. It is available as a free MCP and HTTP service on OKX.AI.

### Problem

Agents can discover work, negotiate and settle payments, but delivery verification is still based on a confident claim. That is not enough to prove code was merged, tests passed or an endpoint went live.

### Solution

ProofGate adds a machine-readable verification gate. It checks criterion coverage, evidence status, URL safety and conflicts, then returns `pass`, `needs_review` or `fail` with a stable receipt.

### Why it matters for OKX.AI

Any OKX.AI agent can call ProofGate before accepting work or releasing payment. This creates a reusable trust primitive across software delivery, research, content and operational workflows.

### Technical highlights

- Free A2MCP endpoint with standard MCP initialization, discovery and tool calls.
- Plain JSON API for browser and service integrations.
- Deterministic receipt generated from normalized audit input.
- Explicit rejection of malformed and private-network evidence URLs.
- No request-body logging and no remote URL fetching in the first release.
- Dependency-free Node.js deployment with integration tests for public behavior.

### Links

- GitHub: https://github.com/yuzhiyang1/proofgate-okx-asp
- Live demo: `<PUBLIC_HTTPS_URL>`
- MCP endpoint: `<PUBLIC_HTTPS_URL>/mcp`
- OKX.AI ASP: `<OKX_ASP_URL>`
- X participation post: `<X_POST_URL>`
- Demo video: `<VIDEO_URL>`

## 90-second Demo Script

### 0-8 seconds

Screen: ProofGate landing page.

Voiceover:

> Agents can negotiate and pay, but a delivery claim is not proof that the work is complete.

### 8-20 seconds

Screen: Show the live audit request with two acceptance criteria and two public evidence links.

Voiceover:

> ProofGate gives agents an evidence-first verification gate. Send the task, acceptance criteria and delivery evidence.

### 20-35 seconds

Screen: Run the bundled complete sample and reveal `pass`, `100/100` and the receipt.

Voiceover:

> Every criterion is mapped to verified public evidence. The audit passes and returns a deterministic receipt that another agent can reproduce.

### 35-52 seconds

Screen: Delete one evidence item, run again and reveal `needs_review` with the missing criterion.

Voiceover:

> If evidence is missing, ProofGate does not guess. It names the exact gap and sends the work to review.

### 52-67 seconds

Screen: Replace an evidence URL with a localhost or malformed URL and reveal `fail` with the risk flag.

Voiceover:

> Invalid and private-network links fail the audit. Submitted URLs are never fetched, which keeps this release deterministic and resistant to server-side request forgery.

### 67-80 seconds

Screen: Show the MCP endpoint and `audit_delivery_evidence` tool in the README or a terminal call.

Voiceover:

> Any agent can discover and call the same audit rules over MCP, or use the plain HTTP API.

### 80-90 seconds

Screen: Show the live OKX.AI ASP listing and the ProofGate name.

Voiceover:

> ProofGate is a reusable trust primitive for the agent economy, live as a free service on OKX.AI.

## Recording Checklist

- Record at 1080p with the browser zoom set to 100 percent.
- Keep the final cut between 75 and 88 seconds.
- Show the live URL in the address bar at least once.
- Keep the result receipt visible long enough to read.
- Show the OKX.AI listing in the final shot.
- Add English captions because judging is international.
- Do not include private email, wallet, OTP or deployment settings.

## X Participation Post

```text
Agents can negotiate and pay, but who verifies the work?

ProofGate audits delivery evidence before acceptance: criterion coverage, conflicts, unsafe links and reproducible receipts. Any agent can call it over MCP.

Built for #OKXAI Genesis Hackathon.

Demo: <VIDEO_URL>
ASP: <OKX_ASP_URL>
```

## Final Submission Order

1. Deploy the public HTTPS service and verify `/`, `/health`, `/audit` and `/mcp`.
2. Register the ProofGate ASP with the public `/mcp` endpoint.
3. Activate it and wait for OKX.AI listing approval.
4. Record the demo with the live ASP listing in the final shot.
5. Publish the X post with `#OKXAI` and the demo.
6. Submit the Google form with the ASP and X links before the deadline.
