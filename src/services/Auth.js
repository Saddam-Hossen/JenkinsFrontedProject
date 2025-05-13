import axios from "axios";

const BASE_URL_USER_SERVICE = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:8080`;

const API_URL = `${BASE_URL_USER_SERVICE}/api/user/token`;
const API_URL_REFRESH = `${BASE_URL_USER_SERVICE}/api/user/refresh`;

const getToken = () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.warn("No token found in localStorage");
            return null;
        }
       // alert(token);
        return token;
    } catch (error) {
        console.error("Failed to get token:", error);
        return null;
    }
};

const isTokenExpired = () => {
    const expiry = sessionStorage.getItem("expiry");
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
};

const handleSessionExpiry = () => {
    if (isTokenExpired()) {
        //alert("Session expired. Please log in again.");
        sessionStorage.clear();
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("roleData");
        window.location.href = "/";
    }
};

const checkAndRefreshToken = async () => {
  console.log("Checking token refresh...");
  
  if (isTokenExpired()) {
      console.log("Token expired, attempting to refresh...");
      try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
              console.warn("No refresh token found, redirecting to login.");
              handleSessionExpiry();
              return;
          }

          const response = await axios.post(API_URL_REFRESH, { refreshToken });

          if (response.data.accessToken) {
              //console.log("New access token received:", response.data.accessToken);

              localStorage.setItem("authToken", response.data.accessToken);
              localStorage.setItem("roleData", response.data.Role);
              sessionStorage.setItem("expiry", Date.now() + 20 * 60 * 1000); // Extend session
              
          } else {
              console.error("Refresh failed: No access token received.");
              handleSessionExpiry();
          }
      } catch (error) {
          console.error("Error refreshing token:", error.response?.data || error.message);
          handleSessionExpiry();
      }
  } else {
      console.log("Token is still valid.");
  }
};


// Export all functions
export  { getToken, isTokenExpired, checkAndRefreshToken, handleSessionExpiry };
