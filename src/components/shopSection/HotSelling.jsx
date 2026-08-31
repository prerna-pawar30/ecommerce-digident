import { useNavigate } from "react-router-dom";
import ProductCard from "../ui/ProductCard";

const BADGES = ["Bestseller", "Top Rated", "Hot Pick", "Trending"];

export default function HotSelling({ products, loading }) {
  const navigate = useNavigate();

  // Standardizing array parsing from parent injections
  const cleanProductsArray = Array.isArray(products)
    ? products
    : (products?.data && Array.isArray(products.data))
      ? products.data
      : [];

  // Hide the component entirely if loading is done but there isn't enough inventory to show
  if (!loading && cleanProductsArray.length === 0) {
    return null;
  }

  // Keep the homepage preview crisp (limit to top 8 items)
  const displayedProducts = cleanProductsArray.slice(0, 8);

  return (
    <section className="w-full pt-4 pb-6 bg-white">
      <div className="site-container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Hot <span className="text-orange-500">Selling</span>
          </h2>
          <button
            onClick={() => navigate("/hot-selling")}
            className="cursor-pointer font-semibold text-gray-700 hover:text-orange-500 transition-colors duration-200"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 animate-pulse">Loading amazing deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product, i) => (
              <ProductCard
                key={product.productId || product._id}
                product={product}
                badge={BADGES[i % BADGES.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}