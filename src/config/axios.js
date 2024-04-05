import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  //baseURL: process.env.API_URL || process.env.API_URL_PRODUCTION,
  // baseURL: "https://e-learning-95lab-productionv1.onrender.com/v1/api",
  //baseURL: "https://www.247learn.vn/v1/api",
  baseURL: "https://www.navibot.vn/v1/api",
  headers: {
    "Content-Type": "application/json",
    "x-api-key":
      "8ccaf2db9e10264dc29abdcc653f1c59673144131bd08c870751ce80490d926c407ad256fcf7c409df42c6af17f779b94c2695b769f3d1eb76f726e97a12773b",
  },
  withCredentials: true,
});

// Hàm xử lý đăng xuất
async function handleLogout() {
  try {
    const token = Cookies.get('Bearer');
    const clientId = localStorage.getItem('x-client-id');
    await axios({
      method: 'post',
      url: 'https://www.navibot.vn/v1/api/e-learning/logout',
      headers: {
        'x-api-key': '8ccaf2db9e10264dc29abdcc653f1c59673144131bd08c870751ce80490d926c407ad256fcf7c409df42c6af17f779b94c2695b769f3d1eb76f726e97a12773b',
        'x-client-id': clientId,
        'Authorization': token,
      },
    });
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    localStorage.clear();
    Cookies.remove('Bearer');
    Cookies.remove('refreshToken');
    window.location.href = '/login';
  }
}

async function refreshToken() {
  try {
    const refreshTokenValue = Cookies.get('refreshToken');
    const response = await axios({
      method: 'post',
      url: 'https://www.navibot.vn/v1/api/e-learning/handleRefreshToken',
      headers: {
        'x-api-key': '8ccaf2db9e10264dc29abdcc653f1c59673144131bd08c870751ce80490d926c407ad256fcf7c409df42c6af17f779b94c2695b769f3d1eb76f726e97a12773b',
        'x-client-id': localStorage.getItem('x-client-id'),
        'refresh-token': refreshTokenValue,
      },
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.metadata.tokens;
    Cookies.set('Bearer', accessToken, { sameSite: 'None', secure: true });
    Cookies.set('refreshToken', newRefreshToken, { sameSite: 'None', secure: true });
    return `Bearer ${accessToken}`;
  } catch (error) {
    handleLogout();
    throw error;
  }
}


function handleError(error) {
  const { status, data } = error.response || {};

  if (status === 401) {
    return refreshToken().then((accessToken) => {
      const originalRequest = error.config;
      originalRequest.headers['Authorization'] = accessToken;
      return axiosInstance(originalRequest);
    }).catch((refreshError) => {
      handleLogout();
      return Promise.reject(refreshError);
    });
  } else if (status === 500 && (data.message === "invalid signature" || data.message === "jwt expired")) {
    return refreshToken().then((accessToken) => {
      const originalRequest = error.config;
      originalRequest.headers['Authorization'] = accessToken;
      return axiosInstance(originalRequest);
    }).catch((refreshError) => {
      handleLogout();
      return Promise.reject(refreshError);
    });
  } else if (status === 404) {
    handleLogout();
    return Promise.reject(error);
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