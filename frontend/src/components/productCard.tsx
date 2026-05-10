'use client';

import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishlist, useCart } from '@/hooks/useCart';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';

interface Product {
  product_id: string;
  product_title: string;
  price: number;
  discount_percentage: number;
  rating: number;
  review_count: number;
  short_description: string;
  stock_quantity: number;
  category: string;
  currency?: string;
  image_url?: string | null;
  Img_URL?: string | null;
}

const ProductCard = ({ data }: { data: Product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Logic Calculations
  const inWishlist = isInWishlist(data.product_id);
  const discountedPrice = Math.round(data.price * (1 - (data.discount_percentage || 0) / 100));
  const savingsAmount = data.price - discountedPrice;
  const imageUrl = data.image_url || data.Img_URL || null;
  const heroTransitionName = `product-${data.product_id}`;

  return (
    <div className="glass-panel group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white border border-gray-50">
      {/* Media Section */}
      <div
        className="relative aspect-4/5 overflow-hidden bg-gray-50"
        style={{ viewTransitionName: heroTransitionName }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={data.product_title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.4em] text-gray-400">
            {data.category}
          </div>
        )}

        {/* Action Overlays */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start w-full">
            {(data.discount_percentage || 0) > 0 ? (
              <span className="pointer-events-auto rounded-full bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-tighter">
                -{data.discount_percentage}%
              </span>
            ) : <div />}

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(data.product_id);
              }}
              className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-sm hover:bg-white transition-colors group/heart"
            >
              <Heart
                size={16}
                className={`transition-all ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-900 group-hover/heart:scale-110'}`}
              />
            </button>
          </div>

          {data.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-black text-[11px] font-bold tracking-[0.2em] border-y border-black py-2 px-4">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <ViewTransitionLink
            href={`/product/${data.product_id}`}
            className="block text-lg font-medium leading-tight text-gray-900 hover:text-gray-600 transition-colors line-clamp-1"
          >
            {data.product_title}
          </ViewTransitionLink>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {data.short_description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(data.rating) ? 'fill-black text-black' : 'text-gray-200'}
              />
            ))}
          </div>
          <span className="font-medium">{data.rating} / 5.0</span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">
              {data.currency || '₹'}{discountedPrice.toLocaleString()}
            </span>
            {savingsAmount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {data.currency || '₹'}{data.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(data.product_id, 1)}
            disabled={data.stock_quantity === 0}
            className="flex items-center justify-center h-12 w-12 rounded-2xl bg-black text-white hover:bg-gray-800 transition-all active:scale-95 disabled:bg-gray-200 disabled:active:scale-100"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;