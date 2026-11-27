import React from 'react';
import { render, screen } from '@testing-library/react';
import DesktopRail from './DesktopRail';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  NavLink: ({ to, children, className, end, ...rest }) => {
    const name = typeof className === 'function' ? className({isActive:to==='/'}) : className;
    return require('react').createElement('a', {href:to,className:name,...rest},children);
  }
}));
test('desktop navigation is visible and usable without opening a menu',()=>{
 render(<DesktopRail/>);
 expect(screen.getByRole('navigation',{name:'Acessos rápidos'})).toBeInTheDocument();
 expect(screen.getByRole('link',{name:'Comer'})).toHaveAttribute('href','/alimentacao');
 expect(screen.getByRole('link',{name:'Treino'})).toHaveAttribute('href','/treino');
 expect(screen.getByRole('link',{name:'Metas'})).toHaveAttribute('href','/minhas-metas');
 expect(screen.queryByRole('button',{name:/expandir barra lateral/i})).not.toBeInTheDocument();
});
