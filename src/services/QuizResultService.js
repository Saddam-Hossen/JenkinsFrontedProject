import axios from "axios";
import { getToken } from "./Auth";

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;
const InsertClass = `${BASE_URL}/api/quizResult/insert`;
const getClass = `${BASE_URL}/api/quizResult/getAllAdmin`;
const getClassSingle = `${BASE_URL}/api/quizResult/getAll`;
const deleteClass = `${BASE_URL}/api/quizResult/indel`;

const getAllClasses = async () => {
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
        console.error("Error fetching classes:", error);
        throw error;
    }
};
const getAllClassesSingle = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(getClassSingle, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
    }
};

const saveClass = async (formData) => {
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
        console.error("Error saving class:", error);
        throw error;
    }
};

const deleteClassRecord = async (data) => {
    try {
        const token = await getToken();
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

export { getAllClasses, saveClass, deleteClassRecord,getAllClassesSingle };
