import React from "react";

const QuantitySelector = ({ quantity, setQuantity, maxStock }) => {
  return (
    <div className="flex items-center bg-[#fdf2e9] rounded-lg px-2 h-14 md:h-11 w-full md:w-auto justify-between md:justify-start">
      <button
        type="button"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="px-5 font-bold text-[24px] md:text-xl active:scale-95 transition-transform"
      >
        −
      </button>
      <span className="px-6 font-bold text-[20px] md:text-base min-w-[3rem] text-center">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => setQuantity(quantity + 1)}
        disabled={quantity >= maxStock}
        className={`px-5 font-bold text-[24px] md:text-xl active:scale-95 transition-transform ${
          quantity >= maxStock ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;