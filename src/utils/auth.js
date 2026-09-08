// src/utils/auth.js
// Um lugar só pra decidir "esse usuário já tem conta/perfil ou não"
// Usado em todo botão que hoje manda hardcoded pra /profile-form

export const isLoggedIn = () => {
  return !!localStorage.getItem('authToken');
};