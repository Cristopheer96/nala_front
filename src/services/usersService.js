import api from './api';

export const fetchUsers = async () => {
  const response = await api.get('/api/v1/users');
  return response.data;

};
