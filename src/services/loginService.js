import axios from "axios";

const BASE_URL_AUTH = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const API_URL = `${BASE_URL_AUTH}/api/auth/login`;// Function to delete an employee
const loginEmloyee = async (userName, password) => {
   // const token = await getToken(); // ✅ Fix: Await getToken()
    alert(userName);
    try {
      const response = await axios.post(API_URL, { userName, password }, {
        headers: {  "Content-Type": "application/json" },

      });
      return response.data;
    } catch (error) {
      // Log full error to see what went wrong
      if (error.response) {
        // Backend responded with a status code outside the 2xx range
        console.error("Backend error response:", error.response);
        alert(`❌ error: ${error.response.data || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received from backend:", error.request);
        alert("Network error: No response from server.");
      } else {
        // Something went wrong in setting up the request
        console.error("Request setup error:", error.message);
        alert(`Error: ${error.message}`);
      }
  
      // Rethrow the error so it can be handled by the calling code
      throw error;
    }
  };

  export { loginEmloyee };