/**
 * Response Handler — final gatekeeper before output reaches the user.
 * Checks for hallucination signals and formats the response.
 */

// Phrases that suggest the model is guessing instead of using context
const UNCERTAINTY_SIGNALS = ['i think', 'probably', 'i believe', 'i assume', 'might be', 'i guess'];

// ─── Validate output for hallucination signals ────────────────────────────────

export function validateResponse(text: string): { valid: boolean; reason?: string } {
  const lower = text.toLowerCase();

  for (const signal of UNCERTAINTY_SIGNALS) {
    if (lower.includes(signal)) {
      return { valid: false, reason: `Uncertainty signal detected: "${signal}"` };
    }
  }

  if (text.trim().length < 5) {
    return { valid: false, reason: 'Response too short' };
  }

  return { valid: true };
}

// ─── Format final response ────────────────────────────────────────────────────

export function formatResponse(text: string): string {
  return text.trim();
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

export function sseEvent(payload: object): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}
