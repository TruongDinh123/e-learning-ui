import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  // baseURL: process.env.API_URL,
  baseURL: "https://e-learning-95lab-productionv1.onrender.com/v1/api",
  headers: {
    "Content-Type": "application/json",
    "x-api-key":
      "8ccaf2db9e10264dc29abdcc653f1c59673144131bd08c870751ce80490d926c407ad256fcf7c409df42c6af17f779b94c2695b769f3d1eb76f726e97a12773b",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage?.getItem("authorization");
    const clientId = localStorage?.getItem("x-client-id");
    if (token) {
      config.headers["authorization"] = token;
    }

    if (clientId) {
      config.headers["x-client-id"] = clientId;
    }
    return config;
  }, 
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // If the response is successful, just return it
    return response;
  },
  function (error) {
    // If the response has a status of 500 and the message is 'invalid signature'
    if (error.response.status === 500 && error.response.data.message === 'invalid signature') {
      // Remove the invalid token from localStorage
      localStorage.removeItem('authorization');
      localStorage.removeItem('x-client-id');
      Cookies.remove("Bearer");

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
