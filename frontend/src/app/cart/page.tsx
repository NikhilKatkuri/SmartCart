'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/hooks/useCart';
import { productAPI } from '@/lib/api';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface CartProduct {
  product_id: string;
  quantity: number;
  details?: {
    product_title: string;
    price: number;
    currency: string;
    discount_percentage: number;
  };
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCartProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const enriched = await Promise.all(
        cart.map(async (item) => {
          try {
            const response = await productAPI.getProductById(item.product_id);
            const product = response.product || response.data;
            return {
              ...item,
              details: {
                product_title: product?.product_title,
                price: product?.price,
                currency: product?.currency,
                discount_percentage: product?.discount_percentage || 0,
              },
            };
          } catch {
            return item;
          }
        })
      );
      setCartProducts(enriched);
    } catch (error) {
      console.error('Error loading cart products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart])

  useEffect(() => {
    loadCartProducts();
  }, [cart, loadCartProducts]);

 

  const getTotalPrice = () => {
    return cartProducts.reduce((total, item) => {
      if (!item.details) return total;
      const discountedPrice = Math.round(
        item.details.price * (1 - item.details.discount_percentage / 100)
      );
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const getTotalOriginalPrice = () => {
    return cartProducts.reduce(
      (total, item) => total + (item.details?.price || 0) * item.quantity,
      0
    );
  };

  const getTotalSavings = () => {
    return getTotalOriginalPrice() - getTotalPrice();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
            <h1 className="text-3xl font-semibold mb-2">Your cart is empty</h1>
            <p className="text-muted mb-6">Add products to begin checkout.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white text-sm"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="uppercase tracking-[0.4em] text-xs text-muted">Checkout</p>
          <h1 className="text-4xl font-semibold">Shopping cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((item) => {
              const discountedPrice = Math.round(
                (item.details?.price || 0) *
                (1 - (item.details?.discount_percentage || 0) / 100)
              );
              const itemTotal = discountedPrice * item.quantity;

              return (
                <div
                  key={item.product_id}
                  className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="w-24 h-24 bg-white/70 rounded-2xl shrink-0" />

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.details?.product_title || `Product ${item.product_id}`}
                      </h3>
                      <p className="text-sm text-muted">
                        {item.details?.currency}{discountedPrice.toLocaleString()} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="h-8 w-8 rounded-full border border-white/60 bg-white/80"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1 rounded-full border border-white/60">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full border border-white/60 bg-white/80"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                    <p className="text-2xl font-semibold">
                      {item.details?.currency}{itemTotal.toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-xs text-muted hover:text-black flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className="glass-panel rounded-3xl p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6">Order summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-white/30 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>₹{getTotalOriginalPrice().toLocaleString()}</span>
                </div>
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between text-black font-medium">
                    <span>Savings</span>
                    <span>-₹{getTotalSavings().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-semibold mb-6">
                <span>Total</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-full text-sm hover:bg-black/90 transition-colors mb-3">
                Proceed to checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full border border-white/60 text-muted py-3 rounded-full text-sm hover:text-black hover:border-black/20 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
