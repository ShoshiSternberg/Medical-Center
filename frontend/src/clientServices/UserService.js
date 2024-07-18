import axios from 'axios';

const API_URL = 'http://localhost:8000/users';

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/id/${id}`);
  return response.data;
};

export const getUserByEmailAddress = async (emailAddress) => {
  const response = await axios.get(`${API_URL}/email/${emailAddress}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

export const userLogin = async (user) => {
  const response = await axios.post(`${API_URL}/login`, user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await axios.put(`${API_URL}/${id}`, user);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
