'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { productAPI } from '@/lib/api';
import { VirtualProductGrid } from '@/components/VirtualProductGrid';

interface Product {
  product_id: string;
  product_title: string;
  price: number;
  discount_percentage: number;
  rating: number;
  review_count: number;
  short_description: string;
  stock_quantity: number;
  category: string;
  currency: string;
  image_url?: string | null;
  Img_URL?: string | null;
}

interface Category {
  name: string;
  sub_categories: string[];
}

export default function HomePage() {
  const pageSize = 40;
  const [products, setProducts] = useState<Array<Product | undefined>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    minRating: 0,
  });

  const loadedPages = useRef(new Set<number>());
  const loadingPages = useRef(new Set<number>());

  const resetFeed = useCallback(() => {
    loadedPages.current.clear();
    loadingPages.current.clear();
    setProducts([]);
    setTotalCount(0);
  }, []);

  const loadPage = useCallback(async (page: number) => {
    if (loadedPages.current.has(page) || loadingPages.current.has(page)) return;
    loadingPages.current.add(page);
    setIsLoading(true);

    try {
      const response = await productAPI.getAllProducts({
        page,
        limit: pageSize,
        ...(filters.category && { category: filters.category }),
        ...(filters.subCategory && { sub_category: filters.subCategory }),
        ...(filters.minRating > 0 && { minRating: filters.minRating }),
      });

      const total = response.pagination?.total || response.data?.length || 0;
      const nextProducts = response.data || [];

      setTotalCount(total);
      setProducts((prev) => {
        const merged = prev.length === total ? [...prev] : Array(total).fill(undefined);
        const startIndex = (page - 1) * pageSize;
        nextProducts.forEach((item: Product, idx: number) => {
          merged[startIndex + idx] = item;
        });
        return merged;
      });

      loadedPages.current.add(page);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      loadingPages.current.delete(page);
      setIsLoading(false);
    }
  }, [filters.category, filters.minRating]);

  const loadMoreItems = useCallback(async (startIndex: number, stopIndex: number) => {
    const startPage = Math.floor(startIndex / pageSize) + 1;
    const endPage = Math.floor(stopIndex / pageSize) + 1;
    const tasks = [];

    for (let page = startPage; page <= endPage; page += 1) {
      tasks.push(loadPage(page));
    }

    await Promise.all(tasks);
  }, [loadPage]);

  const isItemLoaded = useCallback((index: number) => {
    return Boolean(products[index]);
  }, [products]);

  useEffect(() => {
    resetFeed();
    loadPage(1);
  }, [filters, loadPage, resetFeed]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await productAPI.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="uppercase tracking-[0.4em] text-xs text-muted">Product Discovery</p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              A calm, curated feed of products with real signal, not noise.
            </h1>
            <p className="text-muted max-w-2xl">
              Explore a zero-clutter grid with AI-ready product context and instant detail transitions.
            </p>
          </div>

          <div className="glass-panel rounded-3xl px-5 py-4 flex flex-col gap-4">
            {/* Upper div 1 */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-xs uppercase tracking-[0.3em] text-muted">
                  Filters
                </div>

                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                      subCategory: '',
                    }))
                  }
                  className="px-4 py-2 rounded-full border border-white/60 bg-white/80 text-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {filters.category && (
                  <select
                    value={filters.subCategory}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        subCategory: e.target.value,
                      }))
                    }
                    className="px-4 py-2 rounded-full border border-white/60 bg-white/80 text-sm"
                  >
                    <option value="">All sub-categories</option>
                    {categories
                      .find((category) => category.name === filters.category)
                      ?.sub_categories?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                )}

                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minRating: Number(e.target.value),
                    }))
                  }
                  className="px-4 py-2 rounded-full border border-white/60 bg-white/80 text-sm"
                >
                  <option value={0}>Any rating</option>
                  <option value={4}>4+ stars</option>
                  <option value={3}>3+ stars</option>
                  <option value={2}>2+ stars</option>
                </select>
              </div>

              <div className="text-sm text-muted">
                {isLoading ? 'Updating feed...' : `${totalCount.toLocaleString()} products`}
              </div>
            </div>

            {/* Upper div 2 removed - sub-category select lives in main filter row */}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {totalCount === 0 && !isLoading ? (
          <div className="text-center text-muted py-20">No products found.</div>
        ) : (
          <VirtualProductGrid
            products={products}
            totalCount={totalCount}
            isItemLoaded={isItemLoaded}
            loadMoreItems={loadMoreItems}
          />
        )}
      </section>
    </div>
  );
}
