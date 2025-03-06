import axios from "axios";

// export const baseURL = "http://155.135.1.86:8082/"; //local
export const baseURL = "http://18.199.188.82:8082/"; //live

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 20000,
});

const getStore = () => {
  return require("../redux/configureStore").default;
};

const handleUnauthorized = () => {
  // Don't show session expired message on login page
  if (window.location.pathname === "/htpb") {
    return;
  }

  const store = getStore();
  const { logout } = require("../redux/modules/userSlice");

  store.dispatch(logout());

  const messageDiv = document.createElement("div");
  messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8d7da;
    color: #721c24;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    z-index: 9999;
  `;
  messageDiv.textContent = "Your session has expired. Redirecting to login...";
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    document.body.removeChild(messageDiv);
    window.location.href = "/";
  }, 3000);
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hitech-P-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "Unauthorized" &&
      window.location.pathname !== "/"
    ) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
