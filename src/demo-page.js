const sampleAudit = {
  task: 'Ship a production ready agent endpoint',
  criteria: ['Public endpoint is available', 'Automated checks passed'],
  evidence: [
    {
      criterion: 'Public endpoint is available',
      kind: 'api_endpoint',
      url: 'https://example.com/health',
      status: 'verified'
    },
    {
      criterion: 'Automated checks passed',
      kind: 'test_run',
      url: 'https://github.com/example/repo/actions/runs/100',
      status: 'verified'
    }
  ]
};

// 页面与 API 同源部署，评委无需安装客户端即可体验真实审计流程。
export const demoPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="ProofGate audits public delivery evidence before agents accept work or release payment.">
  <title>ProofGate | Evidence first delivery audit</title>
  <style>
    :root {
      color-scheme: light dark;
      --page: #f5f7f6;
      --surface: #ffffff;
      --surface-soft: #edf1ef;
      --text: #15201c;
      --muted: #5f6d67;
      --line: #cfd7d3;
      --accent: #0f766e;
      --accent-strong: #0a5d57;
      --accent-text: #ffffff;
      --danger: #b42318;
      --shadow: 0 18px 55px rgb(25 43 36 / 0.10);
      --radius: 6px;
      font-family: "Segoe UI Variable", "Aptos", "Helvetica Neue", sans-serif;
    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      background:
        linear-gradient(rgb(15 118 110 / 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgb(15 118 110 / 0.04) 1px, transparent 1px),
        var(--page);
      background-size: 40px 40px;
      color: var(--text);
    }

    a { color: inherit; }

    button, textarea { font: inherit; }

    .shell {
      width: min(1180px, calc(100% - 40px));
      margin: 0 auto;
    }

    .site-header {
      min-height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid var(--line);
    }

    .brand {
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-decoration: none;
    }

    .site-nav {
      display: flex;
      align-items: center;
      gap: 22px;
      font-size: 0.9rem;
    }

    .site-nav a {
      color: var(--muted);
      text-decoration: none;
    }

    .site-nav a:hover, .site-nav a:focus-visible { color: var(--accent); }

    .hero {
      min-height: calc(100dvh - 68px);
      display: grid;
      grid-template-columns: minmax(0, 0.84fr) minmax(430px, 1.16fr);
      align-items: center;
      gap: clamp(42px, 7vw, 94px);
      padding: 64px 0;
    }

    .hero-copy { max-width: 540px; }

    .eyebrow {
      margin: 0 0 20px;
      color: var(--accent);
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1, h2, h3, p { margin-top: 0; }

    h1 {
      max-width: 10ch;
      margin-bottom: 24px;
      font-size: clamp(3.3rem, 7vw, 6.7rem);
      line-height: 0.91;
      letter-spacing: -0.075em;
    }

    .hero-copy > p:not(.eyebrow) {
      max-width: 34ch;
      margin-bottom: 28px;
      color: var(--muted);
      font-size: clamp(1.05rem, 2vw, 1.24rem);
      line-height: 1.55;
    }

    .text-link {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
      border-bottom: 2px solid var(--accent);
      color: var(--accent-strong);
      font-weight: 700;
      text-decoration: none;
    }

    .text-link:hover, .text-link:focus-visible { color: var(--accent); }

    .auditor {
      position: relative;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .auditor::before {
      content: "";
      display: block;
      height: 4px;
      background: var(--accent);
    }

    .auditor-header, .auditor-body { padding: 22px 24px; }

    .auditor-header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid var(--line);
    }

    .auditor-header h2 {
      margin-bottom: 4px;
      font-size: 1.05rem;
    }

    .auditor-header p {
      margin-bottom: 0;
      color: var(--muted);
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-size: 0.72rem;
    }

    .endpoint-state {
      align-self: flex-start;
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 700;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.82rem;
      font-weight: 700;
    }

    textarea {
      display: block;
      width: 100%;
      min-height: 245px;
      resize: vertical;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface-soft);
      color: var(--text);
      padding: 15px;
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-size: 0.76rem;
      line-height: 1.58;
    }

    textarea:focus-visible, button:focus-visible, a:focus-visible {
      outline: 3px solid rgb(15 118 110 / 0.34);
      outline-offset: 3px;
    }

    .helper {
      margin: 7px 0 16px;
      color: var(--muted);
      font-size: 0.76rem;
      line-height: 1.45;
    }

    .run-button {
      width: 100%;
      min-height: 46px;
      border: 1px solid var(--accent-strong);
      border-radius: var(--radius);
      background: var(--accent);
      color: var(--accent-text);
      cursor: pointer;
      font-weight: 750;
      transition: background-color 160ms ease, transform 160ms ease;
    }

    .run-button:hover { background: var(--accent-strong); }
    .run-button:active { transform: translateY(1px); }
    .run-button:disabled { cursor: wait; opacity: 0.65; }

    .result {
      min-height: 106px;
      margin-top: 18px;
      border-left: 3px solid var(--line);
      background: var(--surface-soft);
      padding: 15px 16px;
      color: var(--muted);
      font-size: 0.85rem;
      line-height: 1.55;
    }

    .result strong {
      display: block;
      margin-bottom: 7px;
      color: var(--text);
      font-size: 1rem;
    }

    .result[data-state="success"] { border-left-color: var(--accent); }
    .result[data-state="error"] { border-left-color: var(--danger); color: var(--danger); }

    .receipt {
      margin: 8px 0 0;
      color: var(--muted);
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-size: 0.73rem;
      word-break: break-all;
    }

    .outcomes {
      padding: 96px 0;
      border-top: 1px solid var(--line);
    }

    .outcomes-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
      gap: clamp(54px, 9vw, 130px);
      align-items: start;
    }

    .outcomes h2 {
      max-width: 13ch;
      margin-bottom: 24px;
      font-size: clamp(2.35rem, 5vw, 4.8rem);
      line-height: 0.98;
      letter-spacing: -0.055em;
    }

    .outcomes-intro {
      max-width: 50ch;
      margin-bottom: 38px;
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.65;
    }

    .decision-list { margin: 0; }

    .decision-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 28px;
      padding: 22px 0;
      border-bottom: 1px solid var(--line);
    }

    .decision-row dt {
      color: var(--accent-strong);
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-weight: 700;
    }

    .decision-row dd { margin: 0; color: var(--muted); line-height: 1.55; }

    .protocol {
      position: sticky;
      top: 24px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface);
      padding: 24px;
    }

    .protocol h3 { margin-bottom: 18px; font-size: 1rem; }

    pre {
      margin: 0;
      overflow-x: auto;
      color: var(--muted);
      font-family: "Cascadia Code", "SFMono-Regular", monospace;
      font-size: 0.76rem;
      line-height: 1.7;
    }

    .protocol a {
      display: inline-block;
      margin-top: 20px;
      color: var(--accent-strong);
      font-size: 0.82rem;
      font-weight: 700;
    }

    footer {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding: 28px 0 36px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 0.8rem;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --page: #0d1311;
        --surface: #151d1a;
        --surface-soft: #1b2521;
        --text: #edf6f2;
        --muted: #a0b0a9;
        --line: #34423c;
        --accent: #5eead4;
        --accent-strong: #8af5e3;
        --accent-text: #08201b;
        --danger: #ff8a80;
        --shadow: 0 22px 70px rgb(0 0 0 / 0.34);
      }
    }

    @media (max-width: 840px) {
      .shell { width: min(100% - 32px, 680px); }
      .hero {
        min-height: auto;
        grid-template-columns: 1fr;
        gap: 44px;
        padding: 54px 0 72px;
      }
      h1 { max-width: 9ch; }
      .outcomes { padding: 72px 0; }
      .outcomes-grid { grid-template-columns: 1fr; }
      .protocol { position: static; }
    }

    @media (max-width: 520px) {
      .shell { width: min(100% - 24px, 460px); }
      .site-header { min-height: 62px; }
      .site-nav { gap: 14px; font-size: 0.8rem; }
      .hero { padding-top: 44px; }
      h1 { font-size: clamp(3rem, 16vw, 4.7rem); }
      .auditor-header, .auditor-body { padding: 18px; }
      .auditor-header { display: block; }
      .endpoint-state { display: block; margin-top: 10px; }
      textarea { min-height: 285px; }
      .decision-row { grid-template-columns: 1fr; gap: 8px; }
      footer { display: block; }
      footer span { display: block; margin-top: 8px; }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { transition-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>
  <header class="site-header shell">
    <a class="brand" href="/">ProofGate</a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="#decisions">Decisions</a>
      <a href="/health">Health</a>
      <a href="https://github.com/yuzhiyang1/proofgate-okx-asp">GitHub</a>
    </nav>
  </header>

  <main>
    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Evidence first delivery audit</p>
        <h1 id="hero-title">Trust the evidence. Not the claim.</h1>
        <p>Audit delivery evidence before agents accept work or release payment.</p>
        <a class="text-link" href="https://github.com/yuzhiyang1/proofgate-okx-asp#readme">Read the protocol</a>
      </div>

      <section class="auditor" id="auditor" aria-labelledby="auditor-title">
        <div class="auditor-header">
          <div>
            <h2 id="auditor-title">Live delivery audit</h2>
            <p>POST /audit</p>
          </div>
          <span class="endpoint-state">Endpoint ready</span>
        </div>
        <div class="auditor-body">
          <form id="audit-form">
            <label for="audit-input">Audit request</label>
            <textarea id="audit-input" name="audit-input" spellcheck="false" aria-describedby="audit-helper">${JSON.stringify(sampleAudit, null, 2)}</textarea>
            <p class="helper" id="audit-helper">Edit the request or run the public sample. URLs are validated but never fetched.</p>
            <button class="run-button" id="run-audit" type="submit">Run evidence audit</button>
          </form>
          <div class="result" id="audit-result" aria-live="polite" aria-atomic="true">
            <strong>Ready for evidence</strong>
            The result will show a decision, score, missing criteria and a deterministic receipt.
          </div>
        </div>
      </section>
    </section>

    <section class="outcomes" id="decisions" aria-labelledby="decisions-title">
      <div class="outcomes-grid shell">
        <div>
          <h2 id="decisions-title">One audit. Three clear outcomes.</h2>
          <p class="outcomes-intro">ProofGate maps each acceptance criterion to public HTTPS evidence, rejects unsafe links and produces a machine readable receipt.</p>
          <dl class="decision-list">
            <div class="decision-row">
              <dt>pass</dt>
              <dd>Every criterion has verified public evidence with no conflicts.</dd>
            </div>
            <div class="decision-row">
              <dt>needs_review</dt>
              <dd>At least one acceptance criterion is missing verified evidence.</dd>
            </div>
            <div class="decision-row">
              <dt>fail</dt>
              <dd>Evidence conflicts, uses an invalid URL or points to a private network.</dd>
            </div>
          </dl>
        </div>

        <aside class="protocol" aria-labelledby="protocol-title">
          <h3 id="protocol-title">Agent protocol</h3>
          <pre>POST /mcp

tools/list
tools/call
  audit_delivery_evidence

schema
  proofgate.audit.v1</pre>
          <a href="/health">Inspect service health</a>
        </aside>
      </div>
    </section>
  </main>

  <footer class="shell">
    <strong>ProofGate</strong>
    <span>Built for OKX.AI Genesis Hackathon</span>
  </footer>

  <script>
    const form = document.querySelector('#audit-form');
    const input = document.querySelector('#audit-input');
    const button = document.querySelector('#run-audit');
    const result = document.querySelector('#audit-result');

    function escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      button.disabled = true;
      button.textContent = 'Auditing evidence...';
      result.dataset.state = 'loading';
      result.innerHTML = '<strong>Checking request</strong>Mapping criteria to evidence and validating public URLs.';

      try {
        const payload = JSON.parse(input.value);
        const response = await fetch('/audit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details?.join(', ') || data.error || 'Audit request failed');
        }

        const missing = data.missingCriteria.length
          ? '<br>Missing: ' + escapeHtml(data.missingCriteria.join(', '))
          : '<br>Missing: none';
        result.dataset.state = 'success';
        result.innerHTML =
          '<strong>' + escapeHtml(data.decision) + ' · ' + escapeHtml(data.score) + '/100</strong>' +
          'Verified criteria: ' + escapeHtml(data.verifiedCriteria.length) + '/' + escapeHtml(payload.criteria.length) +
          missing +
          '<p class="receipt">Receipt: ' + escapeHtml(data.receipt.id) + '</p>';
      } catch (error) {
        result.dataset.state = 'error';
        result.innerHTML = '<strong>Audit could not run</strong>' + escapeHtml(error.message);
      } finally {
        button.disabled = false;
        button.textContent = 'Run evidence audit';
      }
    });
  </script>
</body>
</html>`;
