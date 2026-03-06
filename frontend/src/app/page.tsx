"use client";
import Header from "@/components/Header";
import ProductsView from "@/components/productsView";
 
export default function Home() {

  return ( 

    <div className=" h-screen grid grid-cols-1 grid-rows-[64px_auto] font-sans bg-bg-02 relative">
      <Header />
      <ProductsView/>
    </div> 
  );
}
