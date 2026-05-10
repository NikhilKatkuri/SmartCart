/**
 * LLM Manager — Groq API with multi-key rotation and streaming.
 * Primary inference layer. Falls back across keys on rate limit (429).
 */

import type { Message } from '../types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const TEMPERATURE = 0.1; // Low = more factual, less creative

// ─── Load API keys from env ───────────────────────────────────────────────────

function loadApiKeys(): string[] {
  return [
    process.env.GROQ_API_KEY_1 ?? process.env.GROQ_API_KEY ?? '',
    process.env.GROQ_API_KEY_2 ?? '',
    process.env.GROQ_API_KEY_3 ?? '',
  ].filter(Boolean);
}

// ─── Streaming call ───────────────────────────────────────────────────────────

export async function* streamLLM(messages: Message[]): AsyncGenerator<string> {
  const keys = loadApiKeys();

  if (keys.length === 0) {
    throw new Error('No GROQ API keys configured. Set GROQ_API_KEY in .env');
  }

  let lastError: Error | null = null;

  for (const key of keys) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, temperature: TEMPERATURE, max_tokens: 1024, stream: true }),
      });

      if (response.status === 429) {
        console.warn(`Rate limit on key ${key.slice(0, 8)}… trying next key`);
        continue;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq ${response.status}: ${(err as any)?.error?.message ?? response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Empty response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const chunk = JSON.parse(raw);
            const text = chunk.choices?.[0]?.delta?.content ?? '';
            if (text) yield text;
          } catch {
            // malformed SSE line — skip
          }
        }
      }

      return; // success — stop trying keys
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`LLM key failed:`, lastError.message);
    }
  }

  throw lastError ?? new Error('All Groq API keys exhausted');
}

// ─── Non-streaming call (fallback / testing) ──────────────────────────────────

export async function callLLM(messages: Message[]): Promise<string> {
  const keys = loadApiKeys();
  let lastError: Error | null = null;

  for (const key of keys) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, temperature: TEMPERATURE, max_tokens: 1024 }),
      });

      if (response.status === 429) continue;
      if (!response.ok) throw new Error(`Groq ${response.status}`);

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return data.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error('All Groq API keys exhausted');
}
