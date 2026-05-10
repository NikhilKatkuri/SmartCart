'use client';

import ProductCard from './productCard';
import { SkeletonCard } from '@/components/SkeletonCard';

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

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function ProductGrid({
  products,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: ProductGridProps) {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.product_id} data={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/90 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? (
              'Loading...'
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
