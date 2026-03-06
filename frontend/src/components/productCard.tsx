import { product } from "@/types";
import Link from "next/link";

const ProductCard = ({ data }: { data: product }) => {
  return (
    <Link href={`/product/${data.product_id}`} className="w-full h-auto rounded-md border border-slate-200 hover:bg-slate-100/50 cursor-pointer p-3">
      <div className="w-full aspect-video rounded">
        {
          (data.image_url === null) && <div className="w-full aspect-video rounded bg-slate-200 animate-pulse" />
        }

      </div>
      <div className="w-full h-auto mt-2">
        <h3 className="text-sm font-medium text-slate-900">{data.product_title}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
          {data.short_description}
        </p>
        <div className="flex items-end justify-between mt-2">
          <div className="text-sm font-semibold text-slate-900 relative ">
            <span className="top-0 text-[8px] absolute">{data.currency}</span>
            <span className="ml-5">
              {data.price}/-</span>
          </div>
          <div className="text-xs text-slate-500 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <span> {data.rating} </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>

            </div>
            <p className="text-xs text-slate-500">
              {data.review_count + "+ Reviews"}
            </p>
          </div>
        </div>
      </div>

    </Link>
  )
}

export default ProductCard