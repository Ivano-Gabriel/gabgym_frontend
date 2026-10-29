import axios from 'axios';
import { clearAuthSession } from '../utils/auth';

// Em produção, defina REACT_APP_API_URL no painel da Vercel.
const baseURL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : '/api');

const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 25000
});

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 &&
        !error.config?.url?.endsWith('/users/login')) {
      clearAuthSession();
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/users/login', credentials);
  const { token, userId, username, role } = response.data;
  if (!token || !userId || !username || !role) throw new Error('Resposta de login inválida');
  clearAuthSession();
  sessionStorage.setItem('authToken', token);
  sessionStorage.setItem('role', role);
  // IDs no browser são apenas dicas de interface, nunca autorizam requisições.
  localStorage.setItem('userId', String(userId));
  localStorage.setItem('username', username);
  return response;
};

export const logoutUser = async () => {
  try {
    if (sessionStorage.getItem('authToken')) await apiClient.post('/users/logout');
  } finally {
    clearAuthSession();
  }
};

export const registerUser = userData => apiClient.post('/users/register', userData);
export const getCurrentUser = () => apiClient.get('/users/me');
export const getUser = id => apiClient.get(`/users/${id}`);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const getAtividades = id => apiClient.get(`/users/${id}/logs`);
export const addAtividade = (id, data) => apiClient.post(`/users/${id}/logs`, data);
export const getMuscleGroups = () => apiClient.get('/workout/groups');
export const getExercises = () => apiClient.get('/workout/exercises');
export const getExerciseById = id => apiClient.get(`/workout/exercises/${id}`);
export const getFoodCategories = () => apiClient.get('/diet/categories');
export const getFoods = () => apiClient.get('/diet/foods');
export const getDiaryLogs = (id, date) => apiClient.get(`/logs/user/${id}`, { params: { date } });
export const addDiaryLog = data => apiClient.post('/logs', data);
export const deleteDiaryLog = id => apiClient.delete(`/logs/${id}`);
export const getMetas = id => apiClient.get(`/metas/user/${id}`);
export const createMeta = data => apiClient.post('/metas', data);
export const updateMetaStatus = (id, data) => apiClient.put(`/metas/${id}/status`, data);
export const getStudents = () => apiClient.get('/admin/students');
export const getStudent = id => apiClient.get(`/admin/students/${id}`);
