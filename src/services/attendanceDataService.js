import axios from "axios";
import {getToken} from "./Auth"; // Import getToken function

const BASE_URL_ATTENDANCE = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const API_URL = `${BASE_URL_ATTENDANCE}/api/attendance/insert`;
const exportAllAttendanceData_URL = `${BASE_URL_ATTENDANCE}/api/attendance/exportAllAttendanceData`;
const GetAllAttendanceData_URL = `${BASE_URL_ATTENDANCE}/api/attendance/getAllAttendanceData`;
const GetAllAttendanceDataForFixedDay_URL = `${BASE_URL_ATTENDANCE}/api/attendance/getAllAttendanceDataForFixedDay`;
const updateAttendanceData_URL = `${BASE_URL_ATTENDANCE}/api/attendance/updateAttendanceData`;
const GetAttendanceDataForAnyPeriod_URL = `${BASE_URL_ATTENDANCE}/api/attendance/getAttendanceDataForAnyPeriod`;
const exportSummaryAttendanceData_URL = `${BASE_URL_ATTENDANCE}/api/attendance/exportSummaryAttendanceData`;
const saveAttendance = async (attendanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(API_URL, attendanceData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return { message: "Failed to save attendance" };
  }
};

const getAttendanceData = async (startDate, endDate) => {
  try {
    const token = await getToken();
    const response = await axios.post(GetAllAttendanceData_URL, { startDate, endDate }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAttendanceDataForAnyPeriod = async (employeeId, employeeName, startDate, endDate) => {
  try {
    const token = await getToken();
    const response = await axios.post(GetAttendanceDataForAnyPeriod_URL, { 
      employeeId, employeeName, startDate, endDate 
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateAttendance = async (newData, oldData) => {
  try {
    const token = await getToken();
    const response = await axios.post(updateAttendanceData_URL, { newData, oldData }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAttendanceDataForFixDay = async (selectedDate) => {
  try {
    const token = await getToken();
    const response = await axios.post(GetAllAttendanceDataForFixedDay_URL, { selectedDate }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const exportDownloadAllAttendanceData = async (attendanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(exportAllAttendanceData_URL, attendanceData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: 'blob', // Important for Excel/binary files
    });

    // Create blob from response
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Optional: Use timestamp in filename
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
    link.download = `AllEmployee_AllData_Report_${timestamp}.xlsx`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true; // signal success
  } catch (error) {
    console.error("Export failed:", error);
    if (error.response && error.response.data) {
      const reader = new FileReader();
      reader.onload = () => {
        const message = reader.result;
        alert("Error from server: " + message);
      };
      reader.readAsText(error.response.data);
    } else {
      alert("Failed to export data. Please try again.");
    }
    return false;
  }
};
const exportSummaryAttendanceData = async (attendanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(exportSummaryAttendanceData_URL, attendanceData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: 'blob', // Important for Excel/binary files
    });

    // Create blob from response
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Optional: Use timestamp in filename
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
    link.download = `Employee_Summary_Report_${timestamp}.xlsx`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true; // signal success
  } catch (error) {
    console.error("Export failed:", error);
    if (error.response && error.response.data) {
      const reader = new FileReader();
      reader.onload = () => {
        const message = reader.result;
        alert("Error from server: " + message);
      };
      reader.readAsText(error.response.data);
    } else {
      alert("Failed to export data. Please try again.");
    }
    return false;
  }
};

export { 
  saveAttendance, 
  getAttendanceData, 
  exportDownloadAllAttendanceData, 
  getAttendanceDataForFixDay, 
  updateAttendance, 
  getAttendanceDataForAnyPeriod, 
  exportSummaryAttendanceData 
};
