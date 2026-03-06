"use client";

import Button from "@/components/ui/Button";
import cn from "@/config/cn";
import { useParams, useRouter } from "next/navigation";


export default function product() {
  const product_id = useParams();
  console.log(product_id);
  const isAIBAR = true;
  const router = useRouter();
  return (

    <div className="p-2 h-screen   font-sans bg-bg-02 relative">
      <div className={
        cn("w-full h-full rounded-xl shadow bg-white p-2 grid grid-cols-[auto_auto] gap-2",

          isAIBAR ? "grid-cols-[auto_400px]" : "grid-cols-[auto_0px]"
        )
      }>
        <div className="h-full w-full p-2 pt-0">
          <header className="h-12 w-full flex items-center gap-2 py-2 border-b border-slate-200">
            <Button
              onClick={() => router.back()}
              className="border border-slate-200 scale-[0.9]"
              buttonicon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                </svg>

              }
            />
            <p className="text-lg font-bold">Product Details</p>
          </header>
        </div>
        <div className="h-full w-full bg-gray-100 rounded-md p-2"></div>
      </div>
    </div>
  );
}
