/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { ChevronLeft, ShoppingBag, Edit2 } from "lucide-react";

// API Services
import { createOrder, verifyPayment, fetchActiveCoupons } from "../api/ApiService";
import { resetCart } from "../store/slices/CartSlice";

// Component Imports
import DynamicProgressStepper from "../components/ui/steps";
import ShippingAddress from "../components/checkout/ShippingAddress";
import BillingForm from "../components/checkout/BillingForm";
import CouponScroller from "../components/checkout/CouponScroller";
import OrderSummary from "../components/checkout/OrderSummary";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [sameAsDelivery, setSameAsDelivery] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const deliveryAddress = location.state?.selectedAddress || null;
  const reduxItems = useSelector((state) => state.cart?.items);
  
  const cartItems = useMemo(() => {
    return location.state?.cartItems || reduxItems || [];
  }, [location.state?.cartItems, reduxItems]);

  const [billingAddress, setBillingAddress] = useState({
    organizationName: "", gstNumber: "", fullName: "", phone: "",
    street: "", area: "", city: "", state: "", country: "India", pincode: ""
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let isMounted = true;
    const getCoupons = async () => {
      const response = await fetchActiveCoupons();
      if (response.success && isMounted) {
        setAvailableCoupons(response.data?.coupons || []);
      }
    };
    getCoupons();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (sameAsDelivery && deliveryAddress) {
      setBillingAddress(prev => ({
        ...prev,
        fullName: `${deliveryAddress.firstName || ""} ${deliveryAddress.lastName || ""}`.trim(),
        phone: deliveryAddress.phone || "",
        street: deliveryAddress.street || "",
        area: deliveryAddress.area || "",
        city: deliveryAddress.city || "",
        state: deliveryAddress.state || "",
        pincode: deliveryAddress.pincode || "",
      }));
    }
  }, [sameAsDelivery, deliveryAddress]);

  // Combined Financial Logic (Handles Percent, Fixed, and BuyXGetY)
  const orderFinancials = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    let discountAmount = 0;

    if (selectedCoupon) {
      const { couponType, discountValue, maxDiscountAmount, buyXGetY } = selectedCoupon;

      if (couponType === "PERCENT") {
        discountAmount = (subtotal * discountValue) / 100;
        if (maxDiscountAmount) discountAmount = Math.min(discountAmount, maxDiscountAmount);
      } 
      else if (couponType === "FIXED") {
        discountAmount = Math.min(discountValue, subtotal);
      } 
      else if (couponType.includes("BUY_X_GET_Y") && buyXGetY) {
        const buyIds = buyXGetY.buyProducts.map((p) => p.productId);
        const getIds = buyXGetY.getProducts.map((p) => p.productId);

        const buyItem = cartItems.find((i) => buyIds.includes(i.product?.id || i.productId));
        const getItem = cartItems.find((i) => getIds.includes(i.product?.id || i.productId));

        if (buyItem && getItem) {
          const sets = Math.floor(buyItem.quantity / buyXGetY.buyQuantity);
          const freeQty = Math.min(getItem.quantity, sets * buyXGetY.getQuantity);
          discountAmount = getItem.price * freeQty * (buyXGetY.getDiscountPercent / 100);
        }
      }
    }
    return { subtotal, discountAmount, total: subtotal - discountAmount };
  }, [cartItems, selectedCoupon]);

  const handleApplyCoupon = (coupon) => {
    if (selectedCoupon?.couponId === coupon.couponId) {
      setSelectedCoupon(null);
      Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Coupon removed', showConfirmButton: false, timer: 1500 });
      return;
    }

    // Secondary validation for Buy X Get Y items presence
    if (coupon.couponType.includes("BUY_X_GET_Y")) {
      const rule = coupon.buyXGetY;
      const buyItem = cartItems.find(i => rule.buyProducts.some(p => p.productId === (i.product?.id || i.productId)));
      const getItem = cartItems.find(i => rule.getProducts.some(p => p.productId === (i.product?.id || i.productId)));

      if (!buyItem || buyItem.quantity < rule.buyQuantity) {
        return Swal.fire("Condition Not Met", `Add ${rule.buyQuantity}x ${rule.buyProducts[0]?.productName} first.`, "warning");
      }
      if (!getItem) {
        return Swal.fire("Free Item Missing", `Add ${rule.getProducts[0]?.productName} to cart to get the discount.`, "info");
      }
    }

    setSelectedCoupon(coupon);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#E68736", "#000000", "#ffffff"] });
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Applied: ${coupon.code}`, showConfirmButton: false, timer: 2000 });
  };

  const handlePlaceOrder = useCallback(async ({ gstAmount, gstPercentage }) => {
    if (!deliveryAddress) return Swal.fire("Required", "Select shipping address", "warning");
    if (!billingAddress.fullName || !billingAddress.phone) return Swal.fire("Required", "Complete Billing Details", "warning");

    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) { setLoading(false); return Swal.fire("Error", "Razorpay SDK failed", "error"); }

    try {
      const payload = {
        addressId: deliveryAddress.addressId,
        billingAddress: { ...billingAddress, country: "India" },
        gstAmount,
        gstPercentage,
        couponId: selectedCoupon?.couponId || null,
        discount: orderFinancials.discountAmount,
        items: cartItems.map((item) => ({
          productId: item.product?.id || item.productId,
          variantId: item.variant?.id || item.variantId,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(payload);
      if (response.success) {
        const { razorpayOrderId, amount, currency, orderItem } = response.data;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount, currency, name: "Digident", order_id: razorpayOrderId,
          handler: async (paymentResponse) => {
            const verifyRes = await verifyPayment({ ...paymentResponse, orderItem });
            if (verifyRes.success) {
              confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
              await Swal.fire("Success", "Order Placed Successfully", "success");
              dispatch(resetCart());
              navigate(`/order/${verifyRes.data.order.orderId}`);
            }
          },
          theme: { color: "#E68736" },
          modal: { ondismiss: () => setLoading(false) },
        };
        new window.Razorpay(options).open();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to create order", "error");
    } finally {
      setLoading(false);
    }
  }, [deliveryAddress, billingAddress, cartItems, selectedCoupon, orderFinancials.discountAmount, dispatch, navigate]);

  return (
    <div className="py-10 md:py-16 min-h-screen bg-gray-50/30 font-sans">
      <DynamicProgressStepper />
      
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#E68736] transition-all">
          <ChevronLeft size={16} /> Back to Cart
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ShippingAddress address={deliveryAddress} onNavigate={navigate} />
          <BillingForm 
            billingAddress={billingAddress} 
            setBillingAddress={setBillingAddress} 
            sameAsDelivery={sameAsDelivery} 
            setSameAsDelivery={setSameAsDelivery} 
          />
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#E68736]" /> Your Items
              </h3>
              <button onClick={() => navigate("/cart")} className="text-[10px] font-black tracking-widest text-[#E68736] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 uppercase hover:bg-[#E68736] hover:text-white transition-all">
                <Edit2 size={12} /> Edit
              </button>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center py-2 border-b border-gray-50 last:border-0">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-contain border" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name || item.product?.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{item.quantity} x ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <CouponScroller 
            coupons={availableCoupons} 
            selectedCoupon={selectedCoupon} 
            orderTotal={orderFinancials.subtotal} 
            onApply={handleApplyCoupon} 
          />

          <OrderSummary 
            financials={orderFinancials} 
            loading={loading} 
            onPlaceOrder={handlePlaceOrder} 
            onRemoveCoupon={() => setSelectedCoupon(null)}
          />
        </aside>
      </main>
    </div>
  );
};

export default CheckoutPage;