import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DailyNavigation from './DailyNavigation';

jest.mock('react-router-dom', () => ({
  Link: ({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  NavLink: ({to,children,className,...props})=>require('react').createElement('a',{href:to,className:typeof className==='function'?className({isActive:to==='/'}):className,...props},children),
  useLocation:()=>({pathname:'/'})
}));
jest.mock('../utils/auth', () => ({ isSuperAdmin: () => false }));

test('menu mobile tem acesso direto a hoje, comer, hub, treino e perfil', () => {
  render(<DailyNavigation />);
  expect(screen.getByRole('link', { name: /hoje/i })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: /comer/i })).toHaveAttribute('href', '/alimentacao');
  expect(screen.getByRole('link', { name: /treino/i })).toHaveAttribute('href', '/treino');
  expect(screen.getByRole('button', { name: /abrir hub/i })).toHaveAttribute('aria-expanded','false');
  fireEvent.click(screen.getByRole('button', { name: /abrir hub/i }));
  expect(screen.getByRole('dialog', { name: /hub gabgym/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /cardio/i })).toHaveAttribute('href','/cardio/select');
  expect(screen.getByRole('link', { name: /metas/i })).toHaveAttribute('href','/minhas-metas');
  fireEvent.click(screen.getByRole('button', { name: /fechar hub/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
