import axios from 'axios'


const API = axios.create({ baseURL: 'https://chat-application-backend-five.vercel.app' });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);