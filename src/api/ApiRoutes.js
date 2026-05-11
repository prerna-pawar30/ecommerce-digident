const BASE_URL = "https://digident-backend1.onrender.com"; // Change this to your actual API base URL
const VERSION = "/api/v1";

export const API_ROUTES = {

 AUTH: {
    LOGIN: `${BASE_URL}${VERSION}/user/login`,
    REGISTER: `${BASE_URL}${VERSION}/user/register`,
    REFRESH_TOKEN: `${BASE_URL}${VERSION}/user/refresh-token`,
    FORGOT_PASSWORD: `${BASE_URL}${VERSION}/user/forget-password`,
    // Dynamic endpoints for tokens
    RESET_PASSWORD: (token) => `${BASE_URL}${VERSION}/user/reset-password/${token}`,
    VERIFY_EMAIL: (token) => `${BASE_URL}${VERSION}/user/verify-email/${token}`,
  },

  USER: {
    ME: `${BASE_URL}${VERSION}/user/me`,
    UPDATE_PROFILE: `${BASE_URL}${VERSION}/user/profile-update`,
    DASHBOARD_STATS: `${BASE_URL}${VERSION}/user/dashboard`,
  },

  BRANDS: {
    ALL: `${BASE_URL}${VERSION}/brand/all?limit=100`,
  },

  CATEGORIES: {
    GET: `${BASE_URL}${VERSION}/category/get`,
  },

  BANNERS: {
    STATUS: (isActive) => `${BASE_URL}${VERSION}/banner/status?isActive=${isActive}`,
    PRODUCTS: (id) => `${BASE_URL}${VERSION}/banner/products/${id}`,
  },

  PRODUCTS: {
    BEST_SELLING: `${BASE_URL}${VERSION}/product/best-selling`,
    ACTIVE: `${BASE_URL}${VERSION}/product/get/status/active`,
    GET_BY_ID: (id) => `${BASE_URL}${VERSION}/product/getById/${id}`,
  },

  RATINGS: {
    ADD: (id) => `${BASE_URL}${VERSION}/rating/add/${id}`,
    ALL: (id) => `${BASE_URL}${VERSION}/rating/all/${id}`,
  },

  ADDRESS: {
    ADD: `${BASE_URL}${VERSION}/user/address/add`,
    GET_ALL: `${BASE_URL}${VERSION}/user/address/get-all`,
    UPDATE: (id) => `${BASE_URL}${VERSION}/user/address/update/${id}`,
    DELETE: (id) => `${BASE_URL}${VERSION}/user/address/delete/${id}`,
    CLEAR: `${BASE_URL}${VERSION}/user/address/clear`,
  },

 // API_ROUTES definition
COUPONS: {
    GET: (id) => `${BASE_URL}${VERSION}/coupons/get/${id}`,
    // Change this to a function to accept the filter parameter
    FILTER: (status) => `${BASE_URL}${VERSION}/coupons/filter/${status}`, 
},

  ORDERS: {
    CREATE: `${BASE_URL}${VERSION}/order/create`,
    VERIFY_RAZORPAY: `${BASE_URL}${VERSION}/order/verifyRazorpay`,
    MY_ORDERS: `${BASE_URL}${VERSION}/order/my-orders`,
    GET_BY_ID: (id) => `${BASE_URL}${VERSION}/order/get/${id}`,
    CANCEL: (id) => `${BASE_URL}${VERSION}/order/cancel/${id}`,
    RETURN: `${BASE_URL}${VERSION}/order/return`,
    UPDATE_RETURN: (oId, rId) => `${BASE_URL}${VERSION}/order/return/update/${oId}/${rId}`,
    REFUND_COMPLETE: (id) => `${BASE_URL}${VERSION}/order/refund/complete/${id}`,
  },

    INVOICE: {
        CREATE: `${BASE_URL}${VERSION}/invoice/create`,
        GET: (id) => `${BASE_URL}${VERSION}/invoice/get/${id}`,
        UPDATE: (id) => `${BASE_URL}${VERSION}/invoice/update/${id}`,
        DELETE: (id) => `${BASE_URL}${VERSION}/invoice/delete/${id}`,
    },

  PRODUCTREVIEWS: {
    ADD: `${BASE_URL}${VERSION}/product-review/create`,
    GET_ALL: (id) => `${BASE_URL}${VERSION}/product-review/all/${id}`,
    UPDATE: (id) => `${BASE_URL}${VERSION}/product-review/update/${id}`,
    DELETE: (id) => `${BASE_URL}${VERSION}/product-review/delete/${id}`,
  },
};
