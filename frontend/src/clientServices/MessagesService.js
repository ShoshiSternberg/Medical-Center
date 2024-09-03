import axios from 'axios';

const API_URL = 'https://medical-center-znya.onrender.com/messages';

export const getAllMessages = async () => {
    return axios.get(API_URL);
};

export const getMessageById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createMessage = async (Message, Status) => {
    return axios.post(API_URL, { Message, Status });
};

export const updateMessage = async (id, Message) => {
    return axios.put(`${API_URL}/${id}`, {Message});
};

export const updateMessageStatus = async (ID, Status) => {
    return axios.put(`${API_URL}`, { ID,Status});
};


export const deleteMessage = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
