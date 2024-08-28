import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Update this to your API base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create
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
