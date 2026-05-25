/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { ChevronLeft, ShoppingBag, Edit2 } from "lucide-react";

import { createOrder, verifyPayment, fetchActiveCoupons, createOrderInvoice } from "../api/ApiService";
import { resetCart, fetchCartItems } from "../store/slices/CartSlice";

import DynamicProgressStepper from "../components/ui/steps";
import ShippingAddress from "../components/checkout/ShippingAddress";
import BillingForm from "../components/checkout/BillingForm";
import CouponScroller from "../components/checkout/CouponScroller";
import OrderSummary from "../components/checkout/OrderSummary";

// ─────────────────────────────────────────────
// Pure helper — no state, easy to test/read
// Cart brand.id  = MongoDB _id  (e.g. "6a0d6a0...")
// Coupon brand._id = MongoDB _id (same format) ✅
// ─────────────────────────────────────────────
const isCouponEligible = (coupon, cart) => {
  const totalQty = cart.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal  = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  // ── FIXED / PERCENT ──────────────────────────
  if (coupon.couponType === "FIXED" || coupon.couponType === "PERCENT") {
    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) return false;
    return true;
  }

  // ── BUY_X_GET_Y_FREE ─────────────────────────
  if (coupon.couponType === "BUY_X_GET_Y_FREE") {
    const rule = coupon.buyXGetY;

    // Brand-specific: check buy-brand quantity
    if (rule.buyBrand) {
      const buyBrandMongoId = rule.buyBrand._id?.toString();
      const qtyFromBuyBrand = cart
        .filter((i) => i.brand?.id?.toString() === buyBrandMongoId)
        .reduce((acc, i) => acc + i.quantity, 0);

      if (qtyFromBuyBrand < rule.buyQuantity) return false;
    }

    // Brand-specific: check get-brand exists in cart
    if (rule.getBrand) {
      const getBrandMongoId = rule.getBrand._id?.toString();
      const hasGetBrand = cart.some(
        (i) => i.brand?.id?.toString() === getBrandMongoId
      );
      if (!hasGetBrand) return false;
    }

    // No brand → just check total cart quantity
    if (!rule.buyBrand && rule.buyQuantity > 0) {
      if (totalQty < rule.buyQuantity) return false;
    }

    return true;
  }

  return false;
};

