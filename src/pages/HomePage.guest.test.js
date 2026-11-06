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
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(screen.getByRole('heading',{name:/execução acima de desculpas/i})).toBeInTheDocument();
  expect(screen.getByRole('heading',{name:/rotina sem adivinhação/i})).toBeInTheDocument();
  expect(screen.getByRole('heading',{name:/progresso que você vê/i})).toBeInTheDocument();
  expect(screen.getByRole('img',{name:/academia real com bancos/i})).toHaveAttribute('loading','lazy');
  expect(screen.getByRole('img',{name:/mulher levantando barra/i})).toHaveAttribute('loading','lazy');
  expect(screen.queryByText(/Treine com direção/i)).not.toBeInTheDocument();

  expect(screen.queryByText(/mil usuários/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/avaliação 4/i)).not.toBeInTheDocument();
  expect(warmUpApi).toHaveBeenCalledTimes(1);
});

test('a direção editorial mantém três histórias sem cards repetitivos e fotos carregadas sob demanda', () => {
  render(<HomePage />);
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(screen.getByRole('heading',{name:/execução acima de desculpas/i})).toBeInTheDocument();
  expect(screen.getByRole('heading',{name:/rotina sem adivinhação/i})).toBeInTheDocument();
  expect(screen.getByRole('img',{name:/academia real com bancos/i})).toHaveAttribute('loading','lazy');
  expect(screen.getByRole('img',{name:/mulher levantando barra/i})).toHaveAttribute('loading','lazy');
});
