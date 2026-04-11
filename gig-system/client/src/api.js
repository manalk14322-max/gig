import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gig.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchGigs = (params) => api.get('/gigs', { params }).then((res) => res.data);
export const fetchGig = (id) => api.get(`/gigs/${id}`).then((res) => res.data);
export const createGig = (payload) => api.post('/gigs', payload).then((res) => res.data);
export const updateGig = (id, payload) => api.put(`/gigs/${id}`, payload).then((res) => res.data);
export const deleteGig = (id) => api.delete(`/gigs/${id}`).then((res) => res.data);
export const createReview = (id, payload) => api.post(`/gigs/${id}/reviews`, payload).then((res) => res.data);
export const searchGigs = (params) => api.get('/search', { params }).then((res) => res.data);
export const aiSuggest = (payload) => api.post('/ai/suggest', payload).then((res) => res.data);
export const signup = (payload) => api.post('/auth/signup', payload).then((res) => res.data);
export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data);
export const fetchMe = () => api.get('/auth/me').then((res) => res.data);
export const createOrder = (payload) => api.post('/orders', payload).then((res) => res.data);
export const fetchOrders = () => api.get('/orders').then((res) => res.data);
export const startChat = (payload) => api.post('/chats/start', payload).then((res) => res.data);
export const fetchChats = () => api.get('/chats').then((res) => res.data);
export const sendMessage = (id, payload) => api.post(`/chats/${id}/messages`, payload).then((res) => res.data);
export const initEasypaisa = (payload) => api.post('/payments/easypaisa/init', payload).then((res) => res.data);
export const fetchProfile = () => api.get('/users/me').then((res) => res.data);
export const updateProfile = (payload) => api.put('/users/me', payload).then((res) => res.data);
export const fetchSellerPublic = (id) => api.get(`/users/${id}/public`).then((res) => res.data);

export default api;
