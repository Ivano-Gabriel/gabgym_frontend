import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { getCurrentUser, getDiaryLogs, getMetas, warmUpApi } from '../services/apiService';

jest.mock('react-router-dom', () => ({
  Link: ({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useLocation:()=>({pathname:'/'})
}));
jest.mock('../utils/auth', () => ({ isLoggedIn: () => true, isSuperAdmin: () => false }));
jest.mock('../services/apiService', () => ({
  getCurrentUser: jest.fn(), getDiaryLogs: jest.fn(), getMetas: jest.fn(), warmUpApi: jest.fn()
}));
beforeEach(() => {
  jest.clearAllMocks();
  getCurrentUser.mockResolvedValue({data:{id:17, name:'Pessoa', weight:80, height:180}});
  getDiaryLogs.mockResolvedValue({data:[{id:1,type:'food',calories:540},{id:2,type:'water',volume:500}]});
  getMetas.mockResolvedValue({data:[]});
});
test('Hoje é painel pessoal, não a landing antiga, e usa registros reais', async () => {
  render(<HomePage />);
  expect(await screen.findByRole('heading', {name:/seu dia/i})).toBeInTheDocument();
  expect(await screen.findByText((_, node) => node?.tagName === 'STRONG' && node.textContent?.includes('540 kcal'))).toBeInTheDocument();
  expect(screen.getByText((_, node) => node?.tagName === 'STRONG' && node.textContent?.includes('500 ml'))).toBeInTheDocument();
  expect(screen.getByText((_, node) => node?.tagName === 'STRONG' && node.textContent?.includes('80 kg'))).toBeInTheDocument();
  expect(screen.queryByText(/O SEGREDO/)).not.toBeInTheDocument();
  expect(screen.getByRole('link', {name:/alimentação/i})).toHaveAttribute('href','/alimentacao');
});
