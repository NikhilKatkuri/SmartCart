'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { productAPI } from '@/lib/api';
import { AlertCircle, Loader, X, Plus } from 'lucide-react';
import Link from 'next/link';

interface Product {
  product_id: string;
  product_title: string;
  brand: string;
  price: number;
  discount_percentage: number;
  currency: string;
  rating: number;
  review_count: number;
  stock_quantity: number;
  specifications: Record<string, string>;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  
  useEffect(() => {
    const initialProductIds = searchParams.get('products')?.split(',') || [];
    if (initialProductIds.length > 0) {
      loadProducts(initialProductIds);
    }
  }, [searchParams]);
  const loadProducts = async (productIds: string[]) => {
    setIsLoading(true);
    try {
      const loadedProducts = await Promise.all(
        productIds.map((id) =>
          productAPI.getProductById(id).then((res) => res.product || res.data)
        )
      );
      setProducts(loadedProducts.filter(Boolean).slice(0, 3)); // Max 3 products
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async () => {
    if (!searchInput.trim()) return;

    try {
      const results = await productAPI.searchProducts(searchInput, 5);
      if (results.data && results.data.length > 0) {
        const productId = results.data[0].product_id;
        if (!products.find((p) => p.product_id === productId)) {
          if (products.length < 3) {
            loadProducts([...products.map((p) => p.product_id), productId]);
            setSearchInput('');
          }
        }
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const removeProduct = (productId: string) => {
    setProducts(products.filter((p) => p.product_id !== productId));
  };

  const allSpecifications = new Set<string>();
  products.forEach((product) => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach((key) => {
        allSpecifications.add(key);
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Compare Products</h1>
          <p className="text-gray-600">Compare up to 3 products side by side</p>
        </div>

        {/* Search & Add Product */}
        {products.length < 3 && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search product to compare..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addProduct}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>
        )}

        {isLoading && products.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {products.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No products to compare</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Browse Products
            </Link>
          </div>
        )}

        {products.length === 1 && !isLoading && (
          <div className="text-center py-20 bg-blue-50 rounded-lg border-2 border-blue-200 mb-8">
            <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-semibold mb-2">
              Add at least one more product to compare
            </p>
            <p className="text-gray-600 mb-6">
              You&apos;ve selected {products.length} product. Search for another product above to add it to the comparison.
            </p>
            <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-3">Currently comparing:</p>
                <div className="text-left">
                  {products.map((product) => (
                    <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{product.product_title}</p>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <button
                        onClick={() => removeProduct(product.product_id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                {/* Product Info Row */}
                <tr>
                  <td className="p-6 border-b border-gray-200 font-semibold text-gray-900 w-48 bg-gray-50">
                    Product
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.product_id}
                      className="p-6 border-b border-gray-200 border-l text-center"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-left">
                          <p className="font-bold text-gray-900">{product.product_title}</p>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                        </div>
                        <button
                          onClick={() => removeProduct(product.product_id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price Row */}
                <tr>
                  <td className="p-6 border-b border-gray-200 font-semibold text-gray-900 bg-gray-50">
                    Price
                  </td>
                  {products.map((product) => {
                    const discounted = Math.round(
                      product.price * (1 - product.discount_percentage / 100)
                    );
                    return (
                      <td
                        key={product.product_id}
                        className="p-6 border-b border-gray-200 border-l text-center"
                      >
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {product.currency}{discounted.toLocaleString()}
                          </p>
                          {product.discount_percentage > 0 && (
                            <p className="text-sm text-red-600 line-through">
                              {product.currency}{product.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-6 border-b border-gray-200 font-semibold text-gray-900 bg-gray-50">
                    Rating
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.product_id}
                      className="p-6 border-b border-l border-gray-200 text-center"
                    >
                      <p className="text-lg font-bold text-gray-900">{product.rating}★</p>
                      <p className="text-sm text-gray-600">({product.review_count} reviews)</p>
                    </td>
                  ))}
                </tr>

                {/* Stock Row */}
                <tr>
                  <td className="p-6 border-b border-gray-200 font-semibold text-gray-900 bg-gray-50">
                    Stock
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.product_id}
                      className="p-6 border-b border-gray-200 border-l  text-center"
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock_quantity > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock_quantity > 0
                          ? `${product.stock_quantity} Available`
                          : 'Out of Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Specifications Rows */}
                {Array.from(allSpecifications).map((spec) => (
                  <tr key={spec}>
                    <td className="p-6 border-b border-gray-200 font-semibold text-gray-900 bg-gray-50 capitalize">
                      {spec.replace(/_/g, ' ')}
                    </td>
                    {products.map((product) => (
                      <td
                        key={product.product_id}
                        className="p-6 border-b border-gray-200 border-l text-center"
                      >
                        <p className="text-gray-700">
                          {product.specifications?.[spec] || '-'}
                        </p>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
