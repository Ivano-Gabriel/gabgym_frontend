import React from 'react';
import { render, screen } from '@testing-library/react';
import TrainingTodayPage from './TrainingTodayPage';
import { getCurrentUser, getDiaryLogs } from '../services/apiService';

jest.mock('react-router-dom', () => ({
  Link: ({to,children,...props}) => require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../services/apiService', () => ({
  getCurrentUser: jest.fn(), getDiaryLogs: jest.fn()
}));
beforeEach(()=>{
  jest.clearAllMocks();
  getCurrentUser.mockResolvedValue({data:{id:17,name:'Pessoa'}});
  getDiaryLogs.mockResolvedValue({data:[
    {id:1,type:'food',calories:2000},
    {id:2,type:'cardio',name:'Corrida',calories:300,distanceKm:2.5,durationSeconds:1800},
    {id:3,type:'exercise',name:'Treino A',calories:90,durationSeconds:1200}
  ]});
});
test('central treino/cardio mostra movimento real separado de alimentacao',async()=>{
  render(<TrainingTodayPage/>);
  expect(await screen.findByRole('heading',{name:/TREINO \+ CARDIO/i})).toBeInTheDocument();
  expect(await screen.findByText(/390/)).toBeInTheDocument();
  expect(screen.getByText((_,node)=>node?.tagName==='STRONG' && node.textContent?.includes('2,5 km'))).toBeInTheDocument();
  expect(screen.queryByText(/2\.000 kcal/)).not.toBeInTheDocument();
  expect(screen.getByRole('link',{name:/começar cardio/i})).toHaveAttribute('href','/cardio/select');
  expect(screen.getByRole('link',{name:/montar rotina/i})).toHaveAttribute('href','/routine-generator');
  expect(screen.getByRole('link',{name:/biblioteca/i})).toHaveAttribute('href','/exercise-library');
});
test('sem movimentos não inventa calorias gastas', async()=>{
  getDiaryLogs.mockResolvedValueOnce({data:[]});
  render(<TrainingTodayPage/>);
  expect(await screen.findByText(/Nenhuma atividade registrada hoje/i)).toBeInTheDocument();
});
