import axios from "axios";

const API_URL = "http://localhost:8000/api";
const token = localStorage.getItem("authToken");
export const getUserProgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserProgress = async ({
  userId,
  scenarioId,
  completed,
  xp_earned,
  current_step,
  finished_at,
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/progress/${scenarioId}`,
      {
        userId,
        completed,
        xp_earned,
        current_step,
        finished_at: finished_at.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error.response?.data || error.message;
  }
};

export const getScenario = async () => {
  try {
    const response = await axios.get(`${API_URL}/scenario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
