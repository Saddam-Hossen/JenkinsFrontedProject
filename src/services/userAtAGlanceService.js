import axios from "axios";
import {getToken} from "./Auth";
const BASE_URL_USER_AT_A_GLANCE = process.env.REACT_APP_API_URL_Attendance || `http://${window.location.hostname}:8181`;

const GET_API_URL = `${BASE_URL_USER_AT_A_GLANCE}/api/userAtAGlance/getAll`;
const EXPORT_API_URL = `${BASE_URL_USER_AT_A_GLANCE}/api/userAtAGlance/exportAtAGlanceData`;



// Function to retrieve user attendance data with filters
const getAllAtAGlanceData = async (employeeId, employeeName, startDate, endDate) => {
  try {
    const response = await axios.get(GET_API_URL, {
      params: { employeeId, employeeName, startDate, endDate }, 
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



const exportAtAGlanceData = async (AtAGlanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(EXPORT_API_URL, AtAGlanceData, {
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
    link.download = `Employee_At_A_Glance_Report_${timestamp}.xlsx`;

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
export { getAllAtAGlanceData, exportAtAGlanceData };
