// src/services/apiService.js - VERSÃO JAVA/JWT
import axios from 'axios';

const apiClient = axios.create({
  // O React vai procurar a variável de ambiente primeiro. Se não achar, usa o localhost.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- O INTERCEPTADOR QUE ANEXA O "CRACHÁ" ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      // JWT usa o formato "Bearer <token>", não mais "Token <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ------------------------------------

// Login: agora bate no Java, não mais no dj-rest-auth
export const loginUser = (credentials) => {
  // credentials precisa ser { username, password } — não mais { email, password }
  return apiClient.post('/users/login', credentials).then((response) => {
    // Salva o token e os dados do login assim que a resposta chega
    const { token, userId, username } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    return response;
  });
};

// Registro
export const registerUser = (userData) => {
  return apiClient.post('/users/register', userData);
};

// Busca perfil do usuário logado
export const getUser = (id) => {
  return apiClient.get(`/users/${id}`);
};

// Atualiza o perfil do usuário logado
export const updateUser = (id, userData) => {
  return apiClient.put(`/users/${id}`, userData);
};

// Diário: agora fica dentro de /users/{id}/logs, não mais /dailylogs/
export const getAtividades = (userId) => {
  return apiClient.get(`/users/${userId}/logs`);
};

export const addAtividade = (userId, logData) => {
  return apiClient.post(`/users/${userId}/logs`, logData);
};

// Bibliotecas (exercícios e alimentos) — endpoints novos do Java
export const getMuscleGroups = () => {
  return apiClient.get('/workout/groups');
};

export const getExercises = () => {
  return apiClient.get('/workout/exercises');
};

export const getFoodCategories = () => {
  return apiClient.get('/diet/categories');
};

export const getFoods = () => {
  return apiClient.get('/diet/foods');
};

export const getDiaryLogs = (userId, date) => apiClient.get(`/logs/user/${userId}?date=${date}`);
export const addDiaryLog = (logData) => apiClient.post('/logs', logData);
export const deleteDiaryLog = (logId) => apiClient.delete(`/logs/${logId}`);