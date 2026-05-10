'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useCart';
import { productAPI } from '@/lib/api';

interface SearchSuggestion {
  product_id: string;
  product_title: string;
  category: string;
  price: number;
  currency: string;
}

export function Navbar() {
  const router = useRouter();
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSuggestOpen(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsSuggestOpen(false);
      return;
    }

    setIsSuggestLoading(true);
    const handler = setTimeout(async () => {
      try {
        const response = await productAPI.searchProducts(searchQuery, 6);
        setSuggestions(response.data || []);
        setIsSuggestOpen(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setIsSuggestOpen(false);
      } finally {
        setIsSuggestLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSuggestionClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setSearchQuery('');
    setIsSuggestOpen(false);
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setIsSuggestOpen(false), 150);
  };

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    if (suggestions.length > 0) {
      setIsSuggestOpen(true);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 font-semibold text-lg">
            <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center text-sm tracking-[0.2em]">
              SC
            </div>
            <span>SmartCart</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products or brands"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <Search size={18} />
              </button>

              {isSuggestOpen && (
                <div className="absolute top-full mt-3 w-full rounded-2xl bg-white p-2 shadow-lg z-50">
                  {isSuggestLoading && (
                    <div className="px-4 py-3 text-xs text-muted">Searching...</div>
                  )}
                  {!isSuggestLoading && suggestions.length === 0 && (
                    <div className="px-4 py-3 text-xs text-muted">No results.</div>
                  )}
                  {!isSuggestLoading && suggestions.map((item) => (
                    <button
                      key={item.product_id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(item.product_id)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/80 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-primary">{item.product_title}</div>
                        <div className="text-xs text-muted">{item.category}</div>
                      </div>
                      <div className="text-xs text-muted">
                        {item.currency || '₹'}{item.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-6 text-sm text-muted">
              <Link href="/" className="hover:text-primary">Discovery</Link>
              <Link href="/compare" className="hover:text-primary">Compare</Link>
              <Link href="/wishlist" className="hover:text-primary">Wishlist</Link>
            </div>

            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-black/5 transition"
            >
              <Heart size={18} />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-black/5 transition"
            >
              <ShoppingCart size={18} />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-black/5"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/40 py-4 space-y-3">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or brands"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-white/60"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={16} className="text-gray-500" />
                </button>

                {isSuggestOpen && (
                  <div className="absolute top-full mt-3 w-full glass-panel rounded-2xl p-2 shadow-lg z-50">
                    {isSuggestLoading && (
                      <div className="px-4 py-3 text-xs text-muted">Searching...</div>
                    )}
                    {!isSuggestLoading && suggestions.length === 0 && (
                      <div className="px-4 py-3 text-xs text-muted">No results.</div>
                    )}
                    {!isSuggestLoading && suggestions.map((item) => (
                      <button
                        key={item.product_id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(item.product_id)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/80 transition flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium text-primary">{item.product_title}</div>
                          <div className="text-xs text-muted">{item.category}</div>
                        </div>
                        <div className="text-xs text-muted">
                          {item.currency || '₹'}{item.price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
            <Link href="/" className="block px-4 py-2 text-sm">Discovery</Link>
            <Link href="/compare" className="block px-4 py-2 text-sm">Compare</Link>
            <Link href="/wishlist" className="block px-4 py-2 text-sm">Wishlist</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
