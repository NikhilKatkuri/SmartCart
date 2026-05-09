'use client';

import { useState, useEffect } from 'react';
import { useWishlist } from '@/hooks/useCart';
import { useCart } from '@/hooks/useCart';
import { productAPI } from '@/lib/api';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface WishlistProduct {
  product_id: string;
  product_title: string;
  price: number;
  currency: string;
  discount_percentage: number;
  rating: number;
  short_description: string;
  stock_quantity: number;
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlist]);

  const loadWishlistProducts = async () => {
    setIsLoading(true);
    try {
      const products = await Promise.all(
        wishlist.map((item) =>
          productAPI
            .getProductById(item.product_id)
            .then((res) => res.product || res.data)
            .catch(() => null)
        )
      );
      setWishlistProducts(products.filter(Boolean) as WishlistProduct[]);
    } catch (error) {
      console.error('Error loading wishlist products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-6">Save products you love to your wishlist</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Wishlist ({wishlistProducts.length} items)
          </h1>
          <button
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => {
            const discountedPrice = Math.round(
              product.price * (1 - product.discount_percentage / 100)
            );

            return (
              <div
                key={product.product_id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-3xl font-bold opacity-20">Product</div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    href={`/product/${product.product_id}`}
                    className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2"
                  >
                    {product.product_title}
                  </Link>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.short_description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.currency}{discountedPrice.toLocaleString()}
                    </span>
                    {product.discount_percentage > 0 && (
                      <span className="text-lg text-gray-400 line-through">
                        {product.currency}{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product.product_id)}
                      disabled={product.stock_quantity === 0}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      <span className="hidden sm:inline">Add</span>
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product.product_id)}
                      className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart size={16} fill="currentColor" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
