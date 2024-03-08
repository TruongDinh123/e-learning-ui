import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  // baseURL: process.env.API_URL || process.env.API_URL_PRODUCTION,
  // baseURL: "https://e-learning-95lab-productionv1.onrender.com/v1/api",
  baseURL: "https://www.247learn.vn/v1/api",
  headers: {
    "Content-Type": "application/json",
    "x-api-key":
      "8ccaf2db9e10264dc29abdcc653f1c59673144131bd08c870751ce80490d926c407ad256fcf7c409df42c6af17f779b94c2695b769f3d1eb76f726e97a12773b",
  },
  withCredentials: true,
});

// Hàm xử lý đăng xuất
function handleLogout() {
  localStorage.clear();
  Cookies.remove("Bearer");
  window.location.href = "/login";
}

// Hàm xử lý lỗi trung tâm
function handleError(error) {
  const { status, data } = error.response || {};

  switch (status) {
    case 401:
      handleLogout();
      break;
    case 500:
      if (data.message === "invalid signature" || data.message === "jwt expired") {
        handleLogout();
      }
      break;
    // Thêm các trường hợp lỗi khác ở đây
    default:
      break;
  }

  return Promise.reject(error);
}

// Cài đặt interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Bearer");
    const clientId = localStorage?.getItem("x-client-id");
    if (token) {
      config.headers["authorization"] = token;
    }
    if (clientId) {
      config.headers["x-client-id"] = clientId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use((response) => response, handleError);

export default axiosInstance;
