import axios from 'axios';

const API_URL = 'https://medical-center-znya.onrender.com/queues';

// Fetch all queues
export const getAllQueues = async () => {
    return axios.get(API_URL);
};

// Fetch queue by ID
export const getQueueById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// Create a new queue
export const createQueue = async (data) => {
    return axios.post(API_URL, data);
};

// Update an existing queue by ID
export const updateQueue = async (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

// Delete a queue by ID
export const deleteQueue = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Fetch queue list by room ID
export const getQueueListByRoom = async (roomId) => {
    return axios.get(`${API_URL}/roomQueue/${roomId}`);
};

// Fetch queue by patient ID
export const getQueueByPatient = async (patientId) => {
    return axios.get(`${API_URL}/patient/${patientId}`);
};

// Fetch first in queue by room ID
export const getFirstInQueueByRoom = async (roomId) => {
    return axios.get(`${API_URL}/firstInQueue/${roomId}`);
};

// Fetch last in queue by room ID
export const getLastInQueueByRoom = async (roomId) => {
    return axios.get(`${API_URL}/lastInQueue/${roomId}`);
};

// Create an appointment
export const createAppointment = async (patientId, roomId) => {
    return axios.post(`${API_URL}/appointment`, { patientId, roomId });
};

// Move a patient between rooms
export const moveBetweenRooms = async (patientId, newRoomId, place) => {
    return axios.post(`${API_URL}/moveBetweenRooms`, { patientId, newRoomId, place });
};
