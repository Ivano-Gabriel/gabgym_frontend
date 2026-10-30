import React from 'react';
import { render,screen,fireEvent,waitFor } from '@testing-library/react';
import HistoryPage from './HistoryPage';
import { getCurrentUser,getDiaryLogs } from '../services/apiService';

jest.mock('react-router-dom',()=>({
 Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../services/apiService',()=>({getCurrentUser:jest.fn(),getDiaryLogs:jest.fn()}));
beforeEach(()=>{
 jest.clearAllMocks();
 getCurrentUser.mockResolvedValue({data:{id:17,name:'Pessoa'}});
 getDiaryLogs.mockImplementation((id,date)=>Promise.resolve({data:date==='2026-10-30'?[{id:3,type:'food',name:'Cuscuz',calories:280},{id:4,type:'water',volume:500}]:[]}));
});
test('histórico mostra uma semana de dados reais do usuário autenticado',async()=>{
 jest.useFakeTimers().setSystemTime(new Date(2026,9,30,12,0));
 try {
  render(<HistoryPage/>);
  expect(await screen.findByRole('heading',{name:/HISTÓRICO/i})).toBeInTheDocument();
  await waitFor(()=>expect(getDiaryLogs).toHaveBeenCalledTimes(7));
  expect(getDiaryLogs).toHaveBeenCalledWith(17,'2026-10-30');
  expect(await screen.findByText(/280 kcal/)).toBeInTheDocument();
  expect(screen.getByText(/500 ml/)).toBeInTheDocument();
  expect(screen.queryByText(/O SEGREDO É CONTINUAR/)).not.toBeInTheDocument();
 } finally { jest.useRealTimers(); }
});
test('falha parcial de uma data não a apresenta como dia sem registros',async()=>{
 getDiaryLogs.mockRejectedValue(new Error('offline'));
 render(<HistoryPage/>);
 expect(await screen.findAllByText(/Não foi possível carregar/i)).not.toHaveLength(0);
});