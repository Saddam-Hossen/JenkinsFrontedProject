import axios from "axios";
import { getToken } from "./Auth";

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;
const InsertQuizlink = `${BASE_URL}/api/quizlink/insert`;
const getQuizlink = `${BASE_URL}/api/quizlink/getAll`;
const deleteQuizlink = `${BASE_URL}/api/quizlink/indel`;

const getAllQuizlinks = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(getQuizlink, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching quizlinks:", error);
        throw error;
    }
};

const saveQuizlink = async (formData) => {
    try {
        const token = await getToken();
        const response = await axios.post(InsertQuizlink, formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error saving quizlink:", error);
        throw error;
    }
};

const deleteQuizlinkById = async (data) => {
    try {
        const token = await getToken();
        const response = await axios.post(deleteQuizlink, data, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting quizlink:", error);
        throw error;
    }
};

export { getAllQuizlinks, saveQuizlink, deleteQuizlinkById };
