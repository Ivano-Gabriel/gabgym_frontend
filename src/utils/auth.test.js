import { isLoggedIn, isSuperAdmin, clearAuthSession } from './auth';

afterEach(() => {
  sessionStorage.clear();
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
});

test('login só depende do token desta sessão e não de token antigo no localStorage', () => {
  localStorage.setItem('authToken', 'legado');
  expect(isLoggedIn()).toBe(false);
  sessionStorage.setItem('authToken', 'novo-token');
  expect(isLoggedIn()).toBe(true);
});

test('superadmin exige sessão ativa e role explícita', () => {
  sessionStorage.setItem('role', 'SUPER_ADMIN');
  expect(isSuperAdmin()).toBe(false);
  sessionStorage.setItem('authToken', 'token');
  expect(isSuperAdmin()).toBe(true);
});

test('logout remove credenciais sem apagar dados não relacionados ao app', () => {
  localStorage.setItem('gabgymTodaysSleep', 'dados-locais');
  sessionStorage.setItem('authToken', 'token');
  sessionStorage.setItem('role', 'SUPER_ADMIN');
  localStorage.setItem('userId', '123');
  clearAuthSession();
  expect(sessionStorage.getItem('authToken')).toBeNull();
  expect(sessionStorage.getItem('role')).toBeNull();
  expect(localStorage.getItem('userId')).toBeNull();
  expect(localStorage.getItem('gabgymTodaysSleep')).toBe('dados-locais');
  localStorage.removeItem('gabgymTodaysSleep');
});
