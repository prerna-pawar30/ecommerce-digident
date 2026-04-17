import { useNavigate } from "react-router-dom";
import emptyCartBg from "../../assets/cart.webp";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center max-w-4xl w-full">
        <div
          className="w-full h-[300px] sm:h-[480px] bg-no-repeat bg-center bg-contain"
          style={{ backgroundImage: `url(${emptyCartBg})` }}
        ></div>

        <p className="mb-4 text-lg sm:text-xl font-medium text-gray-400">
          Your cart is currently empty
        </p>

        <button
          onClick={() => navigate("/all-products")}
          className="bg-[#E68736] text-white px-8 sm:px-12 py-3 sm:py-4 font-bold rounded cursor-pointer uppercase text-sm shadow-md hover:bg-[#cf7529] transition-all"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}