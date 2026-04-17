/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchCartItems,
  removeItemFromCart,
  updateItemQuantity,
} from "../store/slices/CartSlice";

import { confirmAction } from "../utils/alerts";
import DynamicProgressStepper from "../components/ui/steps";
import RelatedProduct from "../components/shopSection/RelatedProduct";
import HotSelling from "../components/shopSection/HotSelling";

import CartItem from "../components/cart/CartItem";
import EmptyCart from "../components/cart/EmptyCart";
import OrderSummary from "../components/cart/OrderSummary";

// --- Skeleton Component for smooth loading ---
const CartSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border border-gray-100 rounded-2xl p-4 items-center animate-pulse">
    <div className="w-full sm:w-28 h-40 sm:h-28 bg-gray-200 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-3 w-full">
      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto sm:mx-0" />
      <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto sm:mx-0" />
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto sm:mx-0" />
    </div>
    <div className="hidden sm:flex flex-col items-end gap-3">
      <div className="h-8 w-8 bg-gray-100 rounded-full" />
      <div className="h-10 w-24 bg-gray-100 rounded-lg" />
    </div>
  </div>
);

export default function CartPage() {
  const dispatch = useDispatch();
  const { items = [], status } = useSelector((state) => state.cart);

  // 1. Initial Fetch
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // 2. Memoized Data
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const hasItems = safeItems.length > 0;

  const totalQuantity = useMemo(() => {
    return safeItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [safeItems]);

  const subtotal = useMemo(() => {
    return safeItems.reduce(
      (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
      0
    );
  }, [safeItems]);

  // 3. Handlers
  const handleRemove = async (variantId) => {
    const result = await confirmAction("Remove Item?", "Are you sure?");
    if (result.isConfirmed) {
      try {
        await dispatch(removeItemFromCart(variantId)).unwrap();
      } catch (err) {
        Swal.fire("Error", "Could not remove item", "error");
      }
    }
  };

  const handleUpdateQty = (variantId, newQty) => {
    return dispatch(
      updateItemQuantity({ variantId, quantity: newQty })
    ).unwrap();
  };

  // --- RENDERING LOGIC ---

  // A. Loading / Idle state: Show Skeleton
  if (status === "loading" || status === "idle") {
    return (
      <div className="py-6 sm:py-10 max-w-7xl mx-auto min-h-screen bg-white px-4">
        <div className="py-3 sm:py-5 opacity-50">
          <DynamicProgressStepper />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4">
          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => <CartSkeleton key={i} />)}
          </div>
          <div className="w-full lg:w-[340px] xl:w-[380px] h-[450px] bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
        </div>
      </div>
    );
  }

  // B. Finished loading and NO items found: Show EmptyCart
  // This is the fix! It only shows empty if status is "succeeded"
  if (status === "succeeded" && !hasItems) {
    return <EmptyCart />;
  }

  // C. Show actual Cart Content
  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto min-h-screen bg-white px-4">
      <div className="py-3 sm:py-5">
        <DynamicProgressStepper />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4 order-1 w-full">
          {safeItems.map((item) => {
            const variantId = item.variant?.id || item.variantId;
            return (
              <CartItem
                key={variantId}
                item={item}
                onRemove={handleRemove}
                onUpdate={handleUpdateQty}
              />
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[340px] xl:w-[380px] lg:flex-shrink-0 order-2">
          <OrderSummary
            items={safeItems}
            subtotal={subtotal}
            totalQuantity={totalQuantity}
          />
        </div>
      </div>

      {/* Footer sections (Related/Hot Selling) */}
      <div className="mt-12">
        <RelatedProduct />
      </div>

      <div className="mt-8">
        <HotSelling />
      </div>
    </div>
  );
}