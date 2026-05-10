'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { productAPI } from '@/lib/api';
import { Filter } from 'lucide-react';

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
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await productAPI.getAllProducts({
        page,
        limit: pagination.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: parseInt(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: parseInt(filters.maxPrice) }),
        ...(filters.minRating && { minRating: parseFloat(filters.minRating) }),
      });

      setProducts(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit]);
  
  // Load products
  useEffect(() => {
    loadProducts(1);
  }, [filters, loadProducts]);



  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      loadProducts(nextPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to SmartCart</h1>
          <p className="text-xl text-blue-100">
            Discover amazing products with AI-powered recommendations
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600">
              Showing {products.length} of {pagination.total} products
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 lg:hidden">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Electronics, Clothing"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    minRating: '',
                  })
                }
                className="w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Desktop Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop Only */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-6">Filters</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="Search category"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    setFilters({
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      minRating: '',
                    })
                  }
                  className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              hasMore={pagination.page < pagination.totalPages}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
