'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  Star,
  Loader,
  Zap,
  Check,
  AlertCircle,
} from 'lucide-react';
import { productAPI } from '@/lib/api';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useCart';
import { AIChatSidebar } from '@/components/AIChatSidebar';
import Link from 'next/link';

interface ProductDetail {
  _id: string;
  product_id: string;
  product_title: string;
  brand: string;
  category: string;
  sub_category: string;
  price: number;
  discount_percentage: number;
  currency: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  short_description: string;
  long_description: string;
  tags: string[];
  specifications: Record<string, string>;
  reviews: Array<{ rating: number; comment: string }>;
  variants: Array<{ variant_name: string; variant_value: string }>;
  knowledgeBase?: {
    short_description: string;
    long_description: string;
    rating: number;
    review_count: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productAPI.getProductById(productId);
      setProduct(response.product || response.data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productId])

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = Math.round(
    product.price * (1 - product.discount_percentage / 100)
  );
  const savingsAmount = product.price - discountedPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.product_title}</span>
        </div>

        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image Placeholder */}
          <div>
            <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-gray-400 px-4">
                <div className="text-6xl font-bold opacity-10">{product.category}</div>
                <div className="text-sm opacity-20 mt-4">{product.product_title}</div>
              </div>

              {/* Discount Badge */}
              {product.discount_percentage > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-lg">
                  -{product.discount_percentage}%
                </div>
              )}
            </div>

            {/* Product Images Thumbnails */}
            <div className="flex gap-4 mt-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg border-2 border-transparent hover:border-blue-500 cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-blue-600 font-semibold mb-2">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.product_title}
              </h1>
              <p className="text-gray-600">{product.short_description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {product.rating} out of 5
                </p>
                <p className="text-gray-600">({product.review_count} reviews)</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {product.currency}{discountedPrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {product.currency}{product.price.toLocaleString()}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                  Save {product.currency}{savingsAmount.toLocaleString()}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock_quantity > 0 ? (
                  <>
                    <Check size={20} className="text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} className="text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity
                </label>
                <select
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(productId, selectedQuantity)}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(productId)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                  {inWishlist ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Compare Button */}
              <Link
                href={`/compare?products=${productId}`}
                className="w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Compare (Add 2+ products)
              </Link>
            </div>

            {/* AI Chat Button */}
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              💬 Ask AI About This Product
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.long_description}</p>

              {/* Tags */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-semibold text-gray-900 mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-4">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-4 last:border-0">
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{value}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet</p>
          )}
        </div>
      </div>

      {/* AI Chat Sidebar */}
      <AIChatSidebar
        productId={productId}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