// ─────────────────────────────────────────────
// Discount calculator — used in orderFinancials
// ─────────────────────────────────────────────
const calcDiscount = (coupon, cartItems) => {
  if (!coupon) return 0;

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const { couponType, discountValue, maxDiscountAmount, buyXGetY } = coupon;

  if (couponType === "PERCENT") {
    const disc = (subtotal * discountValue) / 100;
    return maxDiscountAmount ? Math.min(disc, maxDiscountAmount) : disc;
  }

  if (couponType === "FIXED") {
    return Math.min(discountValue, subtotal);
  }

  if (couponType === "BUY_X_GET_Y_FREE" && buyXGetY) {
    const rule = buyXGetY;

    // Brand-based free item discount
    if (rule.getBrand) {
      const getBrandMongoId = rule.getBrand._id?.toString();
      const getItems = cartItems.filter(
        (i) => i.brand?.id?.toString() === getBrandMongoId
      );
      const buyBrandMongoId = rule.buyBrand?._id?.toString();
      const buyItems = cartItems.filter(
        (i) => i.brand?.id?.toString() === buyBrandMongoId
      );
      const buyQty = buyItems.reduce((acc, i) => acc + i.quantity, 0);
      const sets   = Math.floor(buyQty / rule.buyQuantity);
      let discount = 0;
      getItems.forEach((item) => {
        const freeQty = Math.min(item.quantity, sets * rule.getQuantity);
        discount += item.price * freeQty * (rule.getDiscountPercent / 100);
      });
      return discount;
    }

    // No brand — cheapest item(s) are free
    if (!rule.buyBrand && rule.buyQuantity > 0) {
      const totalQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);
      const sets     = Math.floor(totalQty / rule.buyQuantity);
      const freeQty  = sets * rule.getQuantity;
      // Give discount on cheapest items
      const sorted   = [...cartItems].sort((a, b) => a.price - b.price);
      let remaining  = freeQty;
      let discount   = 0;
      for (const item of sorted) {
        if (remaining <= 0) break;
        const apply = Math.min(item.quantity, remaining);
        discount   += item.price * apply * (rule.getDiscountPercent / 100);
        remaining  -= apply;
      }
      return discount;
    }
  }

  return 0;
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const CheckoutPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();

  const isCreatingInvoice = useRef(false);

  const [loading,        setLoading]        = useState(false);
  const [sameAsDelivery, setSameAsDelivery] = useState(false);
  const [eligibleCoupons, setEligibleCoupons] = useState([]); // ✅ only cart-matched coupons
  const [selectedCoupon,  setSelectedCoupon]  = useState(null);

  const deliveryAddress = location.state?.selectedAddress || null;
  const reduxItems      = useSelector((state) => state.cart?.items);

  const cartItems = useMemo(
    () => location.state?.cartItems || reduxItems || [],
    [location.state?.cartItems, reduxItems]
  );

  const [billingAddress, setBillingAddress] = useState({
    organizationName: "", gstNumber: "", fullName: "", phone: "",
    street: "", area: "", city: "", state: "", country: "India", pincode: "",
  });

  // ── Load Razorpay SDK ────────────────────────
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script    = document.createElement("script");
      script.src      = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload   = () => resolve(true);
      script.onerror  = () => resolve(false);
      document.body.appendChild(script);
    });

  // ── INIT: fetch cart + coupons once, filter eligible ──
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const [freshCart, couponResponse] = await Promise.all([
          dispatch(fetchCartItems()).unwrap(),  // returns array directly
          fetchActiveCoupons(),
        ]);

        if (!isMounted) return;

        const cart       = freshCart || [];
        const allCoupons = couponResponse?.data?.coupons || [];

        // Only show coupons the current cart qualifies for
        const eligible = allCoupons.filter((c) => isCouponEligible(c, cart));
        setEligibleCoupons(eligible);
      } catch (err) {
        console.error("Checkout init error:", err);
      }
    };

    init();
    return () => { isMounted = false; };
  }, []);

  // ── Sync billing from delivery if toggled ───
  useEffect(() => {
    if (sameAsDelivery && deliveryAddress) {
      setBillingAddress((prev) => ({
        ...prev,
        fullName: `${deliveryAddress.firstName || ""} ${deliveryAddress.lastName || ""}`.trim(),
        phone:    deliveryAddress.phone    || "",
        street:   deliveryAddress.street   || "",
        area:     deliveryAddress.area     || "",
        city:     deliveryAddress.city     || "",
        state:    deliveryAddress.state    || "",
        pincode:  deliveryAddress.pincode  || "",
      }));
    }
  }, [sameAsDelivery, deliveryAddress]);

  // ── Order financials ─────────────────────────
  const orderFinancials = useMemo(() => {
    const subtotal      = cartItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0);
    const discountAmount = calcDiscount(selectedCoupon, cartItems);
    return { subtotal, discountAmount, total: subtotal - discountAmount };
  }, [cartItems, selectedCoupon]);

  // ── Apply coupon — simple toggle, no re-fetch needed ──
  const handleApplyCoupon = (coupon) => {
    // Toggle off
    if (selectedCoupon?.couponId === coupon.couponId) {
      setSelectedCoupon(null);
      Swal.fire({ title: "Coupon Removed", icon: "success", timer: 1200, showConfirmButton: false });
      return;
    }
    // Apply — eligibility already checked at load time
    setSelectedCoupon(coupon);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  // ── Place order ──────────────────────────────
  const handlePlaceOrder = useCallback(async ({ gstAmount, gstPercentage }) => {
    if (!deliveryAddress)
      return Swal.fire("Required", "Select shipping address", "warning");
    if (!billingAddress.fullName || !billingAddress.phone)
      return Swal.fire("Required", "Complete Billing Details", "warning");

    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setLoading(false);
      return Swal.fire("Error", "Razorpay SDK failed", "error");
    }

    try {
      const payload = {
        addressId:        deliveryAddress.addressId,
        organizationName: billingAddress.organizationName || null,
        gstNumber:        billingAddress.gstNumber        || null,
        billingAddress:   { ...billingAddress, country: "India" },
        gstAmount,
        gstPercentage,
        couponId:  selectedCoupon?.couponId || null,
        discount:  orderFinancials.discountAmount,
        items: cartItems.map((item) => ({
          productId: item.product?.id || item.productId,
          variantId: item.variant?.id || item.variantId,
          price:     item.price,
          quantity:  item.quantity,
        })),
      };

      const response = await createOrder(payload);
      if (!response.success) throw new Error("Order creation failed");

      const { razorpayOrderId, amount, currency, orderItem } = response.data;

      const options = {
        key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name:     "Digident",
        order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          if (isCreatingInvoice.current) return;

          try {
            const verifyRes = await verifyPayment({ ...paymentResponse, orderItem });

            if (verifyRes.success && !isCreatingInvoice.current) {
              isCreatingInvoice.current = true;
              const currentOrder = verifyRes.data.order;

              try {
                await createOrderInvoice({
                  orderId:             currentOrder.orderId,
                  paymentTerms:        "Payable due amount in 10 days",
                  termsOfDelivery:     `CIP ${currentOrder.shippingAddress?.state || "India"}`,
                  shippingCondition:   "Normal",
                  customerServiceRep:  "Vithalsir (MD)",
                  billTo: {
                    companyName:   orderItem.organizationName || billingAddress.fullName,
                    address:       `${billingAddress.street}, ${billingAddress.area}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.pincode}`,
                    gstin:         billingAddress.gstNumber || "",
                    contactPerson: billingAddress.fullName  || "",
                    contactNumber: billingAddress.phone     || "",
                  },
                  items: cartItems.map((item) => ({
                    description: item.name || item.product?.name,
                    qty:         item.quantity,
                    price:       item.price,
                    gstType:     "IGST",
                    gstPercent:  5,
                  })),
                  summary: {
                    freightCost: currentOrder.shippingCharge || 0,
                    paidAmount:  orderFinancials.total,
                  },
                  status:  "issued",
                  dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                });
              } catch (invErr) {
                console.error("Invoice failed:", invErr);
                isCreatingInvoice.current = false;
              }

              confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
              await Swal.fire({
                title: "Order Placed!",
                text:  "Your order is confirmed and invoice generated.",
                icon:  "success",
                confirmButtonColor: "#E68736",
              });

              dispatch(resetCart());
              navigate(`/order/${currentOrder.orderId}`);
            }
          } catch (err) {
            isCreatingInvoice.current = false;
            console.error("Verification Error:", err);
            Swal.fire("Payment Error", "Verification failed. Please contact support.", "error");
          }
        },
        theme: { color: "#E68736" },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to create order", "error");
    } finally {
      setLoading(false);
    }
  }, [deliveryAddress, billingAddress, cartItems, selectedCoupon, orderFinancials, dispatch, navigate]);

  // ── Render ───────────────────────────────────
  return (
    <div className="py-10 md:py-16 min-h-screen bg-gray-50/30 font-sans">
      <DynamicProgressStepper />

      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#E68736] transition-all"
        >
          <ChevronLeft size={16} /> Back to Cart
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: address forms */}
        <div className="lg:col-span-2 space-y-6">
          <ShippingAddress address={deliveryAddress} onNavigate={navigate} />
          <BillingForm
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
            sameAsDelivery={sameAsDelivery}
            setSameAsDelivery={setSameAsDelivery}
          />
        </div>

        {/* Right: cart summary + coupons + order summary */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Cart items */}
          <div className="bg-white p-6 rounded-3xl border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#E68736]" /> Your Items
              </h3>
              <button
                onClick={() => navigate("/cart")}
                className="text-[10px] font-black tracking-widest text-[#E68736] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 uppercase hover:bg-[#E68736] hover:text-white transition-all flex items-center gap-1"
              >
                <Edit2 size={12} /> Edit
              </button>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center py-2 border-b border-gray-50 last:border-0">
                  <img src={item.image} className="w-12 h-12 rounded-lg object-contain border" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name || item.product?.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Only eligible coupons shown — no invalid ones */}
          <CouponScroller
            coupons={eligibleCoupons}
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