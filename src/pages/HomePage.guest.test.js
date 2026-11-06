import React from 'react';
import {render,screen} from '@testing-library/react';
import HomePage from './HomePage';
import {warmUpApi} from '../services/apiService';

jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../utils/auth',()=>({isLoggedIn:()=>false}));
jest.mock('../services/apiService',()=>({warmUpApi:jest.fn()}));

test('visitante vê landing premium com foto real responsiva e sem métricas inventadas',()=>{
  render(<HomePage />);
  const title=screen.getByRole('heading',{level:1});
  expect(title).toHaveAttribute('id','gg-home-title');
  expect(title.textContent).toMatch(/disciplina|constância/i);
  const hero=screen.getByRole('img',{name:/atleta.*treino/i});
  expect(hero.getAttribute('src')).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
  expect(hero.getAttribute('srcset')).toContain('w=3840');
  expect(hero).toHaveAttribute('sizes');
  expect(screen.getByRole('link',{name:/começar agora/i})).toHaveAttribute('href','/signup');
  expect(screen.getByRole('link',{name:/entrar na conta/i})).toHaveAttribute('href','/login');
  expect(screen.getByRole('link',{name:/conhecer recursos/i})).toHaveAttribute('href','#recursos');
  expect(screen.getByRole('region',{name:/recursos/i})).toBeInTheDocument();
  expect(screen.getByText(/prateek saxena/i)).toBeInTheDocument();
  expect(screen.queryByText(/mil usuários/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/avaliação 4/i)).not.toBeInTheDocument();
  expect(warmUpApi).toHaveBeenCalledTimes(1);
});
