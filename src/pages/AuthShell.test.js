import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthShell from './AuthShell';

// O projeto usa React Router 7 com CRA/Jest; mock de links para isolar a interface.
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
}));

test('identidade GABGYM exibe treino e nutricao sem fotos nem grafismos legados', () => {
  const { container } = render(
    <AuthShell type="login" title="VOLTE MAIS FORTE."
      subtitle="Continue sua evolução." footer={<>Primeiro acesso?</>}>
      <form><input aria-label="Usuário" /></form>
    </AuthShell>
  );

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/mais quetreino\.progresso\./i);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('VOLTE MAIS FORTE.');
  expect(screen.getByText('TREINAR')).toBeInTheDocument();
  expect(screen.getByText('ALIMENTAR')).toBeInTheDocument();
  expect(screen.getByText('EVOLUIR')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /criar conta/i })).toHaveAttribute('href', '/signup');
  expect(container.querySelectorAll('img')).toHaveLength(1);
  expect(container.querySelector('img')).toHaveAttribute('src', '/gg-mark.svg');
  expect(container.querySelector('.gg-auth-visual-circle')).toBeNull();
});

test('cadastro mostra contexto e link de login sem mudar fluxo de autenticacao', () => {
  render(
    <AuthShell type="signup" title="COMECE FORTE." subtitle="Seu ponto de partida."
      footer={<>Já tem uma conta?</>}>
      <form><input aria-label="Nome de usuário" /></form>
    </AuthShell>
  );
  expect(screen.getByText('PRIMEIRO PASSO')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /já tenho conta/i })).toHaveAttribute('href', '/login');
  expect(screen.getByRole('textbox', { name: /nome de usuário/i })).toBeInTheDocument();
});
