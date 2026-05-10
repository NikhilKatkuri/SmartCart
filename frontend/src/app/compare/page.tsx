'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
      specifications: Record<string, string>;
}

export default function ComparePage() {
      const searchParams = useSearchParams();
      const [products, setProducts] = useState<Product[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [searchInput, setSearchInput] = useState('');
      const [aiSummary, setAiSummary] = useState('');
      const [aiStatus, setAiStatus] = useState('');

      // Use a ref to track the last compared product IDs to prevent redundant AI calls
      const lastComparedIds = useRef<string>('');

      const createSessionId = () => {
            if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
                  return crypto.randomUUID();
            }
            return `sc_${Math.random().toString(36).slice(2)}`;
      };

      const loadProducts = useCallback(async (productIds: string[]) => {
            if (productIds.length === 0) {
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
                  const validProducts = loaded.filter(Boolean).slice(0, 3);
                  setProducts(validProducts);
            } catch (error) {
                  console.error('Error loading products:', error);
            } finally {
                  setIsLoading(false);
            }
      }, []);

      const sideLoadSimilarProducts = useCallback(async (currentProducts: Product[]) => {
            // Only side-load if we have exactly 1 or 2 products
            if (currentProducts.length >= 3 || currentProducts.length === 0) return;

            const baseCategory = currentProducts[0].category;
            try {
                  const response = await productAPI.getAllProducts({
                        page: 1,
                        limit: 6,
                        category: baseCategory,
                  });

                  const candidates = (response.data || []).filter(
                        (item: Product) => !currentProducts.find((p) => p.product_id === item.product_id)
                  );

                  if (candidates.length > 0) {
                        setProducts(prev => {
                              const merged = [...prev, ...candidates];
                              return merged.slice(0, 3);
                        });
                  }
            } catch (error) {
                  console.error('Error loading similar products:', error);
            }
      }, []);

      const loadAICompare = useCallback(async (items: Product[]) => {
            const idsString = items.map(p => p.product_id).sort().join(',');
            if (items.length < 2 || lastComparedIds.current === idsString) return;

            lastComparedIds.current = idsString;
            setAiSummary('');
            setAiStatus('Preparing comparison...');

            try {
                  await aiAPI.compareProducts({
                        productIds: items.map((item) => item.product_id),
                        sessionId: createSessionId(),
                        query: 'Compare the key strengths, trade-offs, and best-fit use cases for each product.',
                        onEvent: (event: unknown) => {
                              if (event.type === 'status') {
                                    setAiStatus(event.message || 'Thinking...');
                              }
                              if (event.type === 'chunk' && event.data?.content) {
                                    setAiSummary((prev) => `${prev}${event.data.content}`);
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
      }, []);

      // Effect 1: Initial Load from URL
      useEffect(() => {
            const query = searchParams.get('products');
            if (query) {
                  const initialProductIds = query.split(',');
                  loadProducts(initialProductIds);
            } else {
                  setIsLoading(false);
            }
      }, [searchParams, loadProducts]);

      // Effect 2: Logic for AI comparison and Side-loading
      useEffect(() => {
            if (products.length > 0 && products.length < 3) {
                  sideLoadSimilarProducts(products);
            }
            if (products.length >= 2) {
                  loadAICompare(products);
            }
      }, [products.length, sideLoadSimilarProducts, loadAICompare, products]);
      // Dependency on products.length to avoid unnecessary re-triggers

      const addProduct = async () => {
            if (!searchInput.trim() || products.length >= 3) return;

            try {
                  const results = await productAPI.searchProducts(searchInput, 5);
                  if (results.data && results.data.length > 0) {
                        const newProduct = results.data[0];
                        if (!products.find((p) => p.product_id === newProduct.product_id)) {
                              setProducts(prev => [...prev, newProduct].slice(0, 3));
                              setSearchInput('');
                        }
                  }
            } catch (error) {
                  console.error('Error searching products:', error);
            }
      };

      const removeProduct = (productId: string) => {
            setProducts(prev => prev.filter((p) => p.product_id !== productId));
      };

      const commonSpecifications = products.reduce((acc, product) => {
            const keys = Object.keys(product.specifications || {});
            if (acc.length === 0) return keys;
            return acc.filter((key) => keys.includes(key));
      }, [] as string[]);

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
                        <p className="text-muted">We side-load similar products and highlight what truly differs.</p>
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                              <div key={product.product_id} className="glass-panel rounded-3xl p-6 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                          <div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-muted">{product.brand}</p>
                                                <h2 className="text-lg font-semibold">{product.product_title}</h2>
                                          </div>
                                          <button
                                                onClick={() => removeProduct(product.product_id)}
                                                className="text-xs text-muted hover:text-black transition-colors"
                                          >
                                                Remove
                                          </button>
                                    </div>
                                    <div className="text-sm text-muted">
                                          {product.currency}{Math.round(product.price * (1 - product.discount_percentage / 100)).toLocaleString()}
                                          <span className="ml-2 text-xs line-through">
                                                {product.currency}{product.price.toLocaleString()}
                                          </span>
                                    </div>
                                    <div className="text-xs text-muted">
                                          {product.rating} stars · {product.review_count} reviews
                                    </div>
                              </div>
                        ))}
                  </div>

                  <div className="glass-panel rounded-3xl p-8 space-y-6 border border-white/20">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted font-semibold">
                              <Sparkles size={14} className={aiStatus ? "animate-pulse" : ""} />
                              AI Analysis
                        </div>

                        {aiStatus && (
                              <p className="text-sm text-muted animate-pulse italic">
                                    {aiStatus}
                              </p>
                        )}

                        <div className="prose prose-sm prose-neutral max-w-none">
                              {aiSummary ? (
                                    <ReactMarkdown
                                          components={{
                                                // Custom styling for markdown elements to keep it "clean"
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
                        {/* Header Row */}
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

                        {/* Specification Rows */}
                        {commonSpecifications.map((spec) => {
                              const values = products.map((product) => product.specifications?.[spec] || '—');
                              const allSame = values.every((value) => value === values[0]);

                              return (
                                    <div
                                          key={spec}
                                          className="grid border-b border-white/10 hover:bg-white/5 transition-colors group"
                                          style={{ gridTemplateColumns: `repeat(${products.length + 1}, minmax(0, 1fr))` }}
                                    >
                                          {/* Label Column */}
                                          <div className="p-4 text-sm text-muted bg-white/5 border-r border-white/10 font-medium">
                                                {spec}
                                          </div>

                                          {/* Data Columns */}
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