import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from './SignupPage';

// CRA/Jest do projeto nao resolve react-router/dom (router v7).
// Neste teste, somente os links e a navegacao sao substituidos.
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
  useNavigate: () => jest.fn(),
}));

jest.mock('../services/apiService', () => ({
  registerUser: jest.fn(),
}));

test('o pattern de usuario compila no modo Unicode v dos navegadores modernos', () => {
  render(<SignupPage />);
  const field = screen.getByRole('textbox', { name: /nome de usuário/i });

  // O atributo HTML pattern é compilado com flag "v" nos navegadores modernos.
  const validator = new RegExp(`^(?:${field.pattern})$`, 'v');
  expect(validator.test('alecrin')).toBe(true);
  expect(validator.test('gabgym.admin')).toBe(true);
  expect(validator.test('aluno_123')).toBe(true);
  expect(validator.test('aluno-123')).toBe(true);
  expect(validator.test('x')).toBe(false);
  expect(validator.test('invalido@site')).toBe(false);
});
