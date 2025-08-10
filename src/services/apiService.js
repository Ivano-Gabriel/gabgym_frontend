// src/services/apiService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // O endereço do nosso futuro backend
  headers: {
    'Content-Type': 'application/json',
  }
});

// Função para buscar o histórico de atividades
export const getAtividades = () => {
  return apiClient.get('/atividades/');
};

// Função UNIVERSAL para criar uma nova atividade
export const createAtividade = (dadosDaAtividade) => {
  return apiClient.post('/atividades/', dadosDaAtividade);
};