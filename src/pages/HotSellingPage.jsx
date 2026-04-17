import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ui/ProductCard";
import { fetchBestSellingProducts } from "../api/ApiService"; 

export default function HotSellingPage() {
  // Replace useState and useEffect with this:
  const { 
    data: products, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ["bestSellingProducts"], // Unique key for caching
    queryFn: fetchBestSellingProducts,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  if (isLoading) return <div className="p-10 text-center">Loading hot deals...</div>;
  
  if (isError) return (
    <div className="text-red-500 p-10">
      Error loading products: {error.message}
    </div>
  );

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Hot Selling Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}