import axios from "axios";
import { getToken } from "./Auth";

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;
const InsertClass = `${BASE_URL}/api/quizClasses/insert`;
const getClass = `${BASE_URL}/api/quizClasses/getAll`;
const deleteClass = `${BASE_URL}/api/quizClasses/indel`;
const GET_API_URL = `${BASE_URL}/api/student/getAll`;

const getAllEmployees = async (status) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${GET_API_URL}?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn("Unauthorized access. Redirecting to login...");
        window.location.href = "/";
      } else {
        console.error("Error fetching employees:", error);
      }
      throw error;
    }
  };
  
 const getAllQuizNotices = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(getClass, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notices:", error);
        throw error;
    }
};

 const saveQuizNotice = async (formData) => {
    try {
        const token = await getToken();
        const response = await axios.post(InsertClass, formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error saving notice:", error);
        throw error;
    }
};
const deleteQuizClasses = async (data) => {
    try {
        const token = await getToken(); // Get the token
        const response = await axios.post(deleteClass, data, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
};

export { getAllQuizNotices, saveQuizNotice,deleteQuizClasses ,getAllEmployees};
