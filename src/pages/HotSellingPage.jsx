import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ui/ProductCard";
import { fetchBestSellingProducts } from "../api/ApiService";
import { useNavigate } from "react-router-dom";

export default function HotSellingPage() {
  const navigate = useNavigate();

  const { 
    data: products, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ["bestSellingProducts"],
    queryFn: fetchBestSellingProducts,
    staleTime: 1000 * 60 * 5, // Keep cache fresh for 5 minutes
  });

  // Loading Skeleton State for a premium e-commerce look
  if (isLoading) {
    return (
      <div className="bg-gray-50/50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                <div className="bg-gray-200 aspect-square rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Clean Error State View
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load deals</h3>
          <p className="text-sm text-gray-500 mb-6">{error?.message || "We encountered a hiccup loading the inventory."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const productsList = Array.isArray(products) ? products : [];

  return (
    <section className="bg-gray-50/50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="border-b border-gray-200 pb-8 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Trending Now
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Hot <span className="text-orange-500">Selling</span> Products
            </h1>
            <p className="text-gray-500 mt-2 text-base max-w-xl">
              Don't miss out. Check out our high-demand items absolute favorites across our store.
            </p>
          </div>
          
          <div className="text-sm text-gray-500 font-medium whitespace-nowrap bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm self-start md:self-auto">
            Showing {productsList.length} items
          </div>
        </header>

        {/* Empty State View */}
        {productsList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 px-4 max-w-xl mx-auto mt-12">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Everything is sold out!</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Our popular items cleared shelves completely. Come back shortly while we replenish items.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl transition duration-200 shadow-sm shadow-orange-500/20"
            >
              Return to Shop
            </button>
          </div>
        ) : (
          /* Products Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {productsList.map((product) => (
              <div 
                key={product.productId || product._id}
                className="transform transition-transform duration-300 hover:-translate-y-1.5"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}