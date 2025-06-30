import axios from "axios";

const API_URL = "http://localhost:8000/api";
const token = localStorage.getItem("authToken");
export const getSteps = async (scenarioId) => {
  try {
    const response = await axios.get(`${API_URL}/steps/${scenarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};