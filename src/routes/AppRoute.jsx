import React, { lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';


// --- Lazy Loads ---
const Shop = lazy(() => import("../pages/Shop.jsx"));
const HotSellingPage = lazy(() => import("../pages/HotSellingPage.jsx"));
const HotSelling = lazy(() => import("../components/shopSection/HotSelling.jsx"));
const AllProduct = lazy(() => import("../pages/AllProductPage.jsx"));
const ProductPage = lazy(() => import("../pages/ProductPage.jsx"));
const ReviewPage = lazy(() => import("../components/product-review/Review.jsx"));

// Auth
const Login = lazy(() => import("../components/auth/Login.jsx"));
const Register = lazy(() => import("../components/auth/Register.jsx"));
const VerifyEmail = lazy(() => import("../components/auth/VerifyEmail.jsx"));
const ForgetPassword = lazy(() => import("../components/auth/ForgetPassword.jsx"));
const ResetPassword = lazy(() => import("../components/auth/ResetPassword.jsx"));
const OauthSuccess = lazy(() => import("../components/auth/OauthSuccess.jsx"));

// User
const Cart = lazy(() => import("../pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage.jsx"));
const OrderDetailsPage = lazy(() => import("../pages/OrderPage.jsx"));
const OrderHistory = lazy(() => import("../pages/OrderHistoryPage.jsx"));
const UserProfile = lazy(() => import("../pages/UserProfilePage.jsx"));
const AddressBook = lazy(() => import("../components/modules/CheckoutAddressModule.jsx"));
const AddressProfile = lazy(() => import("../components/modules/AddressModule.jsx"));


// Policies
const Policies = lazy(() => import("../pages/PolicyPage.jsx"));
const PrivacyPolicy = lazy(() => import("../components/privacy/PrivacyPolicy.jsx"));
const ShippingPolicy = lazy(() => import("../components/privacy/ShippingPolicy.jsx"));
const ReturnPolicy = lazy(() => import("../components/privacy/ReturnPolicy.jsx"));
const TermsOfUse = lazy(() => import("../components/privacy/TermsOfUse.jsx"));

const NotFound = lazy(() => import("../pages/NotFound.jsx"));

// --- Route Guards ---
const ProtectedRoute = ({ children, token }) => {
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const PublicRoute = ({ children, token }) => {
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = ({ token }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Shop />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/hot-selling" element={<HotSellingPage />} />
      <Route path="/hotselling" element={<HotSelling />} />
      <Route path="/all-products" element={<AllProduct />} />
      <Route path="/productpage/:productId" element={<ProductPage />} />
      <Route path="/review/:productId" element={<ReviewPage />} />
      <Route path="/review" element={<ReviewPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute token={token}><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute token={token}><Register /></PublicRoute>} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/oauth-success" element={<PublicRoute token={token}><OauthSuccess /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/cart" element={<ProtectedRoute token={token}><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute token={token}><CheckoutPage /></ProtectedRoute>} />
      <Route path="/address" element={<ProtectedRoute token={token}><AddressBook /></ProtectedRoute>} />
       <Route path="/add-address" element={<ProtectedRoute token={token}><AddressProfile /></ProtectedRoute>} />
      <Route path="/order/:orderId" element={<ProtectedRoute token={token}><OrderDetailsPage /></ProtectedRoute>} />
      <Route path="/order-history" element={<ProtectedRoute token={token}><OrderHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute token={token}><UserProfile /></ProtectedRoute>} />

      {/* Policy Routes */}
      <Route path="/policies" element={<Policies />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/Shipping-Policy" element={<ShippingPolicy />} />
      <Route path="/Return-Policy" element={<ReturnPolicy />} />
      <Route path="/TermsOfUse" element={<TermsOfUse />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;