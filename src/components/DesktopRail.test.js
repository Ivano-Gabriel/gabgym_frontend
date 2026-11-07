import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopRail from './DesktopRail';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  NavLink: ({ to, children, className, end, ...rest }) => {
    const name = typeof className === 'function' ? className({isActive:to==='/'}) : className;
    return require('react').createElement('a', {href:to,className:name,...rest},children);
  }
}));
test('rail desktop inicia recolhida e abre atalhos com clique na seta GG', () => {
  render(<DesktopRail />);
  const toggle=screen.getByRole('button',{name:'Expandir barra lateral'});
  expect(toggle).toHaveAttribute('aria-expanded','false');
  fireEvent.click(toggle);
  expect(screen.getByRole('button',{name:'Recolher barra lateral'})).toHaveAttribute('aria-expanded','true');
  expect(screen.getByRole('navigation',{name:'Acessos rápidos'})).toHaveAttribute('aria-hidden','false');
  expect(screen.getByRole('link',{name:'Comer'})).toHaveAttribute('href','/alimentacao');
  expect(screen.getByRole('link',{name:'Metas'})).toHaveAttribute('href','/minhas-metas');
  fireEvent.click(screen.getByRole('link',{name:'Treino'}));
  expect(screen.getByRole('button',{name:'Expandir barra lateral'})).toHaveAttribute('aria-expanded','false');
});
test('rail fecha com Escape sem afetar links da página', () => {
  render(<DesktopRail />);
  fireEvent.click(screen.getByRole('button',{name:'Expandir barra lateral'}));
  fireEvent.keyDown(document,{key:'Escape'});
  expect(screen.getByRole('button',{name:'Expandir barra lateral'})).toBeInTheDocument();
});
