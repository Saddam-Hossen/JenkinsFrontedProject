import axios from "axios";
import { getToken } from "./Auth"; // assumes you have a getToken() function ready

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;
const InsertAttendance = `${BASE_URL}/api/quizAttendance/insert`;
const InsertAttendanceFromAdmin = `${BASE_URL}/api/quizAttendance/insertFromAdmin`;
const updateAttendanceApi= `${BASE_URL}/api/quizAttendance/update`;

const GetAllAttendanceSingle = `${BASE_URL}/api/quizAttendance/getAll`;
const GetAllAttendance = `${BASE_URL}/api/quizAttendance/getAllAdmin`;
const DeleteAttendance = `${BASE_URL}/api/quizAttendance/delete`;

const getAllAttendance = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetAllAttendance, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    throw error;
  }
};
const getAllAttendanceSingle = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetAllAttendanceSingle, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    throw error;
  }
};

const saveAttendance = async (formData) => {
  try {
    const token = await getToken();
    const response = await axios.post(InsertAttendance, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error saving attendance:", error);
    throw error;
  }
};
const saveAttendanceFromAdmin = async (formData) => {
  try {
    const token = await getToken();
    const response = await axios.post(InsertAttendanceFromAdmin, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error saving attendance:", error);
    throw error;
  }
};
const updateAttendance = async (formData) => {
  try {
    const token = await getToken();
    const response = await axios.post(updateAttendanceApi, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error saving attendance:", error);
    throw error;
  }
};

const deleteAttendance = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post(DeleteAttendance, data, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting attendance:", error);
    throw error;
  }
};

export { getAllAttendance, saveAttendance, deleteAttendance,getAllAttendanceSingle,updateAttendance,saveAttendanceFromAdmin };
