'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useCart';

export function Navbar() {
  const router = useRouter();
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
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
                className="w-full px-4 py-2.5 rounded-2xl bg-white/70 border border-white/60 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <Search size={18} />
              </button>
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
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-white/60"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={16} className="text-gray-500" />
                </button>
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
