import axios from "axios";
import {getToken} from "./Auth";

const BASE_URL_GLOBAL_SETTING = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const API_URL = `${BASE_URL_GLOBAL_SETTING}/api/globalSetting/insert`;
const GET_API_URL = `${BASE_URL_GLOBAL_SETTING}/api/globalSetting/getAll`;
const Delete_API_URL = `${BASE_URL_GLOBAL_SETTING}/api/globalSetting/del`;
const Update_API_URL = `${BASE_URL_GLOBAL_SETTING}/api/globalSetting/update`;
const UpdateDel_API_URL = `${BASE_URL_GLOBAL_SETTING}/api/globalSetting/updateDel`;
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

const addGlobalSettingData = async (GlobalSettingData) => {
  try {
    const updatedGlobalSettingData = {
      ...GlobalSettingData,
      currentTime: formatCurrentTime(),
      status: "1",
    };

    const response = await axios.post(API_URL, updatedGlobalSettingData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data === "Successfully inserted") {
      alert("Data inserted successfully!");
    } else {
      alert("Server responded: " + response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error inserting global setting data:", error);
    alert("Failed to insert data. Please try again.");
    throw error;
  }
};



const updateGlobalData = async (rowId, GlobalSettingData) => {
  try {
    const updatedGlobalSettingData = {
      ...GlobalSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
      rowId: rowId,
    };

    const response = await axios.post(Update_API_URL, updatedGlobalSettingData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data === "Successfully updated") {
      alert("Data updated successfully!");
    } else {
      alert("Server responded: " + response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating global setting data:", error);
    alert("Failed to update data. Please try again.");
    throw error; // Still throw to handle elsewhere if needed
  }
};
const updateGlobalDataDEl = async (rowId, GlobalSettingData) => {
  try {
    const updatedGlobalSettingData = {
      ...GlobalSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
      rowId: rowId,
    };

    const response = await axios.post(UpdateDel_API_URL, updatedGlobalSettingData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data === "Successfully updated") {
      alert("Data updated successfully!");
    } else {
      alert("Server responded: " + response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating global setting data:", error);
    alert("Failed to update data. Please try again.");
    throw error; // Still throw to handle elsewhere if needed
  }
};

const getAllGlobalData = async (status) => {
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




export { addGlobalSettingData, getAllGlobalData, updateGlobalDataDEl ,updateGlobalData};
