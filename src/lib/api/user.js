import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");
  
  // Si aucun token, retourne null au lieu de lancer une erreur
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/user/currentuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Si erreur 401 (non autorisé), nettoyer le token invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
    }
    
    throw error.response?.data || { 
      message: error.message || "Failed to fetch user data" 
    };
  }
};