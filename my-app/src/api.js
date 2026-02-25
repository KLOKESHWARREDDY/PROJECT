import axios from 'axios';

// API configuration
// API configuration
// If REACT_APP_API_URL is set, use it. Otherwise fall back to localhost for dev.
// Note: In production with same-origin, you might use '/api'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set default Authorization header from localStorage on app load
const storedToken = localStorage.getItem('token');
if (storedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // SCRUM-57: send httpOnly refresh token cookie on every request
});

// Request interceptor — attach latest access token
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

// SCRUM-57: Response interceptor — silent token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and don't retry /auth/refresh itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh — cookie is sent automatically via withCredentials
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.token;
        localStorage.setItem('token', newToken);
        if (data.user) localStorage.setItem('user', JSON.stringify({ ...data.user, token: newToken }));

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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

    const uploadUrl = `${API_URL}/uploads/upload-profile-image`;
    authAPI.DEBUG_UPLOAD_URL = uploadUrl; // Expose for debugging
    console.log('[API] Uploading to:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
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
  getTeacherEvents: () => api.get('/events/my-events'),
  getEventById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),

  // Draft + Publish System
  publish: (id) => api.put(`/events/${id}/publish`),
  unpublish: (id) => api.put(`/events/${id}/unpublish`),
  complete: (id) => api.put(`/events/${id}/complete`),
  schedulePublish: (id, publishAt) => api.put(`/events/${id}/schedule`, { publishAt }),
};

// Registration APIs - Updated routes
export const registrationAPI = {
  // Create registration
  register: (eventId) => api.post('/registrations', { eventId }),

  // Get student's registrations (pass studentId in URL)
  getStudentRegistrations: (studentId) => api.get(`/registrations/student/${studentId}`),

  // Get teacher's registrations
  getTeacherRegistrations: () => api.get('/registrations/teacher'),

  // Get pending registrations count for teacher dashboard
  getAllPendingRegistrations: () => api.get('/registrations/teacher/pending-count'),

  // Approve registration
  approve: (id) => api.put(`/registrations/approve/${id}`),

  // Reject registration
  reject: (id) => api.put(`/registrations/reject/${id}`),

  // Approve ALL
  approveAll: (ids) => api.put('/registrations/approve-all', { registrationIds: ids }),

  // Reject ALL
  rejectAll: (ids) => api.put('/registrations/reject-all', { registrationIds: ids }),

  // Cancel registration (student cancels)
  cancel: (id) => api.delete(`/registrations/${id}`),

  // Get single registration
  getRegistrationById: (id) => api.get(`/registrations/${id}`),
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
      headers: { 'Authorization': `Bearer ${token}` },
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

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
