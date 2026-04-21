import apiClient from "../utils/ApiClient";
import { API_ROUTES } from "./ApiRoutes";


const safeRequest = async (request) => {
  try {
    const res = await request;
    return res.data; // ✅ clean response
  } catch (err) {
    console.error("API Service Error:", err);
    throw err; // 🔥 VERY IMPORTANT
  }
};

export const AuthService = {
  login: (creds) => safeRequest(apiClient.post(API_ROUTES.AUTH.LOGIN, creds)),
  register: (data) => safeRequest(apiClient.post(API_ROUTES.AUTH.REGISTER, data)),
  refreshToken: () => safeRequest(apiClient.post(API_ROUTES.AUTH.REFRESH_TOKEN)),
  forgotPassword: (email) => safeRequest(apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email })),
  resetPassword: (token, passwords) => safeRequest(apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD(token), passwords)),
  verifyEmail: (token) => safeRequest(apiClient.get(API_ROUTES.AUTH.VERIFY_EMAIL(token))),
};

// DASHBOARD SERVICES
export const fetchAllBrands = () => safeRequest(apiClient.get(API_ROUTES.BRANDS.ALL));
export const fetchCategories = () => safeRequest(apiClient.get(API_ROUTES.CATEGORIES.GET));
export const fetchBannersByStatus = (isActive) => safeRequest(apiClient.get(API_ROUTES.BANNERS.STATUS(isActive)));
export const fetchBannerProducts = (id) => safeRequest(apiClient.get(API_ROUTES.BANNERS.PRODUCTS(id)));

// PRODUCT SERVICES
export const fetchBestSellingProducts = async () => {
  const { data } = await apiClient.get(API_ROUTES.PRODUCTS.BEST_SELLING);
  return data;
};
// Replace the old fetchActiveProducts with this dynamic version
export const fetchActiveProducts = (params = {}) => {
  const query = new URLSearchParams();
  
  // Append parameters only if they exist
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.brand) query.append("brand", params.brand);
  if (params.category) query.append("category", params.category);

  const url = `${API_ROUTES.PRODUCTS.ACTIVE}?${query.toString()}`;
  return safeRequest(apiClient.get(url));
};
export const fetchProductById = (id) => safeRequest(apiClient.get(API_ROUTES.PRODUCTS.GET_BY_ID(id)));

// RATING SERVICES
export const addRating = (id, data) => safeRequest(apiClient.post(API_ROUTES.RATINGS.ADD(id), data));
export const fetchRatings = (id) => safeRequest(apiClient.get(API_ROUTES.RATINGS.ALL(id)));

// --- COUPON SERVICES ---
// Service function
export const fetchActiveCoupons = () => 
  safeRequest(apiClient.get(API_ROUTES.COUPONS.FILTER('true')));
// ADDRESS SERVICES

export const addAddress = (data) => safeRequest(apiClient.post(API_ROUTES.ADDRESS.ADD, data));

export const fetchAllAddresses = () => safeRequest(apiClient.get(API_ROUTES.ADDRESS.GET_ALL));

export const updateAddress = (id, data) => safeRequest(apiClient.put(API_ROUTES.ADDRESS.UPDATE(id), data));

// 🔥 ADD THIS EXPORT:
export const deleteAddress = (id) => safeRequest(apiClient.delete(API_ROUTES.ADDRESS.DELETE(id)));

export const clearAddresses = () => safeRequest(apiClient.delete(API_ROUTES.ADDRESS.CLEAR));

// ORDER SERVICES
export const createOrder = (data) => safeRequest(apiClient.post(API_ROUTES.ORDERS.CREATE, data));
export const verifyPayment = (data) => safeRequest(apiClient.post(API_ROUTES.ORDERS.VERIFY_RAZORPAY, data));
// Change this in your ApiService.js
export const fetchMyOrders = (month, year, page = 1) => {
  const query = new URLSearchParams();
  if (month) query.append("month", month);
  if (year) query.append("year", year);
    query.append("page", page);

  const url = `${API_ROUTES.ORDERS.MY_ORDERS}?${query.toString()}`;
  return safeRequest(apiClient.get(url));
};
export const fetchOrderDetails = (id) => safeRequest(apiClient.get(API_ROUTES.ORDERS.GET_BY_ID(id)));
// In ApiService.js
export const cancelOrder = (id) => safeRequest(apiClient.put(API_ROUTES.ORDERS.CANCEL(id), { reason: "User cancelled" }));
export const returnOrderItems = (data) => safeRequest(apiClient.post(API_ROUTES.ORDERS.RETURN, data));
export const updateReturnOrder = (oId, rId, data) => safeRequest(apiClient.patch(API_ROUTES.ORDERS.UPDATE_RETURN(oId, rId), data));
export const completeRefund = (id) => safeRequest(apiClient.post(API_ROUTES.ORDERS.REFUND_COMPLETE(id)));// USER SERVICES
export const fetchUserDashboard = () => 
  safeRequest(apiClient.get(API_ROUTES.USER.DASHBOARD_STATS));

export const updateUserProfile = (formData) => 
  safeRequest(apiClient.put(API_ROUTES.USER.UPDATE_PROFILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));

  // --- PRODUCT REVIEW SERVICES ---

/**
 * Creates a new product review
 * @param {Object} data - The review details (productType, reviewerInfo, ratings, overallSatisfaction, comments)
 */
export const createProductReview = (data) => 
  safeRequest(apiClient.post(API_ROUTES.PRODUCTREVIEWS.ADD, data));

/**
 * Fetches all reviews for a specific product
 * @param {string} id - The product or review category ID
 */
export const fetchProductReviews = (id) => 
  safeRequest(apiClient.get(API_ROUTES.PRODUCTREVIEWS.GET_ALL(id)));

/**
 * Updates an existing review
 * @param {string} id - The unique review ID (reviewId)
 * @param {Object} data - The updated review fields
 */
export const updateProductReview = (id, data) => 
  safeRequest(apiClient.put(API_ROUTES.PRODUCTREVIEWS.UPDATE(id), data));

/**
 * Deletes a review
 * @param {string} id - The unique review ID
 */
export const deleteProductReview = (id) => 
  safeRequest(apiClient.delete(API_ROUTES.PRODUCTREVIEWS.DELETE(id)));