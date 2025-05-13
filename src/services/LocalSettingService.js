import axios from "axios";

import {getToken} from "./Auth";
const BASE_URL_LOCAL_SETTING = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const API_URL = `${BASE_URL_LOCAL_SETTING}/api/localSetting/insert`;
const GET_API_URL = `${BASE_URL_LOCAL_SETTING}/api/localSetting/getAll`;
const DELETE_API_URL = `${BASE_URL_LOCAL_SETTING}/api/localSetting/delete`;
const Update_API_URL = `${BASE_URL_LOCAL_SETTING}/api/localSetting/update`;



const formatCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); 
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const addLocalSettingData = async (LocalSettingData) => {
  try {
    const updatedLocalSettingData = {
      ...LocalSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
    };

    const response = await axios.post(API_URL, updatedLocalSettingData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data === "Successfully inserted") {
      alert("Data inserted successfully!");
    } else {
      alert("Warning: " + response.data);
    }

    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      alert("Error: " + error.response.data);
    } else {
      alert("An unexpected error occurred while adding data.");
    }
    return null;
  }
};


const getAllLocalData = async (status) => {
  try {
    const response = await axios.get(GET_API_URL, {
      params: { status },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateLocalSettingData = async (row) => {
  try {
    const response = await axios.post(Update_API_URL, row, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    // Check success response message from backend
    if (response.data === "Successfully updated") {
      alert("Data updated successfully!");
    } else {
      alert("Warning: " + response.data);
    }

    return response.data;

  } catch (error) {
    // If backend sends a message (e.g., from ResponseEntity.body)
    if (error.response && error.response.data) {
      alert("Error: " + error.response.data);
    } else {
      alert("An unexpected error occurred while inserting data.");
    }

    return null;
  }
};


const deleteLocalData = async (row) => {
  try {
    const response = await axios.delete(DELETE_API_URL, {
      data: row,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export { addLocalSettingData, getAllLocalData, deleteLocalData,updateLocalSettingData };
