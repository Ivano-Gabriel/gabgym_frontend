import React from 'react';
import { render, screen } from '@testing-library/react';
import TrainingTodayPage from './TrainingTodayPage';
import i18n from '../i18n';
let mockMode='normal';
jest.mock('../context/ExperienceContext',()=>({useExperience:()=>({settings:{mode:mockMode}})}));
import { getCurrentUser, getDiaryLogs, addDiaryLog } from '../services/apiService';

jest.mock('react-router-dom', () => ({
  Link: ({to,children,...props}) => require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../services/apiService', () => ({
  getCurrentUser: jest.fn(), getDiaryLogs: jest.fn(), addDiaryLog: jest.fn()
}));
beforeEach(()=>{
  jest.clearAllMocks();
  getCurrentUser.mockResolvedValue({data:{id:17,name:'Pessoa',weight:80}});
  addDiaryLog.mockResolvedValue({data:{id:4}});
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

test('registrar musculação envia exercise ao backend, sem contar alimentação',async()=>{
  const {fireEvent,waitFor}=require('@testing-library/react');
  render(<TrainingTodayPage/>);
  const register=await screen.findByRole('button',{name:/registrar treino feito/i});
 await waitFor(()=>expect(register).toBeEnabled());
 fireEvent.click(register);
  fireEvent.change(screen.getByLabelText(/Tipo de treino/i),{target:{value:'Costas e bíceps'}});
  fireEvent.change(screen.getByLabelText(/Minutos de treino/i),{target:{value:'45'}});
  fireEvent.change(screen.getByLabelText(/Gasto estimado em kcal/i),{target:{value:'180'}});
  fireEvent.click(screen.getByRole('button',{name:/salvar treino/i}));
  await waitFor(()=>expect(addDiaryLog).toHaveBeenCalled());
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({type:'exercise',calories:180,name:expect.stringContaining('Costas e bíceps')}));
});

test('adiciona supino com séries sem inventar calorias',async()=>{
 const {fireEvent,waitFor}=require('@testing-library/react');
 render(<TrainingTodayPage/>);
 const register=await screen.findByRole('button',{name:/registrar treino feito/i});
 await waitFor(()=>expect(register).toBeEnabled());
 fireEvent.click(register);
 fireEvent.change(screen.getByLabelText(/^Exercício/i),{target:{value:'Supino unilateral'}});
 fireEvent.change(screen.getByLabelText(/^Séries/i),{target:{value:'3'}});
 fireEvent.change(screen.getByLabelText(/^Repetições/i),{target:{value:'10'}});
 fireEvent.click(screen.getByRole('button',{name:/salvar treino/i}));
 await waitFor(()=>expect(addDiaryLog).toHaveBeenCalled());
 const entry=addDiaryLog.mock.calls[0][0];
 expect(entry.name).toContain('Supino unilateral');
 expect(entry.name).toContain('3x10');
 expect(entry.calories).toBe(0);
});

test('simple training offers only the essentials and preserves the real save flow',async()=>{
 mockMode='simple';
 try{
  const {fireEvent,waitFor}=require('@testing-library/react');
  render(<TrainingTodayPage/>);
  expect(await screen.findByText(/1 treino\(s\) registrado/)).toBeInTheDocument();
  expect(screen.queryByRole('link',{name:/montar rotina/i})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/registrar treino feito/i}));
  expect(screen.queryByLabelText(/Gasto estimado em kcal/i)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/salvar treino/i}));
  await waitFor(()=>expect(addDiaryLog).toHaveBeenCalledWith(expect.objectContaining({type:'exercise',calories:0})));
 }finally{mockMode='normal';}
});

test('Spanish training displays localized options without changing stored workout name',async()=>{
 try{
  await i18n.changeLanguage('es');
  const {fireEvent,waitFor}=require('@testing-library/react');
  render(<TrainingTodayPage/>);
  const register=await screen.findByRole('button',{name:'Registrar entrenamiento realizado'});
 await waitFor(()=>expect(register).toBeEnabled());
 fireEvent.click(register);
  fireEvent.change(screen.getByLabelText('Tipo de entrenamiento'),{target:{value:'Pernas'}});
  expect(screen.getByRole('option',{name:'Piernas'}).selected).toBe(true);
  fireEvent.click(screen.getByRole('button',{name:/GUARDAR ENTRENAMIENTO/i}));
  await waitFor(()=>expect(addDiaryLog).toHaveBeenCalledWith(expect.objectContaining({type:'exercise',name:expect.stringContaining('Pernas')})));
 }finally{await i18n.changeLanguage('pt');}
});

test('failed movement sync hides misleading progress and supports retry',async()=>{
 getDiaryLogs.mockRejectedValueOnce(new Error('network'));
 const {fireEvent}=require('@testing-library/react');
 render(<TrainingTodayPage/>);
 expect(await screen.findByRole('alert')).toHaveTextContent(/histórico continua salvo/i);
 expect(screen.queryByRole('progressbar',{name:'Treino realizado hoje'})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:/tentar novamente/i}));
 expect(await screen.findByRole('progressbar',{name:'Treino realizado hoje'})).toBeInTheDocument();
});
