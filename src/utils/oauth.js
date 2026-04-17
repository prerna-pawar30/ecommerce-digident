const API_BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export const googleAuthUrl = `${API_BACKEND_URL}/api/v1/user/google`;
export const microsoftAuthUrl = `${API_BACKEND_URL}/api/v1/user/microsoft`;

export const loginWithGoogle = () => {
  window.location.href = googleAuthUrl;
};

export const loginWithMicrosoft = () => {
  window.location.href = microsoftAuthUrl;
};
