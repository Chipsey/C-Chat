import axios from "axios";
import localStorageService from "../utils/localStorage";

const API_URL = "http://localhost:8000/api"; // Update this to your API base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorageService.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createItem = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error creating item: ${error.response?.data?.message || error.message}`
    );
  }
};

// Read (fetch all items)
export const fetchItems = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching items: ${error.response?.data?.message || error.message}`
    );
  }
};

// Read (fetch a single item by ID)
export const fetchItemById = async (endpoint, id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching item: ${error.response?.data?.message || error.message}`
    );
  }
};

// Update
export const updateItem = async (endpoint, id, data) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error updating item: ${error.response?.data?.message || error.message}`
    );
  }
};

// Delete
export const deleteItem = async (endpoint, id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
    return { message: "Item deleted successfully" };
  } catch (error) {
    throw new Error(
      `Error deleting item: ${error.response?.data?.message || error.message}`
    );
  }
};

// Mark Seen
export const setSeenMessages = async (endpoint) => {
  try {
    const response = await api.put(`${endpoint}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error seenMessages item: ${error.response?.data?.message || error.message}`
    );
  }
};
