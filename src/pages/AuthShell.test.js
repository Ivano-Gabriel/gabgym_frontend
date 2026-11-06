import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthShell from './AuthShell';

// O projeto usa React Router 7 com CRA/Jest; mock de links para isolar a interface.
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
}));

test('identidade Premium mostra fotografia real sem alterar os links de acesso', () => {
  const { container } = render(
    <AuthShell type="login" title="VOLTE MAIS FORTE."
      subtitle="Continue sua evolução." footer={<>Primeiro acesso?</>}>
      <form><input aria-label="Usuário" /></form>
    </AuthShell>
  );

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/continue\.mais forte\./i);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('VOLTE MAIS FORTE.');
  expect(screen.getByText('O PROGRESSO É SEU.')).toBeInTheDocument();
  expect(screen.queryByText(/Planeje seus treinos/i)).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /criar conta/i })).toHaveAttribute('href', '/signup');
  expect(container.querySelectorAll('img')).toHaveLength(2);
  expect(container.querySelector('img.gg-auth-brand-symbol')).toHaveAttribute('src', '/gg-mark.svg');
  expect(screen.getByRole('img',{name:/atleta treinando com barra/i})).toHaveAttribute('sizes');
  expect(screen.getByText(/SUSHIL GHIMIRE \/ UNSPLASH/i)).toBeInTheDocument();
  expect(container.querySelector('.gg-auth-visual-circle')).toBeNull();
  expect(screen.getByRole('link',{name:/gabgym, ir para o início/i})).toHaveAttribute('href','/');
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
