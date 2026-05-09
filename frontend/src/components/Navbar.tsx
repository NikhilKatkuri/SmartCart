'use client';

import { useState, useEffect } from 'react';
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              SC
            </div>
            <span className="hidden sm:inline">SmartCart</span>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
                About
              </Link>
            </div>

            {/* Cart & Wishlist Icons */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <Heart size={20} />
              {wishlistItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart size={20} />
              {cartItems > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search size={18} className="text-gray-400" />
                </button>
              </div>
            </form>
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
              Home
            </Link>
            <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
              Products
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
