/** Estado de interface, nunca é fonte de autorização: o backend sempre valida o JWT. */
export const isLoggedIn = () => Boolean(sessionStorage.getItem('authToken'));

export const isSuperAdmin = () =>
  isLoggedIn() && sessionStorage.getItem('role') === 'SUPER_ADMIN';

export const clearAuthSession = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('role');
  localStorage.removeItem('authToken'); // limpeza de tokens legados
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
};
