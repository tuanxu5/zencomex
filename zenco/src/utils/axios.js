import axios from "axios";

// Base URL for Docker services or environment-specific
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_API_URL}/api` || "https://zencomex.com/api"
    : "https://zencomex.com/api"; // For development

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies with requests if needed
});

// Function to set token dynamically
export const setAuthorizationHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const status = (error.response && error.response.status) || 500;

    switch (status) {
      case 401:
        // Handle unauthorized access (token related issues)
        console.error("Unauthorized access - 401");
        break;
      case 403:
        // Handle forbidden access (permission related issues)
        console.error("Forbidden access - 403");
        break;
      default:
        // Handle other errors
        console.error("API error -", status);
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
