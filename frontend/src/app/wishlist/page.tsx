'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const loadWishlistProducts = useCallback(async () => {
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
  }, [wishlist]);

  useEffect(() => {
    loadWishlistProducts();
  }, [loadWishlistProducts, wishlist]);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
            <h1 className="text-3xl font-semibold mb-2">Your wishlist is empty</h1>
            <p className="text-muted mb-6">Save products you love for later.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white text-sm"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-muted">Wishlist</p>
            <h1 className="text-4xl font-semibold">
              Saved items ({wishlistProducts.length})
            </h1>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-muted hover:text-black"
          >
            Clear wishlist
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
                className="glass-panel rounded-3xl overflow-hidden"
              >
                <div className="aspect-4/5 bg-white/70 flex items-center justify-center">
                  <div className="text-xs uppercase tracking-[0.4em] text-muted">Product</div>
                </div>

                <div className="p-5 space-y-4">
                  <Link
                    href={`/product/${product.product_id}`}
                    className="block text-lg font-medium hover:text-black/60 transition-colors line-clamp-2"
                  >
                    {product.product_title}
                  </Link>

                  <p className="text-sm text-muted line-clamp-2">
                    {product.short_description}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold">
                      {product.currency}{discountedPrice.toLocaleString()}
                    </span>
                    {product.discount_percentage > 0 && (
                      <span className="text-xs text-muted line-through">
                        {product.currency}{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product.product_id)}
                      disabled={product.stock_quantity === 0}
                      className="flex-1 bg-black text-white py-2 rounded-full text-xs hover:bg-black/90 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} /> Add
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product.product_id)}
                      className="flex-1 border border-white/60 text-muted py-2 rounded-full text-xs hover:text-black hover:border-black/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Heart size={14} fill="currentColor" /> Remove
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
