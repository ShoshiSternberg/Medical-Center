import axios from 'axios';

const API_URL = 'https://medical-center-znya.onrender.com/users';

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  }
  catch (error) {
    console.error('Error get all users:', error);
    throw error;
  }

};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/id/${id}`);
    return response.data;
  }
  catch (error) {
    console.error('Error get user by id:', error);
    throw error;
  }

};

export const getUserByEmailAddress = async (emailAddress) => {
  try {
    const response = await axios.get(`${API_URL}/email/${emailAddress}`);
    console.log("checkEmail",response.data)
    return response.data;
  }
  catch (error) {
    console.error('Error get use by email:', error);
    throw error;
  }
 
};

export const createUser = async (user) => {
  try {
    const response = await axios.post(API_URL, user);
    return response.data;
  }
  catch (error) {
    console.error('Error create user:', error);
    throw error;
  }
  
};

export const userLogin = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/login`, user);
    console.log(response)
    return response.data;
  }
  catch (error) {
    console.error('Error login user:', error);
    throw error;
  }
};

export const updateUser = async (id, user) => {

  try {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
  }
  catch (error) {
    console.error('Error update user:', error);
    throw error;
  }
  
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
  }
  catch (error) {
    console.error('Error delete user by ID:', error);
    throw error;
  }
  
};
