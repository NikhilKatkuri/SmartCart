'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadCartProducts();
  }, [cart]);

  const loadCartProducts = async () => {
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
          } catch (error) {
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
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
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
                  className="bg-white rounded-lg border border-gray-200 p-6 flex gap-4"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0" />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.details?.product_title || `Product ${item.product_id}`}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.details?.currency}
                      {discountedPrice.toLocaleString()} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 border border-gray-200 rounded-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      {item.details?.currency}
                      {itemTotal.toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition flex items-center gap-1"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{getTotalOriginalPrice().toLocaleString()}</span>
                </div>
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Total Savings:</span>
                    <span>-₹{getTotalSavings().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
                <span>Total:</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
