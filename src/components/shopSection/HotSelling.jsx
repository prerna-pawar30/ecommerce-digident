import { useNavigate } from "react-router-dom";
import ProductCard from "../ui/ProductCard";

export default function HotSelling({ products = [], loading }) {
  const navigate = useNavigate();

  // If less than 4 products OR still loading → hide section
  if (!loading && products.length < 4) {
    return null;
  }

  const displayedProducts = products.slice(0, 8);

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            Hot <span className="text-orange-500">Selling</span>
          </h2>
          <p
            onClick={() => navigate("/hot-selling")}
            className="cursor-pointer font-semibold hover:text-orange-500"
          >
            View All
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.productId || product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
