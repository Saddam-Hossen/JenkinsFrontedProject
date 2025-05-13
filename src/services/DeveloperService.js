// Function to add an employee
import axios from "axios";
import {getToken} from "./Auth";

const BASE_URL_USER = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:8080`;
const BASE_URL_ATTENDANCE = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const API_URL           = `${BASE_URL_USER}/api/developer/insert`;
const API_URL_Page      = `${BASE_URL_USER}/api/developer/insertPage`;
const API_URL_Component = `${BASE_URL_USER}/api/developer/insertComponent`;
const GET_API_URL       = `${BASE_URL_USER}/api/developer/getAll`;
const Delete_API_URL    = `${BASE_URL_USER}/api/user/delete`;

// Fetch the token from the backend
const addEmployee = async (employeeData) => {

    try {
      const updatedEmployeeData = {
        ...employeeData
       
      };
  
      const token = await getToken();  // ✅ Fix: Await getToken()
  
      const response = await axios.post(API_URL, updatedEmployeeData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      console.error("Error adding employee:", error);
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
const deleteEmployee = async (id, endDate) => {
    try {
      const token = await getToken(); // ✅ Fix: Await getToken()
      const response = await axios.post(Delete_API_URL, { id, endDate }, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
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

      console.log("Response: "+response.data);
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
  export {addEmployee,deleteEmployee,getAllEmployees,addEmployeePage,addEmployeeComponent};