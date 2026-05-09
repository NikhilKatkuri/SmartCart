/**
 * Local Storage utilities for Cart and Wishlist
 */

export interface CartItem {
  product_id: string;
  quantity: number;
  addedAt: number;
}

export interface WishlistItem {
  product_id: string;
  addedAt: number;
}

// Cart management
export const cartStorage = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const cart = localStorage.getItem('smartcart_cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  },

  addToCart: (productId: string, quantity = 1): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = cartStorage.getCart();
    const existingItem = cart.find((item) => item.product_id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product_id: productId, quantity, addedAt: Date.now() });
    }

    localStorage.setItem('smartcart_cart', JSON.stringify(cart));
    return cart;
  },

  removeFromCart: (productId: string): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = cartStorage.getCart();
    const filtered = cart.filter((item) => item.product_id !== productId);
    localStorage.setItem('smartcart_cart', JSON.stringify(filtered));
    return filtered;
  },

  updateQuantity: (productId: string, quantity: number): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = cartStorage.getCart();
    const item = cart.find((item) => item.product_id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    localStorage.setItem('smartcart_cart', JSON.stringify(cart));
    return cart;
  },

  clearCart: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('smartcart_cart');
  },
};

// Wishlist management
export const wishlistStorage = {
  getWishlist: (): WishlistItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const wishlist = localStorage.getItem('smartcart_wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  },

  addToWishlist: (productId: string): WishlistItem[] => {
    if (typeof window === 'undefined') return [];
    const wishlist = wishlistStorage.getWishlist();
    if (!wishlist.find((item) => item.product_id === productId)) {
      wishlist.push({ product_id: productId, addedAt: Date.now() });
      localStorage.setItem('smartcart_wishlist', JSON.stringify(wishlist));
    }
    return wishlist;
  },

  removeFromWishlist: (productId: string): WishlistItem[] => {
    if (typeof window === 'undefined') return [];
    const wishlist = wishlistStorage.getWishlist();
    const filtered = wishlist.filter((item) => item.product_id !== productId);
    localStorage.setItem('smartcart_wishlist', JSON.stringify(filtered));
    return filtered;
  },

  isInWishlist: (productId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const wishlist = wishlistStorage.getWishlist();
    return wishlist.some((item) => item.product_id === productId);
  },

  clearWishlist: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('smartcart_wishlist');
  },
};

// Session storage for AI chat (1 hour expiry)
const AI_CHAT_SESSION_PREFIX = 'smartcart_ai_chat_';
const SESSION_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AISession {
  messages: AIMessage[];
  createdAt: number;
  expiresAt: number;
}

export const aiSessionStorage = {
  getSessionKey: (productId: string): string => {
    return `${AI_CHAT_SESSION_PREFIX}${productId}`;
  },

  getSession: (productId: string): AISession | null => {
    if (typeof window === 'undefined') return null;
    try {
      const key = aiSessionStorage.getSessionKey(productId);
      const session = sessionStorage.getItem(key);
      if (!session) return null;

      const parsed = JSON.parse(session) as AISession;
      // Check if expired
      if (Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch (error) {
      console.error('Error reading AI session:', error);
      return null;
    }
  },

  createSession: (productId: string): AISession => {
    if (typeof window === 'undefined') return { messages: [], createdAt: 0, expiresAt: 0 };
    const session: AISession = {
      messages: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_EXPIRY_TIME,
    };
    const key = aiSessionStorage.getSessionKey(productId);
    sessionStorage.setItem(key, JSON.stringify(session));
    return session;
  },

  addMessage: (productId: string, message: AIMessage): AISession => {
    if (typeof window === 'undefined') return { messages: [], createdAt: 0, expiresAt: 0 };
    let session = aiSessionStorage.getSession(productId);
    if (!session) {
      session = aiSessionStorage.createSession(productId);
    }
    session.messages.push(message);
    const key = aiSessionStorage.getSessionKey(productId);
    sessionStorage.setItem(key, JSON.stringify(session));
    return session;
  },

  clearSession: (productId: string) => {
    if (typeof window === 'undefined') return;
    const key = aiSessionStorage.getSessionKey(productId);
    sessionStorage.removeItem(key);
  },

  isSessionValid: (productId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const session = aiSessionStorage.getSession(productId);
    return session !== null && Date.now() <= session.expiresAt;
  },
};
