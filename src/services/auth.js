// src/services/auth.js
import api from './api';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/sign_in', credentials);
  return {
    data: response.data,
    headers: response.headers
  };
};

export const registerUser = async (userData) => {
  console.log('userData', userData);
  const response = await api.post('/auth', userData);
  return response.data;
};
