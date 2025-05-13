import axios from "axios";

import {getToken} from "./Auth";
const BASE_URL_POSITION_SETTING = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const API_URL = `${BASE_URL_POSITION_SETTING}/api/positionSetting/insert`;
const GET_API_URL = `${BASE_URL_POSITION_SETTING}/api/positionSetting/getAll`;
const DELETE_API_URL = `${BASE_URL_POSITION_SETTING}/api/positionSetting/delete`;
const UPDATE_API_URL = `${BASE_URL_POSITION_SETTING}/api/positionSetting/updateSortingPosition`;



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

const addPositionSettingData = async (PositionSettingData) => {
  try {
    const updatedPositionSettingData = {
      ...PositionSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
    };

    const response = await axios.post(API_URL, updatedPositionSettingData, {
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

const getAllPositionData = async (status) => {
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

const deletePositionData = async (row) => {
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

const updatePositionData = async (row) => {

  try {
    const token = await getToken(); // ✅ Await token retrieval
    const response = await axios.post(UPDATE_API_URL, row, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { addPositionSettingData, getAllPositionData, deletePositionData, updatePositionData };
