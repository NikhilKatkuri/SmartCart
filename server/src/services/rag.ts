/**
 * RAG Layer — Retrieval-Augmented Generation
 * Fetches product data from MongoDB and formats it for LLM context.
 * Prevents hallucination by grounding every response in real product data.
 */

import { ProductModel } from '../models/product/product';
import { ReviewModel } from '../models/product/review';
import { SpecificationsModel } from '../models/product/specifications';
import type { ProductContext } from '../types';

// ─── Retrieve single product ──────────────────────────────────────────────────

export async function retrieveProduct(productId: string): Promise<ProductContext | null> {
  const [product, specsDoc, reviews] = await Promise.all([
    ProductModel.findOne({ product_id: productId }).lean(),
    SpecificationsModel.findOne({ product_id: productId }).lean(),
    ReviewModel.find({ product_id: productId }).limit(5).lean(),
  ]);

  if (!product) return null;

  return formatProduct(product, specsDoc, reviews);
}

// ─── Retrieve multiple products (for comparison) ──────────────────────────────

export async function retrieveProducts(productIds: string[]): Promise<ProductContext[]> {
  const results = await Promise.all(productIds.map(retrieveProduct));
  return results.filter((p): p is ProductContext => p !== null);
}

// ─── Lightweight metadata (for route pre-validation) ─────────────────────────

export async function getProductMeta(productId: string) {
  console.log(`Fetching metadata for product: ${productId}`);
  return ProductModel.findOne(
    { product_id: productId },
    { product_id: 1, product_title: 1, brand: 1, category: 1, rating: 1, price: 1 }
  ).lean();
}

// ─── Format for LLM consumption ──────────────────────────────────────────────

function formatProduct(product: any, specsDoc: any, reviews: any[]): ProductContext {
  const specifications: Record<string, string> = {};

  if (specsDoc?.specifications && typeof specsDoc.specifications === 'object') {
    for (const [k, v] of Object.entries(specsDoc.specifications)) {
      if (v !== null && v !== undefined) {
        specifications[k] = String(v).substring(0, 100);
      }
    }
  }

  return {
    product_id: product.product_id ?? '',
    product_title: product.product_title ?? 'Unknown Product',
    brand: product.brand ?? 'Unknown',
    category: product.category ?? 'Uncategorized',
    price: Number(product.price) || 0,
    currency: product.currency ?? '₹',
    discount_percentage: Number(product.discount_percentage) || 0,
    stock_quantity: Number(product.stock_quantity) || 0,
    rating: Number(product.rating) || 0,
    review_count: Number(product.review_count) || 0,
    short_description: (product.short_description ?? '').substring(0, 500),
    long_description: (product.long_description ?? '').substring(0, 1500),
    specifications,
    reviews: reviews.slice(0, 5).map((r) => ({
      rating: Number(r.rating) || 0,
      comment: (r.comment ?? '').substring(0, 200),
    })),
    variants: Array.isArray(product.variants)
      ? product.variants.slice(0, 5).map((v: any) => {
          const variantSpecs: Record<string, string> = {};
          if (v.specifications && typeof v.specifications === 'object') {
            for (const [k, val] of Object.entries(v.specifications)) {
              if (val !== null && val !== undefined) {
                variantSpecs[k] = String(val).substring(0, 100);
              }
            }
          }
          return {
            variant_id: v.variant_id ?? '',
            variant_title: v.variant_title ?? '',
            specifications: variantSpecs,
          };
        })
      : [],
    tags: Array.isArray(product.tags) ? product.tags.slice(0, 10) : [],
  };
}
