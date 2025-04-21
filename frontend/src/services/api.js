import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (username, password) => api.post('/loans/login/', { username, password }),
  logout: () => api.post('/loans/logout/'),
  getCurrentUser: () => api.get('/loans/current-user/'),
};

// Loan services
export const loanService = {
  getLoans: () => api.get('/loans/loans/'),
  getLoanById: (id) => api.get(`/loans/loans/${id}/`),
  applyForLoan: (data) => api.post('/loans/apply-loan/', data),
  approveLoan: (id) => api.post(`/loans/approve-loan/${id}/`),
  makePayment: (id, data) => api.post(`/loans/make-payment/${id}/`, data),
};

// Loan parameters services
export const loanParametersService = {
  getParameters: () => api.get('/loans/loan-parameters/'),
  defineParameters: (data) => api.post('/loans/define-loan-parameters/', data),
};

export default api;