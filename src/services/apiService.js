// src/services/apiService.js - VERSÃO FINAL COM AUTENTICAÇÃO
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- O INTERCEPTADOR QUE ANEXA O "CRACHÁ" ---
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do cofre do navegador (localStorage)
    const token = localStorage.getItem('authToken');

    // Se o token existir, anexa ele no cabeçalho da requisição
    if (token) {
      // A biblioteca dj-rest-auth espera o formato "Token [sua_key]"
      config.headers.Authorization = `Token ${token}`;
    }

    return config; // Envia a requisição, agora com o crachá
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ------------------------------------

// O resto das nossas funções
export const loginUser = (credentials) => {
  return apiClient.post('/auth/login/', credentials);
};

export const getAtividades = () => {
  return apiClient.get('/dailylogs/');
};