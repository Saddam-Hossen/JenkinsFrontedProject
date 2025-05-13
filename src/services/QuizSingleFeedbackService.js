import axios from "axios";
import { getToken } from "./Auth"; // assumes you have getToken() function ready

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;

const InsertFeedback = `${BASE_URL}/api/quizFeedback/insert`;
const GetAllFeedbackSingle = `${BASE_URL}/api/quizFeedback/getAll`;
const GetAllFeedback = `${BASE_URL}/api/quizFeedback/getAllAdmin`;
const UpdateFeedback = `${BASE_URL}/api/quizFeedback/up`;

// Fetch all feedback
const getAllQuizFeedback = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetAllFeedback, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching quiz feedback:", error);
    throw error;
  }
};
// Fetch all feedback
const getAllQuizFeedbackSingle = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetAllFeedbackSingle, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching quiz feedback:", error);
    throw error;
  }
};

// Insert new feedback
const saveQuizFeedback = async (formData) => {
  try {
    const token = await getToken();
    const response = await axios.post(InsertFeedback, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error saving quiz feedback:", error);
    throw error;
  }
};

const updateQuizFeedback = async (updatedData) => {

    console.log("Updating quiz feedback with data:", updatedData);
    try {
      const token = await getToken();
      const response = await axios.post(UpdateFeedback, updatedData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error updating quiz feedback:", error);
      throw error;
    }
  };
  
  

export { getAllQuizFeedback, saveQuizFeedback, updateQuizFeedback ,getAllQuizFeedbackSingle};
