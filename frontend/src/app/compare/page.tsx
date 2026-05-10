'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader, Plus, Sparkles } from 'lucide-react';
import { productAPI, aiAPI } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

interface Product {
      product_id: string;
      product_title: string;
      brand: string;
      price: number;
      discount_percentage: number;
      currency: string;
      rating: number;
      review_count: number;
      stock_quantity: number;
      category: string;
      sub_category: string;
      specifications: Record<string, string>;
      variants?: Array<{ variant_name: string; variant_value: string }>;
}

type AIEvent =
      | { type: 'status'; message?: string }
      | { type: 'chunk'; data?: { content?: string } }
      | { type: 'complete' }
      | { type: string;[key: string]: unknown };

export default function ComparePage() {
      const searchParams = useSearchParams();
      const [products, setProducts] = useState<Product[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [searchInput, setSearchInput] = useState('');
      const [aiSummary, setAiSummary] = useState('');
      const [aiStatus, setAiStatus] = useState('');
      const lastComparedIds = useRef<string>('');

      const createSessionId = useCallback(() => {
            if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
                  return crypto.randomUUID();
            }
            return `sc_${Math.random().toString(36).slice(2)}`;
      }, []);

      const loadProducts = useCallback(async (productIds: string[]) => {
            if (productIds.length === 0) {
                  setProducts([]);
                  setIsLoading(false);
                  return;
            }

            setIsLoading(true);
            try {
                  const loaded = await Promise.all(
                        productIds.map((id) =>
                              productAPI.getProductById(id).then((res) => res.product || res.data)
                        )
                  );

                  const validProducts = loaded.filter(Boolean).slice(0, 3) as Product[];
                  setProducts(validProducts);
            } catch (error) {
                  console.error('Error loading products:', error);
                  setProducts([]);
            } finally {
                  setIsLoading(false);
            }
      }, []);


      const loadAICompare = useCallback(async (items: Product[]) => {
            if (items.length < 2) return;

            const idsString = items.map((p) => p.product_id).sort().join(',');
            if (lastComparedIds.current === idsString) return;

            lastComparedIds.current = idsString;
            setAiSummary('');
            setAiStatus('Preparing comparison...');

            try {
                  await aiAPI.compareProducts({
                        productIds: items.map((item) => item.product_id),
                        sessionId: createSessionId(),
                        query: 'Compare the key strengths, trade-offs, and best-fit use cases for each product.',
                        onEvent: (event: AIEvent) => {
                              if (event.type === 'status') {
                                    setAiStatus(event.message || 'Thinking...');
                              }

                              if (event.type === 'chunk' && event.data?.content) {
                                    setAiSummary((prev) => `${prev}${event.data?.content || ''}`);
                              }

                              if (event.type === 'complete') {
                                    setAiStatus('');
                              }
                        },
                  });
            } catch (error) {
                  console.error('Error loading AI comparison:', error);
                  setAiStatus('Failed to load AI comparison.');
            }
      }, [createSessionId]);

      useEffect(() => {
            const query = searchParams.get('products');
            if (query) {
                  const initialProductIds = query
                        .split(',')
                        .map((id) => id.trim())
                        .filter(Boolean);

                  loadProducts(initialProductIds);
            } else {
                  setIsLoading(false);
                  setProducts([]);
            }
      }, [searchParams, loadProducts]);

      useEffect(() => {
            if (products.length >= 2) {
                  loadAICompare(products);
            }
      }, [products, loadAICompare]);

      const addProduct = async () => {
            const term = searchInput.trim();
            if (!term || products.length >= 3) return;

            try {
                  const results = await productAPI.searchProducts(term, 5);
                  const candidates = results.data || [];

                  if (candidates.length === 0) return;

                  const baseCategory = products[0]?.category;
                  const baseSubCategory = products[0]?.sub_category;

                  const newProduct =
                        products.length === 0
                              ? candidates[0]
                              : candidates.find(
                                    (item: Product) =>
                                          item.category === baseCategory && item.sub_category === baseSubCategory
                              );

                  if (!newProduct) return;
                  if (products.some((p) => p.product_id === newProduct.product_id)) return;

                  setProducts((prev) => [...prev, newProduct].slice(0, 3));
                  setSearchInput('');
                  lastComparedIds.current = '';
            } catch (error) {
                  console.error('Error searching products:', error);
            }
      };

      const removeProduct = (productId: string) => {
            setProducts((prev) => prev.filter((p) => p.product_id !== productId));
            lastComparedIds.current = '';
      };

      const commonSpecifications = useMemo(() => {
            if (products.length === 0) return [];

            return products.reduce((acc, product) => {
                  const keys = Object.keys(product.specifications || {});
                  if (acc.length === 0) return keys;
                  return acc.filter((key) => keys.includes(key));
            }, [] as string[]);
      }, [products]);

      if (isLoading && products.length === 0) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <Loader className="w-10 h-10 text-black animate-spin" />
                  </div>
            );
      }

      if (!isLoading && products.length === 0) {
            return (
                  <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                              <p className="text-gray-600 text-lg">Select products to compare.</p>
                              <Link href="/" className="text-black hover:underline mt-4 inline-block">
                                    Back to Home
                              </Link>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                  <div className="space-y-2">
                        <p className="uppercase tracking-[0.4em] text-xs text-muted">Smart Comparison</p>
                        <h1 className="text-4xl font-semibold">Compare products at a glance.</h1>
                        <p className="text-muted">Add related products and highlight what truly differs.</p>
                  </div>

                  {products.length < 3 && (
                        <div className="glass-panel rounded-3xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex items-center gap-3">
                                    <input
                                          type="text"
                                          placeholder="Search a product to add"
                                          value={searchInput}
                                          onChange={(e) => setSearchInput(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && addProduct()}
                                          className="px-4 py-2 rounded-full border border-white/60 bg-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <button
                                          onClick={addProduct}
                                          className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                                    >
                                          <Plus size={16} />
                                    </button>
                              </div>
                              <p className="text-sm text-muted">Compare up to 3 products.</p>
                        </div>
                  )}

                  <div
                        className="grid grid-cols-1 gap-6 lg:grid-cols-none"
                        style={{
                              gridTemplateColumns:
                                    typeof window === 'undefined'
                                          ? undefined
                                          : window.innerWidth >= 1024
                                                ? `repeat(${Math.min(products.length || 1, 3)}, minmax(0, 1fr))`
                                                : undefined,
                        }}
                  >
                        {products.map((product) => (
                              <div key={product.product_id} className="glass-panel rounded-3xl p-6 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                          <div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-muted">{product.brand}</p>
                                                <h2 className="text-lg font-semibold">{product.product_title}</h2>
                                                <p className="text-xs text-muted">
                                                      {product.category} · {product.sub_category}
                                                </p>
                                          </div>
                                          <button
                                                onClick={() => removeProduct(product.product_id)}
                                                className="text-xs text-muted hover:text-black transition-colors"
                                          >
                                                Remove
                                          </button>
                                    </div>

                                    <div className="text-sm text-muted">
                                          {product.currency}
                                          {Math.round(product.price * (1 - product.discount_percentage / 100)).toLocaleString()}
                                          <span className="ml-2 text-xs line-through">
                                                {product.currency}
                                                {product.price.toLocaleString()}
                                          </span>
                                    </div>

                                    <div className="text-xs text-muted">
                                          {product.rating} stars · {product.review_count} reviews
                                    </div>

                                    {product.variants && product.variants.length > 0 && (
                                          <div className="text-xs text-muted">
                                                Variants:{' '}
                                                {product.variants
                                                      .slice(0, 3)
                                                      .map((variant) => `${variant.variant_name}: ${variant.variant_value}`)
                                                      .join(' · ')}
                                          </div>
                                    )}
                              </div>
                        ))}
                  </div>

                  <div className="glass-panel rounded-3xl p-8 space-y-6 border border-white/20">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted font-semibold">
                              <Sparkles size={14} className={aiStatus ? 'animate-pulse' : ''} />
                              AI Analysis
                        </div>

                        {aiStatus && (
                              <p className="text-sm text-muted animate-pulse italic">{aiStatus}</p>
                        )}

                        <div className="prose prose-sm prose-neutral max-w-none">
                              {aiSummary ? (
                                    <ReactMarkdown
                                          components={{
                                                p: ({ children }) => <p className="text-sm leading-relaxed text-black/80 mb-4">{children}</p>,
                                                strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
                                                ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4">{children}</ul>,
                                                li: ({ children }) => <li className="text-sm text-black/80">{children}</li>,
                                          }}
                                    >
                                          {aiSummary}
                                    </ReactMarkdown>
                              ) : (
                                    !aiStatus && (
                                          <p className="text-sm text-muted/60 italic">
                                                Select at least two products to generate a smart comparison summary.
                                          </p>
                                    )
                              )}
                        </div>
                  </div>

                  <div className="glass-panel rounded-3xl overflow-hidden border border-white/20 p-3">
                        <div
                              className="grid border-b border-white/40 text-xs uppercase tracking-[0.3em] text-muted bg-white/5"
                              style={{ gridTemplateColumns: `repeat(${products.length + 1}, minmax(0, 1fr))` }}
                        >
                              <div className="p-4 font-medium border-r border-white/10">Specifications</div>
                              {products.map((product) => (
                                    <div key={product.product_id} className="p-4 font-semibold truncate text-center md:text-left">
                                          {product.product_title}
                                    </div>
                              ))}
                        </div>

                        {commonSpecifications.length === 0 && (
                              <div className="p-6 text-sm text-muted">
                                    No common specifications available for these products.
                              </div>
                        )}

                        {commonSpecifications.map((spec) => {
                              const values = products.map((product) => product.specifications?.[spec] || '—');
                              const allSame = values.every((value) => value === values[0]);

                              return (
                                    <div
                                          key={spec}
                                          className="grid border-b border-white/10 hover:bg-white/5 transition-colors group"
                                          style={{ gridTemplateColumns: `repeat(${products.length + 1}, minmax(0, 1fr))` }}
                                    >
                                          <div className="p-4 text-sm text-muted bg-white/5 border-r border-white/10 font-medium">
                                                {spec}
                                          </div>

                                          {values.map((value, index) => (
                                                <div key={`${spec}-${index}`} className="p-4 text-sm flex items-center justify-center md:justify-start">
                                                      <span className={allSame ? 'opacity-40' : 'font-medium text-black'}>
                                                            {value}
                                                      </span>
                                                </div>
                                          ))}
                                    </div>
                              );
                        })}
                  </div>
            </div>
      );
}