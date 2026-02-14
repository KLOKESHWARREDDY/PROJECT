import axios from 'axios';

// API configuration - consolidated for Create React App
// With proxy configured in package.json, we can use relative paths
// Or use absolute URL for development

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/upload-profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }
    
    return response.json();
  },
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Event APIs
export const eventAPI = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
};

// Registration APIs
export const registrationAPI = {
  register: (eventId) => api.post('/registrations/register', { eventId }),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  getAllPendingRegistrations: () => api.get('/registrations/all'),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  approve: (id) => api.put(`/registrations/${id}/approve`),
  reject: (id) => api.put(`/registrations/${id}/reject`),
};

// Ticket APIs
export const ticketAPI = {
  getMyTickets: () => api.get('/tickets/my'),
  getTicketById: (id) => api.get(`/tickets/${id}`),
  verifyTicket: (code) => api.get(`/tickets/verify/${code}`),
  useTicket: (id) => api.put(`/tickets/${id}/use`),
  downloadPDF: async (ticketId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tickets/${ticketId}/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticketId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

export default api;
