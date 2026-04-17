const VERSION = "/api/v1";

export const API_ROUTES = {

 AUTH: {
    LOGIN: `${VERSION}/user/login`,
    REGISTER: `${VERSION}/user/register`,
    REFRESH_TOKEN: `${VERSION}/user/refresh-token`,
    FORGOT_PASSWORD: `${VERSION}/user/forget-password`,
    // Dynamic endpoints for tokens
    RESET_PASSWORD: (token) => `${VERSION}/user/reset-password/${token}`,
    VERIFY_EMAIL: (token) => `${VERSION}/user/verify-email/${token}`,
  },

  USER: {
    ME: `${VERSION}/user/me`,
    UPDATE_PROFILE: `${VERSION}/user/profile-update`,
    DASHBOARD_STATS: `${VERSION}/user/dashboard`,
  },

  BRANDS: {
    ALL: `${VERSION}/brand/all`,
  },

  CATEGORIES: {
    GET: `${VERSION}/category/get`,
  },

  BANNERS: {
    STATUS: (isActive) => `${VERSION}/banner/status?isActive=${isActive}`,
    PRODUCTS: (id) => `${VERSION}/banner/products/${id}`,
  },

  PRODUCTS: {
    BEST_SELLING: `${VERSION}/product/best-selling`,
    ACTIVE: `${VERSION}/product/get/status/active`,
    GET_BY_ID: (id) => `${VERSION}/product/getById/${id}`,
  },

  RATINGS: {
    ADD: (id) => `${VERSION}/rating/add/${id}`,
    ALL: (id) => `${VERSION}/rating/all/${id}`,
  },

  ADDRESS: {
    ADD: `${VERSION}/user/address/add`,
    GET_ALL: `${VERSION}/user/address/get-all`,
    UPDATE: (id) => `${VERSION}/user/address/update/${id}`,
    DELETE: (id) => `${VERSION}/user/address/delete/${id}`,
    CLEAR: `${VERSION}/user/address/clear`,
  },

 // API_ROUTES definition
COUPONS: {
    GET: (id) => `${VERSION}/coupons/get/${id}`,
    // Change this to a function to accept the filter parameter
    FILTER: (status) => `${VERSION}/coupons/filter/${status}`, 
},

  ORDERS: {
    CREATE: `${VERSION}/order/create`,
    VERIFY_RAZORPAY: `${VERSION}/order/verifyRazorpay`,
    MY_ORDERS: `${VERSION}/order/my-orders`,
    GET_BY_ID: (id) => `${VERSION}/order/get/${id}`,
    CANCEL: (id) => `${VERSION}/order/cancel/${id}`,
    RETURN: `${VERSION}/order/return`,
    UPDATE_RETURN: (oId, rId) => `${VERSION}/order/return/update/${oId}/${rId}`,
    REFUND_COMPLETE: (id) => `${VERSION}/order/refund/complete/${id}`,
  },
};
