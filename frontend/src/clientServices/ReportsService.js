import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVICE_URL}reports`; 

// Fetch a single report by ID
export const getReportById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        throw error;
    }
};

// Fetch all reports
export const getAllReports = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching all reports:', error);
        throw error;
    }
};

// Create a new report
export const createReport = async (hmoID, date, amountOfPatients) => {
    try {
        const response = await axios.post(API_URL, {
            hmoID,
            date,
            amountOfPatients,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating report:', error);
        throw error;
    }
};

// Update an existing report by ID
export const updateReport = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating report:', error);
        throw error;
    }
};

// Delete a report by ID
export const deleteReport = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
};

// Generate a daily report for a specific date
export const generateDailyReport = async (date) => {
    try {
        const response = await axios.post(`${API_URL}/generate/getGenerateReport`, { date });
        return response.data;
    } catch (error) {
        console.error('Error generating daily report:', error);
        throw error;
    }
};

// Get today's reports
export const getTodayReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/generate/today`);
        return response.data;
    } catch (error) {
        console.error('Error fetching today\'s reports:', error);
        throw error;
    }
};
