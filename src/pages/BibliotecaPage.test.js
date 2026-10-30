import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import BibliotecaPage from './BibliotecaPage';

jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useLocation:()=>({hash:''})
}));
jest.mock('react-i18next',()=>({useTranslation:()=>({t:key=>key})}));

test('biblioteca abre sem IntersectionObserver e permite alternar categorias',()=>{
  const old=global.IntersectionObserver;
  delete global.IntersectionObserver;
  try{
    render(<BibliotecaPage/>);
    expect(screen.getByRole('heading',{name:/biblioteca.titulo/i})).toBeInTheDocument();
    const btn=screen.getByRole('button',{name:/biblioteca.aba_treinamento/i});
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed','true');
  }finally{global.IntersectionObserver=old;}
});