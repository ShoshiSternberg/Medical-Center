import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVICE_URL}patients`;

export const getAllPatientsWithQueueDetails = async () => {
    return axios.get(`${API_URL}/patientQueueDetails`);
};

export const getPatientById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createPatient = async (data) => {
    return axios.post(`${API_URL}/`, data);
};

export const updatePatient = async (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

export const deletePatient = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};


export const addManualPatient = async (data) => {
    return axios.post(`${API_URL}/addManualPatient`, data);
};
