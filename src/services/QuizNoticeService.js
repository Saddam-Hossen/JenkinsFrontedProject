import axios from "axios";
import { getToken } from "./Auth";

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:8080`;

const QUIZ_NOTICE_INSERT_API = `${BASE_URL}/api/quizNotice/insert`;
const QUIZ_NOTICE_GET_ALL_API = `${BASE_URL}/api/quizNotice/getAll`;
const QUIZ_NOTICE_UPDATE_API = `${BASE_URL}/api/quizNotice/status`;
const QUIZ_NOTICE_DELETE_API = `${BASE_URL}/api/quizNotice/delete`; // Assumes DELETE endpoint


const saveQuizNotice = async (noticeData) => {
  try {
    const token = await getToken();

    const response = await axios.post(QUIZ_NOTICE_INSERT_API, noticeData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Failed to save quiz notice:", error);
    throw error;
  }
};

const getAllQuizNotices = async () => {
  try {
    const token =  getToken();
    const response = await axios.get(QUIZ_NOTICE_GET_ALL_API, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quiz notices:", error);
    throw error;
  }
};
// services/QuizNoticeService.js
 const updateQuizNoticeStatus = async (id, newStatus) => {
    const token = await getToken();
    const response = await fetch(QUIZ_NOTICE_UPDATE_API, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      
  
    if (!response.ok) throw new Error("Failed to update status");
  
    return response.json(); // returns updated notice
  };

  const deleteQuizNotice = async (id) => {
    try {
      const token = await getToken();
      const response = await axios.request({
        url: QUIZ_NOTICE_DELETE_API, // e.g., /api/quizNotice/delete
        method: "post",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: { id }  // Send ID in body
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete quiz notice:", error);
      throw error;
    }
  };
  
  
export  { saveQuizNotice, getAllQuizNotices,updateQuizNoticeStatus ,deleteQuizNotice };
