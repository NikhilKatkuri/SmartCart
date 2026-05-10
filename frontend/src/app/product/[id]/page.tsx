'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Sparkles, AlertCircle, X, SlidersHorizontal } from 'lucide-react';
import { productAPI } from '@/lib/api';
import { useCart, useWishlist } from '@/hooks/useCart';
import { AIChatSidebar } from '@/components/AIChatSidebar';
import { productCache } from '@/lib/storage';
import { SkeletonCard } from '@/components/SkeletonCard';

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
  Img_URL?: string | null;
  image_url?: string | null;
  knowledgeBase?: {
    short_description: string;
    long_description: string;
    rating: number;
    review_count: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareCandidates, setCompareCandidates] = useState<ProductDetail[]>([]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [compareLimit, setCompareLimit] = useState(2);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productAPI.getProductById(productId);
      const resolved = response.product || response.data;
      setProduct(resolved);
      productCache.set(productId, resolved);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [productId]);

  useEffect(() => {
    const cached = productCache.get<ProductDetail>(productId);
    if (cached) {
      setProduct(cached.data);
      setIsLoading(false);
      setIsRefreshing(true);
    }
    loadProduct();
  }, [loadProduct, productId]);

  useEffect(() => {
    if (!isCompareOpen || !product?.category) return;

    const loadSimilar = async () => {
      setIsCompareLoading(true);
      try {
        const response = await productAPI.getAllProducts({
          page: 1,
          limit: 8,
          category: product.category,
        });
        const items = (response.data || []) as ProductDetail[];
        const filtered = items.filter((item) => item.product_id !== product.product_id);
        setCompareCandidates(filtered);
        setSelectedCompareIds([product.product_id]);
      } catch (error) {
        console.error('Error loading compare candidates:', error);
      } finally {
        setIsCompareLoading(false);
      }
    };

    loadSimilar();
  }, [isCompareOpen, product?.category, product?.product_id]);

  useEffect(() => {
    setSelectedCompareIds((prev) => prev.slice(0, compareLimit));
  }, [compareLimit]);

  if (isLoading && !product) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <SkeletonCard />
          <div className="space-y-6">
            <div className="h-6 w-2/3 skeleton rounded-full" />
            <div className="h-4 w-full skeleton rounded-full" />
            <div className="h-4 w-5/6 skeleton rounded-full" />
            <div className="h-10 w-1/3 skeleton rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link href="/" className="text-black hover:underline mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = Math.round(
    product.price * (1 - (product.discount_percentage || 0) / 100)
  );
  const imageUrl = product.image_url || product.Img_URL || null;

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between text-sm text-muted mb-6">
        <Link href="/" className="hover:text-primary">Discovery</Link>
        {isRefreshing && <span className="text-xs">Syncing latest info...</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div
            className="relative aspect-4/5 bg-white/60"
            style={{ viewTransitionName: `product-${product.product_id}` }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.product_title}
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs tracking-[0.4em] text-muted">
                {product.category}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{product.brand} · {product.category}</p>
            <h1 className="text-3xl md:text-4xl font-semibold">{product.product_title}</h1>
            <p className="text-muted">{product.short_description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'fill-black text-black' : 'text-gray-300'}
                />
              ))}
            </div>
            <span>{product.rating} · {product.review_count} reviews</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold">
              {product.currency || '₹'}{discountedPrice.toLocaleString()}
            </span>
            {product.discount_percentage > 0 && (
              <span className="text-sm text-muted line-through">
                {product.currency || '₹'}{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-muted">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                className="h-9 w-9 rounded-full border border-white/60 bg-white/80"
              >
                -
              </button>
              <span className="w-6 text-center">{selectedQuantity}</span>
              <button
                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                className="h-9 w-9 rounded-full border border-white/60 bg-white/80"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addToCart(product.product_id, selectedQuantity)}
              className="px-6 py-3 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/90"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingCart size={16} /> Add to cart
              </span>
            </button>
            <button
              onClick={() => toggleWishlist(product.product_id)}
              className="px-6 py-3 rounded-full border border-white/60 bg-white/80 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <Heart size={16} className={inWishlist ? 'fill-red-500 text-red-500' : ''} />
                {inWishlist ? 'Saved' : 'Save'}
              </span>
            </button>
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="px-6 py-3 rounded-full border border-black/10 bg-black/5 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} /> Ask AI
              </span>
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-6 py-3 rounded-full border border-black/10 bg-white/80 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={16} /> Compare
              </span>
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted">Details</h2>
            <p className="text-sm leading-relaxed text-muted">{product.long_description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(product.specifications || {}).slice(0, 6).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted">Reviews</h2>
            <div className="space-y-3">
              {(product.reviews || []).slice(0, 3).map((review, idx) => (
                <div key={`${review.comment}-${idx}`} className="border-b border-white/40 pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Star size={12} className="fill-black text-black" /> {review.rating}
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AIChatSidebar
        productId={product.product_id}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {isCompareOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCompareOpen(false)} />
          <div className="absolute left-1/2 top-10 w-[min(92vw,720px)] -translate-x-1/2 glass-panel rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Compare</p>
                <h3 className="text-lg font-semibold">Select similar products</h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="h-9 w-9 rounded-full bg-white/70 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted">
              <span>Compare up to</span>
              <select
                value={compareLimit}
                onChange={(e) => setCompareLimit(Number(e.target.value))}
                className="px-3 py-2 rounded-full border border-white/60 bg-white/80"
              >
                <option value={2}>2 products</option>
                <option value={3}>3 products</option>
              </select>
              <span className="text-xs">(Current product is included)</span>
            </div>

            {isCompareLoading ? (
              <div className="text-sm text-muted">Loading similar products...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compareCandidates.map((item) => {
                  const isSelected = selectedCompareIds.includes(item.product_id);
                  const isDisabled =
                    !isSelected && selectedCompareIds.length >= compareLimit;
                  return (
                    <label
                      key={item.product_id}
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                        isSelected ? 'border-black bg-white/80' : 'border-white/60 bg-white/60'
                      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => {
                          setSelectedCompareIds((prev) => {
                            if (prev.includes(item.product_id)) {
                              return prev.filter((id) => id !== item.product_id);
                            }
                            return [...prev, item.product_id];
                          });
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">{item.product_title}</div>
                        <div className="text-xs text-muted">{item.brand}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted">
                Selected {selectedCompareIds.length} of {compareLimit}
              </div>
              <button
                onClick={() => {
                  const ids = selectedCompareIds.length
                    ? selectedCompareIds
                    : [product.product_id];
                  router.push(`/compare?products=${ids.join(',')}`);
                }}
                disabled={selectedCompareIds.length < 2}
                className="px-6 py-2 rounded-full bg-black text-white text-sm disabled:bg-gray-300"
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
