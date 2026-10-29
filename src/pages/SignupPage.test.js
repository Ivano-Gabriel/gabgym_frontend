import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from './SignupPage';

jest.mock('../services/apiService', () => ({
  registerUser: jest.fn(),
}));

test('o pattern de usuario compila no modo Unicode v dos navegadores modernos', () => {
  render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>
  );

  const field = screen.getByRole('textbox', { name: /nome de usuário/i });
  // HTML pattern usa RegExp com a flag 'v'. Hífen literal deve ser escapado.
  const pattern = new RegExp(`^(?:${field.pattern})$`, 'v');
  expect(pattern.test('alecrin')).toBe(true);
  expect(pattern.test('gabgym.admin')).toBe(true);
  expect(pattern.test('aluno_123')).toBe(true);
  expect(pattern.test('aluno-123')).toBe(true);
  expect(pattern.test('x')).toBe(false);
  expect(pattern.test('invalido@site')).toBe(false);
});
