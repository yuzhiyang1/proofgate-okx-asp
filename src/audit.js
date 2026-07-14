import { createHash } from 'node:crypto';

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function isPrivateHostname(hostname) {
  if (hostname === 'localhost' || hostname === '::1' || hostname === '[::1]') {
    return true;
  }
  if (hostname.endsWith('.local')) {
    return true;
  }
  if (/^127\./.test(hostname) || /^10\./.test(hostname) || /^192\.168\./.test(hostname)) {
    return true;
  }

  const match = hostname.match(/^172\.(\d{1,3})\./);
  return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31);
}

function getEvidenceRisk(item, evidenceIndex) {
  if (item.status === 'conflicting') {
    return { code: 'conflicting_evidence', evidenceIndex };
  }

  try {
    const url = new URL(item.url);
    if (isPrivateHostname(url.hostname)) {
      return { code: 'private_network_url', evidenceIndex };
    }
  } catch {
    return { code: 'invalid_url', evidenceIndex };
  }

  return null;
}

export function validateAuditInput(input) {
  const errors = [];
  if (typeof input?.task !== 'string' || input.task.trim() === '') {
    errors.push('task must be a non-empty string');
  }
  if (!Array.isArray(input?.criteria) || input.criteria.length === 0) {
    errors.push('criteria must contain at least one item');
  }
  return errors;
}

export function auditDelivery(input) {
  const criteria = Array.isArray(input.criteria) ? input.criteria : [];
  const evidence = Array.isArray(input.evidence) ? input.evidence : [];
  const riskFlags = evidence
    .map(getEvidenceRisk)
    .filter(Boolean);
  const riskyEvidenceIndexes = new Set(riskFlags.map((flag) => flag.evidenceIndex));

  const verifiedCriteria = criteria.filter((criterion) =>
    evidence.some(
      (item, evidenceIndex) =>
        item.criterion === criterion &&
        item.status === 'verified' &&
        typeof item.url === 'string' &&
        item.url.startsWith('https://') &&
        !riskyEvidenceIndexes.has(evidenceIndex)
    )
  );
  const score = criteria.length === 0
    ? 0
    : Math.round((verifiedCriteria.length / criteria.length) * 100);
  const missingCriteria = criteria.filter(
    (criterion) => !verifiedCriteria.includes(criterion)
  );

  // 凭证仅由规范化输入决定，便于不同 Agent 对同一证据得到相同结果。
  const digest = createHash('sha256')
    .update(stableStringify(input))
    .digest('hex')
    .slice(0, 16);

  return {
    decision: riskFlags.length > 0
      ? 'fail'
      : score === 100
        ? 'pass'
        : 'needs_review',
    score,
    missingCriteria,
    riskFlags,
    receipt: {
      id: `pfg_${digest}`,
      schema: 'proofgate.audit.v1'
    }
  };
}
