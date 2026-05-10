/**
 * AI Pipeline Orchestrator
 * Flow: Engine → RAG (MongoDB) → Prompt Builder → LLM Manager → Response Handler
 *
 * Keeps conversation history per session and streams response chunks via SSE.
 */

import { retrieveProduct, retrieveProducts } from './rag';
import { buildProductPrompt, buildComparisonPrompt, formatHistory } from '../prompt/builder';
import { streamLLM } from './llm';
import { validateResponse, formatResponse, sseEvent } from './responseHandler';
import type { Message } from '../types';

export class AIPipeline {
  private history: Message[] = [];

  // ─── Single product query (streaming) ──────────────────────────────────────

  async *query(
    productId: string,
    userQuery: string
  ): AsyncGenerator<string> {
    // Stage 1 — Retrieve from MongoDB (RAG)
    yield sseEvent({ type: 'status', stage: 'retrieving' });

    const product = await retrieveProduct(productId);
    if (!product) throw new Error(`Product "${productId}" not found`);

    yield sseEvent({ type: 'metadata', data: {
      product_id: product.product_id,
      product_title: product.product_title,
      brand: product.brand,
      category: product.category,
    }});

    // Stage 2 — Build augmented prompt (template injection)
    yield sseEvent({ type: 'status', stage: 'processing' });

    const messages = buildProductPrompt(product, userQuery, this.history);

    // Stage 3 — Stream from LLM
    yield sseEvent({ type: 'status', stage: 'streaming' });

    let fullResponse = '';

    for await (const chunk of streamLLM(messages)) {
      fullResponse += chunk;
      yield sseEvent({ type: 'chunk', data: { content: chunk } });
    }

    // Stage 4 — Response Handler (safety check)
    const validation = validateResponse(fullResponse);
    if (!validation.valid) {
      console.warn('Response handler flagged output:', validation.reason);
      // Still return the response — log only; don't block the user
    }

    // Update conversation history (keep last 6 messages = 3 turns)
    this.history.push({ role: 'user', content: userQuery });
    this.history.push({ role: 'assistant', content: formatResponse(fullResponse) });
    this.history = this.history.slice(-6);

    yield sseEvent({ type: 'complete', data: { success: true } });
  }

  // ─── Multi-product comparison (streaming) ──────────────────────────────────

  async *compare(
    productIds: string[],
    userQuery: string
  ): AsyncGenerator<string> {
    yield sseEvent({ type: 'status', stage: 'retrieving' });

    const products = await retrieveProducts(productIds);
    if (products.length === 0) throw new Error('No products found for comparison');

    yield sseEvent({ type: 'metadata', data: {
      products: products.map((p) => ({ product_id: p.product_id, product_title: p.product_title })),
    }});

    yield sseEvent({ type: 'status', stage: 'processing' });

    const messages = buildComparisonPrompt(products, userQuery);

    yield sseEvent({ type: 'status', stage: 'streaming' });

    for await (const chunk of streamLLM(messages)) {
      yield sseEvent({ type: 'chunk', data: { content: chunk } });
    }

    yield sseEvent({ type: 'complete', data: { success: true } });
  }

  // ─── History management ────────────────────────────────────────────────────

  setHistory(messages: Array<{ role: 'user' | 'assistant'; content: string }>): void {
    this.history = formatHistory(messages).slice(-6);
  }

  getHistory(): Message[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
  }
}
