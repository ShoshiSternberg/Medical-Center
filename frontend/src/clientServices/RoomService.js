import axios from 'axios';

const API_URL = 'https://medical-center-znya.onrender.com/rooms';

export const getAllRooms = async () => {
    return axios.get(API_URL);
};

export const getRoomById = async (id) => {
    return (await axios.get(`${API_URL}/${id}`));
};

export const createRoom = async (Name, Status) => {
    return axios.post(API_URL, { Name, Status });
};

export const updateRoom = async (id, Name, Status) => {
    return axios.put(`${API_URL}/${id}`, { Name, Status });
};

export const deleteRoom = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
