import { useSuperContext } from '@/providers/super'; 
import ProductCard from './productCard';

const ProductsView = () => {
  const { products } = useSuperContext(); 
  if (!products || products.length === 0) {
    return <div>Loading...</div>;
  }
  console.log(products);
  return (
    <div className='h-full flex-1 w-full overflow-y-scroll'>
      <div className="h-screen w-full p-2 gap-6 grid grid-cols-1 md:px-6 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {
          products.map((product) => (
            <ProductCard key={product.product_id}  data={product} />
          ))
        }
      </div>
    </div>
  )
}

export default ProductsView