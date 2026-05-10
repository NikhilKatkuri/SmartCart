import { jsonToText } from '../utils/jsonToText';
import type { ProductContext, Message } from '../types';

// ─── System Rules (constitutional boundary for the LLM) ──────────────────────

const RULES = `
RULE 1: Use ONLY the provided context to answer.
RULE 2: If the answer is not in the context → say "I do not have enough information to answer that."
RULE 3: Do not mention you are an AI or that you were given a dataset.
RULE 4: Be concise, helpful, and honest.
`.trim();

// ─── Single Product Prompt ────────────────────────────────────────────────────

export function buildProductPrompt(
  product: ProductContext,
  userQuery: string,
  history: Message[] = []
): Message[] {
  const discountedPrice =
    product.discount_percentage > 0
      ? Math.round(product.price * (1 - product.discount_percentage / 100))
      : null;

  // Use jsonToText to convert structured data — saves ~50% tokens vs raw JSON
  const context = jsonToText({
    product: product.product_title,
    brand: product.brand,
    category: product.category,
    price: `${product.currency}${product.price.toLocaleString()}`,
    ...(discountedPrice && {
      discounted_price: `${product.currency}${discountedPrice.toLocaleString()}`,
      you_save: `${product.discount_percentage}% OFF`,
    }),
    stock: product.stock_quantity > 0 ? `In stock (${product.stock_quantity} units)` : 'Out of stock',
    rating: `${product.rating}/5 (${product.review_count} reviews)`,
    description: product.short_description,
    details: product.long_description,
    specifications: product.specifications,
    top_reviews: product.reviews.slice(0, 3).map((r) => `${r.rating}/5 — ${r.comment}`),
    tags: product.tags,
  });

  const system = `You are the SmartCart Product Assistant.

${RULES}

=== PRODUCT CONTEXT ===
${context}`;

  return [
    { role: 'system', content: system },
    ...history.slice(-6), // keep last 3 turns (6 messages)
    { role: 'user', content: userQuery },
  ];
}

// ─── Comparison Prompt ────────────────────────────────────────────────────────

export function buildComparisonPrompt(
  products: ProductContext[],
  userQuery: string
): Message[] {
  const productsContext = products
    .map((p, i) => {
      const ctx = jsonToText({
        product: p.product_title,
        brand: p.brand,
        price: `${p.currency}${p.price.toLocaleString()}`,
        rating: `${p.rating}/5`,
        stock: p.stock_quantity > 0 ? 'In stock' : 'Out of stock',
        specifications: p.specifications,
      });
      return `--- Product ${i + 1} ---\n${ctx}`;
    })
    .join('\n\n');

  const system = `You are the SmartCart Product Comparison Assistant.

${RULES}
RULE 5: Compare objectively — highlight trade-offs clearly.
RULE 6: If a spec is missing for a product, say "not specified" — do not guess.

=== PRODUCTS TO COMPARE ===
${productsContext}`;

  return [
    { role: 'system', content: system },
    { role: 'user', content: userQuery },
  ];
}

// ─── Conversation History Formatter ──────────────────────────────────────────

export function formatHistory(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Message[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}
