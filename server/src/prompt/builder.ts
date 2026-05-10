import { jsonToText } from '../utils/jsonToText';
import type { ProductContext, Message } from '../types';

// ─── Rules ────────────────────────────────────────────────────────────────────

const RULES = `
RULE 1: Use ONLY the provided product data to answer.
RULE 2: If something is not in the data, say "I don't have that information."
RULE 3: Never mention you are an AI or that you were given a dataset.
RULE 4: Answer like a knowledgeable friend — honest, direct, no fluff.
RULE 5: If the product is NOT a good fit for the user's need, say so clearly.
`.trim();

// ─── Single Product — "Is this good for me?" ─────────────────────────────────

export function buildProductPrompt(
      product: ProductContext,
      userQuery: string,
      history: Message[] = []
): Message[] {
      const discountedPrice =
            product.discount_percentage > 0
                  ? Math.round(product.price * (1 - product.discount_percentage / 100))
                  : null;

      const context = jsonToText({
            product: product.product_title,
            brand: product.brand,
            category: product.category,
            price: `${product.currency}${product.price.toLocaleString()}`,
            ...(discountedPrice && {
                  offer_price: `${product.currency}${discountedPrice.toLocaleString()} (${product.discount_percentage}% off)`,
            }),
            stock: product.stock_quantity > 0 ? `In stock` : 'Out of stock',
            rating: `${product.rating}/5 from ${product.review_count} reviews`,
            description: product.short_description,
            details: product.long_description,
            specifications: product.specifications,
            variants: product.variants.length > 0 ? product.variants : 'No variants',
            what_buyers_say: product.reviews
                  .slice(0, 3)
                  .map((r) => `"${r.comment}" (${r.rating}/5)`),
      });

      const system = `You are SmartCart Assistant — a sharp, honest product advisor.

${RULES}

When the user asks if a product fits their need:
- Look at their specific use case (gaming, travel, editing, students, etc.)
- Match it against the specs and reviews
- Give a clear YES / NO / DEPENDS with a short reason
- Mention 1-2 specific specs that support your answer
- If there's a better variant (RAM, color, size), suggest it

=== PRODUCT DATA ===
${context}`;

      return [
            { role: 'system', content: system },
            ...history.slice(-6),
            { role: 'user', content: userQuery },
      ];
}

// ─── Multi Product — "Which of these fits me?" ───────────────────────────────

export function buildComparisonPrompt(
      products: ProductContext[],
      userQuery: string
): Message[] {
      const productsContext = products
            .map((p, i) => {
                  const discountedPrice =
                        p.discount_percentage > 0
                              ? Math.round(p.price * (1 - p.discount_percentage / 100))
                              : null;

                  return `--- Option ${i + 1}: ${p.product_title} ---\n` + jsonToText({
                        brand: p.brand,
                        price: discountedPrice
                              ? `${p.currency}${discountedPrice.toLocaleString()} (was ${p.currency}${p.price.toLocaleString()})`
                              : `${p.currency}${p.price.toLocaleString()}`,
                        rating: `${p.rating}/5 from ${p.review_count} reviews`,
                        stock: p.stock_quantity > 0 ? 'In stock' : 'Out of stock',
                        specifications: p.specifications,
                        key_reviews: p.reviews.slice(0, 2).map((r) => `"${r.comment}" (${r.rating}/5)`),
                  });
            })
            .join('\n\n');

      const system = `You are SmartCart Assistant — a sharp, honest product advisor.

${RULES}
RULE 6: Pick ONE winner for the user's specific need — don't sit on the fence.
RULE 7: If a spec is missing, say "not listed" — never guess.
RULE 8: Keep it conversational, not a table or bullet dump.

When comparing:
- Understand the user's actual use case from their question
- Find which product's specs best match that use case
- Recommend clearly: "For [use case], go with Option X because..."
- Mention the key trade-off (price vs performance, weight vs power, etc.)
- If none fit well, say so honestly

=== PRODUCTS ===
${productsContext}`;

      return [
            { role: 'system', content: system },
            { role: 'user', content: userQuery },
      ];
}

// ─── History formatter ────────────────────────────────────────────────────────

export function formatHistory(
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Message[] {
      return messages.map((m) => ({ role: m.role, content: m.content }));
}