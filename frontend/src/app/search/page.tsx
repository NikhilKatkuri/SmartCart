'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { productAPI } from '@/lib/api';
import { ProductGrid } from '@/components/ProductGrid';
import { Loader } from 'lucide-react';

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts();
    }
  }, [query]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productAPI.searchProducts(query, 100);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="uppercase tracking-[0.4em] text-xs text-muted">Search</p>
          <h1 className="text-4xl font-semibold">Search Results</h1>
          <p className="text-muted text-lg">
            {isLoading ? 'Searching...' : `Found ${products.length} products for "${query}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-10 h-10 text-black animate-spin mx-auto mb-4" />
              <p className="text-muted">Searching products...</p>
            </div>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
