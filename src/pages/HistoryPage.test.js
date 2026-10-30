import React from 'react';
import { render,screen,waitFor } from '@testing-library/react';
import HistoryPage from './HistoryPage';
import { dayKey } from '../utils/nutrition';
import { getCurrentUser,getDiaryLogs } from '../services/apiService';

jest.mock('react-router-dom',()=>({
 Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../services/apiService',()=>({getCurrentUser:jest.fn(),getDiaryLogs:jest.fn()}));
beforeEach(()=>{
 jest.clearAllMocks();
 getCurrentUser.mockResolvedValue({data:{id:17,name:'Pessoa'}});
 getDiaryLogs.mockImplementation((id,date)=>Promise.resolve({data:date===dayKey()?[{id:3,type:'food',name:'Cuscuz',calories:280},{id:4,type:'water',volume:500}]:[]}));
});
test('histórico mostra uma semana de dados reais do usuário autenticado',async()=>{
  render(<HistoryPage/>);
  expect(await screen.findByRole('heading',{name:/HISTÓRICO/i})).toBeInTheDocument();
  await waitFor(()=>expect(getDiaryLogs).toHaveBeenCalledTimes(7));
  expect(getDiaryLogs).toHaveBeenCalledWith(17,dayKey());
  expect(await screen.findAllByText(/280 kcal/)).not.toHaveLength(0);
  expect(screen.getAllByText(/500 ml/)).not.toHaveLength(0);
  expect(screen.queryByText(/O SEGREDO É CONTINUAR/)).not.toBeInTheDocument();
});
test('falha parcial de uma data não a apresenta como dia sem registros',async()=>{
 getDiaryLogs.mockRejectedValue(new Error('offline'));
 render(<HistoryPage/>);
 expect(await screen.findAllByText(/Não foi possível carregar/i)).not.toHaveLength(0);
});