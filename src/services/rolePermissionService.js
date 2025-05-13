// Function to add an employee
import axios from "axios";
import {getToken} from "./Auth";
const BASE_URL_ROLE = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:8080`;

const API_URL = `${BASE_URL_ROLE}/api/role/insert`;
const API_URL_DELETE = `${BASE_URL_ROLE}/api/role/delete`;
const API_URL_DELETE_Permission = `${BASE_URL_ROLE}/api/role/deletePermission`;
const API_URL_Update = `${BASE_URL_ROLE}/api/role/update`;
const API_URL_PERMISSION = `${BASE_URL_ROLE}/api/role/permission`;
const API_URL_Page = `${BASE_URL_ROLE}/api/developer/insertPage`;
const API_URL_Component = `${BASE_URL_ROLE}/api/developer/insertComponent`;
const GET_API_URL = `${BASE_URL_ROLE}/api/role/getAll`;
const GET_API_URL_SINGLE_ROLE_DATA = `${BASE_URL_ROLE}/api/role/getSingleRoleData`;
const GET_API_URL_USERS = `${BASE_URL_ROLE}/api/user/getAll`;
const GET_API_URL_ROLE = `${BASE_URL_ROLE}/api/role/getAllRole`;
const API_URL_AssignPermission = `${BASE_URL_ROLE}/api/role/assignPermission`;


// Fetch the token from the backend
const addEmployee = async (employeeData) => {
  try {
    const updatedEmployeeData = {
      ...employeeData
    };

    const token = await getToken();  // ✅ Ensure token is being fetched correctly
    console.log("Token:", token);  // Debug: Check if token is being fetched correctly

    const response = await axios.post(API_URL, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    // Log the full response for debugging
    console.log("Response from backend:", response);
    alert(response.data);
    return response;
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

  // Fetch the token from the backend
const addEmployeePage = async (employeeData) => {

  try {
    const updatedEmployeeData = {
      ...employeeData
     
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL_Page, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};
const addEmployeeComponent = async (employeeData) => {

  try {
    const updatedEmployeeData = {
      ...employeeData
     
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL_Component, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};
  // Function to delete an employee
const deleteRole = async (id) => {
    try {
      const token = await getToken(); // ✅ Fix: Await getToken()
      const response = await axios.post(API_URL_DELETE, id, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      return response;
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
  const updateRole = async (data) => {
    try {
      const token =  getToken();  // ✅ Ensure token is being fetched properly
     // console.log("Token:", token);  // Debug: Check if token is being fetched correctly
  
      const response = await axios.post(API_URL_Update, data, {
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
        }
      });
  
      // Log the full response for debugging
      console.log("Response from backend:", response);
  
      return response;
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
  
   // Function to delete an employee
const deletePemission = async (data) => {
  try {
    const token = await getToken(); // ✅ Fix: Await getToken()
    const response = await axios.post(API_URL_DELETE_Permission, data, {
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

 
  const getAllUsers = async (status) => {
    try {
      const token = await getToken(); // ✅ Await token retrieval
      const response = await axios.get(GET_API_URL_USERS, {
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
  
  const getAllRole = async (status) => {
   
    try {
      const token = await getToken(); // ✅ Await token retrieval
      const response = await axios.get(GET_API_URL_ROLE, {
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

  // Fetch the token from the backend
const saveRolesToDatabase = async (selectedRole,employeeData) => {

    try {
      const updatedEmployeeData = {
        ...employeeData,
        roleName:selectedRole,
       
      };
  
      const token = await getToken();  // ✅ Fix: Await getToken()
  
      const response = await axios.post(API_URL_PERMISSION, updatedEmployeeData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      alert(response.data);
      return response;
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

   // Fetch the token from the backend
const addAssignPermission = async (employeeData) => {

  try {
    const updatedEmployeeData = {
      ...employeeData
     
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL_AssignPermission, updatedEmployeeData, {
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
const getAllRoleDataByRole = async (status) => {
   
  try {
    const token = await getToken(); // ✅ Await token retrieval
    const response = await axios.get(GET_API_URL_SINGLE_ROLE_DATA, {
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
  export {addEmployee,deleteRole,getAllUsers,deletePemission ,updateRole,getAllEmployees,addEmployeePage,addEmployeeComponent,getAllRole,saveRolesToDatabase,addAssignPermission,getAllRoleDataByRole};