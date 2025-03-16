import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');
  const client = localStorage.getItem('client');
  const uid = localStorage.getItem('uid');
  if (token && client && uid) {
    config.headers['access-token'] = token;
    config.headers['client'] = client;
    config.headers['uid'] = uid;
  }
  config.headers['Accept'] = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['access-token'];
    const newClient = response.headers['client'];
    const newUid = response.headers['uid'];
    if (newToken && newClient && newUid) {
      localStorage.setItem('access-token', newToken);
      localStorage.setItem('client', newClient);
      localStorage.setItem('uid', newUid);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
