'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishlist } from '@/hooks/useCart';
import { useCart } from '@/hooks/useCart';

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
  currency?: string;
  image_url?: string | null;
}

const ProductCard = ({ data }: { data: Product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(data.product_id);
  const discountedPrice = Math.round(data.price * (1 - (data.discount_percentage || 0) / 100));
  const savingsAmount = data.price - discountedPrice;

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Placeholder */}
      <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative group">
        <div className="text-gray-400 text-center px-4">
          <div className="text-3xl font-bold opacity-20">{data.category}</div>
          <div className="text-xs opacity-10 mt-2">{data.product_title}</div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(data.product_id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:scale-110"
        >
          <Heart
            size={18}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Discount Badge */}
        {(data.discount_percentage || 0) > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{data.discount_percentage}%
          </div>
        )}

        {/* Stock Status */}
        {data.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <Link
          href={`/product/${data.product_id}`}
          className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2"
        >
          {data.product_title}
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{data.short_description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(data.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {data.rating} ({data.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {data.currency || '₹'}{discountedPrice.toLocaleString()}
          </span>
          {(data.discount_percentage || 0) > 0 && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {data.currency || '₹'}{data.price.toLocaleString()}
              </span>
              <span className="text-sm text-green-600 font-semibold">
                Save {data.currency || '₹'}{savingsAmount.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(data.product_id)}
            disabled={data.stock_quantity === 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>

          <Link
            href={`/product/${data.product_id}`}
            className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-colors text-center text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;