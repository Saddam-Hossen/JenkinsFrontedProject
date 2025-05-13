import axios from "axios";
import { getToken } from "./Auth"; // assumes you have a getToken() function ready

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;
const InsertAttendance = `${BASE_URL}/api/quizAttendance/insert`;
const InsertAttendanceFromAdmin = `${BASE_URL}/api/student/insertPabna`;
const updatePabnaInformationApi= `${BASE_URL}/api/student/updatePabnaInformation`;
const GetPabnaDropdowndataApi = `${BASE_URL}/api/student/getAllPabna`;
const GetPabnaInformationApi = `${BASE_URL}/api/student/getAllPabnaInformation`;
const GetPabnaCategorydataApi = `${BASE_URL}/api/student/getAllCategory`;
const DeletePabnaOtherInfo = `${BASE_URL}/api/student/deleteOtherInfo`;
const DeleteAttendance = `${BASE_URL}/api/student/deleteInfo`;
const InsertOtherInfo = `${BASE_URL}/api/student/insertOtherInfo`;


const getAllOtherInfo = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetPabnaCategorydataApi, {
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
const  getAllDropdownData  = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetPabnaDropdowndataApi, {
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

const  getAllPabnaInformation  = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetPabnaInformationApi, {
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

const saveOtherInfo = async (formData) => {
  try {
    const token = await getToken();
    const response = await axios.post(InsertOtherInfo, formData, {
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
    const response = await axios.post(updatePabnaInformationApi, formData, {
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
const deleteOtherInfo = async (data) => {
  console.log("data",data)
  console.log("DeletePabnaOtherInfo",DeletePabnaOtherInfo)
  try {
    const token = await getToken();
    const response = await axios.post(DeletePabnaOtherInfo, data, {
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

export { getAllDropdownData,getAllPabnaInformation, saveAttendance, deleteAttendance,updateAttendance,saveAttendanceFromAdmin,saveOtherInfo,
  getAllOtherInfo,
  deleteOtherInfo };
