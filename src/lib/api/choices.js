import axios from "axios";

const API_URL = "http://localhost:8000/api";
const token = localStorage.getItem("authToken");
export const getChoices = async (stepId) => {
  try {
    const response = await axios.get(`${API_URL}/choices/step/${stepId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};