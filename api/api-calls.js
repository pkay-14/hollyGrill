import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
  }
});

// 📋 MENU API
export const getMenuItems = () => apiClient.get('/menu');
export const getMenuItem = (id) => apiClient.get(`/menu/${id}`);

export const createMenuItem = (formData) =>
  apiClient.post('/menu', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateMenuItem = (id, formData) =>
  apiClient.put(`/menu/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteMenuItem = (id) => apiClient.delete(`/menu/${id}`);

// 📇 CONTACT INFO API
export const getContactInfo = () => apiClient.get('/contact');

export const createContactInfo = (data) => apiClient.post('/contact', data);

export const updateContactInfo = (id, data) => apiClient.put(`/contact/${id}`, data);

export const deleteContactInfo = (id) => apiClient.delete(`/contact/${id}`);

// 🔐 ADMIN AUTH
export const login = (credentials) => apiClient.post('/admin/login', credentials);

export const register = (credentials) => apiClient.post('/admin/register', credentials);

export const checkTokenValidity = (token) => {
  return apiClient
    .get('/admin/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in Authorization header
      },
    })
    .then((response) => {
      // Assume the server responds with a status indicating whether the token is valid or not
      return response.data.isValid; // Return the validity status
    })
    .catch((error) => {
      // Log error if the request fails and return false (invalid token)
      console.error('Token validation failed:', error);
      return false;
    });
};