import axios from "axios";
import {getToken} from "./Auth";

const BASE_URL_USER_SERVICE = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:8080`;

const API_URL = `${BASE_URL_USER_SERVICE}/api/user/insert`;
const Update_API_URL = `${BASE_URL_USER_SERVICE}/api/user/update`;
const GET_API_URL = `${BASE_URL_USER_SERVICE}/api/user/getAll`;
const Delete_API_URL = `${BASE_URL_USER_SERVICE}/api/user/delete`;
const Login_API_URL = `${BASE_URL_USER_SERVICE}/api/student/login`;

// Fetch the token from the backend

// Function to add an employee
const addEmployee = async (employeeData, size) => {
  try {
    const updatedEmployeeData = {
      ...employeeData,
      status: "1", 
      endDate: "",
      position: size,
      currentTimee: new Date().toISOString(),
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    alert(response.data);
    return response;
  }catch (error) {
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

// Function to add an employee
const updateEmployee = async (employeeData, size,rowId) => {
  try {
    const updatedEmployeeData = {
      ...employeeData,
      status: "1", 
      endDate: "",
      position: size,
      currentTimee: new Date().toISOString(),
      rowId: rowId,
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(Update_API_URL, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    alert(response.data);
    return response;
  }  catch (error) {
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

const getAllEmployees = async (status) => {
  try {
    const token = await getToken(); // ✅ Await token retrieval
    const response = await axios.get(GET_API_URL, {
      headers: { "Authorization": `Bearer ${token}` },
      params: { status },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.warn("Unauthorized access. Redirecting to login...");
      window.location.href = "/"; // 🔴 Redirect to login page
    } else {
      console.error("Error fetching employees:", error);
    }
    throw error;
  }
};


// Function to delete an employee
const deleteEmployee = async (id, endDate) => {
  try {
    const token = await getToken(); // ✅ Fix: Await getToken()
    const response = await axios.post(Delete_API_URL, { id, endDate }, {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    });
    alert(response.data);
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

const loginEmloyee = async (email, password,handleError) => {
  try {
    const response = await axios.post(Login_API_URL, { email, password }, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data; // Return response data if login is successful
  } catch (error) {
    let errorMessage = "An unknown error occurred.";

    if (error.response) {
      // Backend responded with a status code outside the 2xx range
      console.error("Backend error response:", error.response);
      
      if (error.response.status === 401) {
        errorMessage = "❌ Invalid credentials. Please try again.";
      } else if (error.response.status === 403) {
        errorMessage = "⛔ Access denied. You do not have permission to log in.";
      } else if (error.response.status === 500) {
        errorMessage = "⚠️ Server error. Please try again later.";
      } else {
        errorMessage = `❌ Error: ${error.response.data.error || error.response.statusText}`;
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received from backend:", error.request);
      errorMessage = "🌐 Network error: No response from server.";
    } else {
      // Something went wrong in setting up the request
      console.error("Request setup error:", error.message);
      errorMessage = `⚠️ Request error: ${error.message}`;
    }

   // alert(errorMessage); // Show error message to user
    handleError(errorMessage|| "Something went wrong. Please try again.");

    throw error; // Rethrow for handling in calling function
  }
};



export { addEmployee, getAllEmployees, deleteEmployee ,loginEmloyee,updateEmployee };
