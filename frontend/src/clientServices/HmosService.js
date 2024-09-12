import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVICE_URL}HMOs`; // Adjust the base URL as necessary

// Fetch a single HMO by ID
export const getHMOById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching HMO by ID:', error);
        throw error;
    }
};

// Fetch all HMOs
export const getAllHMOs = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching all HMOs:', error);
        throw error;
    }
};

// Create a new HMO
export const createHMO = async (name) => {
    try {
        const response = await axios.post(API_URL, { Name: name });
        return response.data;
    } catch (error) {
        console.error('Error creating HMO:', error);
        throw error;
    }
};

// Update an existing HMO by ID
export const updateHMO = async (id, name) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, { Name: name });
        return response.data;
    } catch (error) {
        console.error('Error updating HMO:', error);
        throw error;
    }
};

// Delete an HMO by ID
export const deleteHMO = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting HMO:', error);
        throw error;
    }
};
