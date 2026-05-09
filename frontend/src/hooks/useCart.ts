'use client';

import { useState, useEffect, useCallback } from 'react';
import { cartStorage, CartItem, wishlistStorage, WishlistItem } from '@/lib/storage';

/**
 * Hook for managing cart
 */
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage on mount
    setCart(cartStorage.getCart());
    setIsLoading(false);
  }, []);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart(cartStorage.addToCart(productId, quantity));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(cartStorage.removeFromCart(productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(cartStorage.updateQuantity(productId, quantity));
  }, []);

  const clearCart = useCallback(() => {
    cartStorage.clearCart();
    setCart([]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    hasItems: cart.length > 0,
  };
}

/**
 * Hook for managing wishlist
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage on mount
    setWishlist(wishlistStorage.getWishlist());
    setIsLoading(false);
  }, []);

  const addToWishlist = useCallback((productId: string) => {
    setWishlist(wishlistStorage.addToWishlist(productId));
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(wishlistStorage.removeFromWishlist(productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    wishlistStorage.clearWishlist();
    setWishlist([]);
  }, []);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    totalItems: wishlist.length,
    hasItems: wishlist.length > 0,
  };
}
