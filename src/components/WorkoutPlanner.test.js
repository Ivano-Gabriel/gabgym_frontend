import React from 'react';
import {render,screen,fireEvent,waitFor,act} from '@testing-library/react';
import WorkoutPlanner from './WorkoutPlanner';
import {addDiaryLog} from '../services/apiService';

jest.mock('../services/apiService',()=>({addDiaryLog:jest.fn()}));
beforeEach(()=>{jest.clearAllMocks();localStorage.clear();addDiaryLog.mockResolvedValue({data:{id:99}});});

const addSupino=()=>{
  fireEvent.change(screen.getByLabelText('Adicionar exercício'),{target:{value:'Supino reto'}});
  fireEvent.click(screen.getByRole('button',{name:/ADICIONAR/i}));
  expect(screen.getByText('Supino reto')).toBeInTheDocument();
};

test('treino exige pelo menos uma série concluída e nunca envia calorias inventadas',async()=>{
  render(<WorkoutPlanner userId={17}/>);
  addSupino();
  expect(screen.getByRole('button',{name:/FINALIZAR TREINO/i})).toBeDisabled();
  fireEvent.change(screen.getByRole('spinbutton',{name:'Repetições série 1 de Supino reto'}),{target:{value:'12'}});
  fireEvent.change(screen.getByRole('spinbutton',{name:'Carga série 1 de Supino reto'}),{target:{value:'40'}});
  fireEvent.click(screen.getByRole('button',{name:'Concluir série 1 de Supino reto'}));
  expect(screen.getByRole('progressbar',{name:'Séries concluídas da ficha'})).toHaveAttribute('aria-valuenow','100');
  expect(screen.getByText('480 kg')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'FINALIZAR TREINO'}));
  await waitFor(()=>expect(addDiaryLog).toHaveBeenCalledTimes(1));
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({
    userId:17,type:'exercise',calories:0,name:expect.stringContaining('1 séries')
  }));
  expect(await screen.findByRole('button',{name:'TREINO REGISTRADO'})).toBeDisabled();
  expect(screen.getByText(/séries e cargas guardadas neste navegador/i)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('gabgym:workout-sessions:17'))).toHaveLength(1);
});

test('salvar e reutilizar ficha preserva carga e reseta séries concluídas',()=>{
  render(<WorkoutPlanner userId={17}/>);
  addSupino();
  fireEvent.change(screen.getByRole('spinbutton',{name:'Carga série 1 de Supino reto'}),{target:{value:'55'}});
  fireEvent.click(screen.getByRole('button',{name:'Concluir série 1 de Supino reto'}));
  fireEvent.click(screen.getByRole('button',{name:'SALVAR FICHA'}));
  expect(screen.getByText(/Ficha salva neste navegador/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Carregar ficha Treino do dia'}));
  expect(screen.getByRole('spinbutton',{name:'Carga série 1 de Supino reto'})).toHaveValue(55);
  expect(screen.getByRole('button',{name:'Concluir série 1 de Supino reto'})).toHaveAttribute('aria-pressed','false');
  expect(localStorage.getItem('gabgym:workout-plans:18')).toBeNull();
});

test('falha da API não gera falso histórico local',async()=>{
  addDiaryLog.mockRejectedValueOnce(new Error('offline'));
  render(<WorkoutPlanner userId={17}/>);
  addSupino();
  fireEvent.click(screen.getByRole('button',{name:'Concluir série 1 de Supino reto'}));
  fireEvent.click(screen.getByRole('button',{name:'FINALIZAR TREINO'}));
  expect(await screen.findByText(/Não foi possível confirmar o registro/i)).toBeInTheDocument();
  expect(localStorage.getItem('gabgym:workout-sessions:17')).toBeNull();
});

test('toque repetido durante POST pendente não duplica treinos',async()=>{
  let resolvePost;
  addDiaryLog.mockImplementationOnce(()=>new Promise(resolve=>{resolvePost=resolve;}));
  render(<WorkoutPlanner userId={17}/>);
  addSupino();
  fireEvent.click(screen.getByRole('button',{name:'Concluir série 1 de Supino reto'}));
  const button=screen.getByRole('button',{name:'FINALIZAR TREINO'});
  fireEvent.click(button);
  expect(screen.getByRole('button',{name:'SALVANDO…'})).toBeDisabled();
  expect(addDiaryLog).toHaveBeenCalledTimes(1);
  await act(async()=>{resolvePost({data:{id:1}});});
  expect(screen.getByRole('button',{name:'TREINO REGISTRADO'})).toBeDisabled();
});

test('biblioteca de exercícios oferece busca por grupo e adiciona supino em um toque',()=>{
 render(<WorkoutPlanner userId={17}/>);
 fireEvent.change(screen.getByLabelText('Grupo muscular'),{target:{value:'peito'}});
 fireEvent.change(screen.getByLabelText('Adicionar exercício'),{target:{value:'supino reto com barra'}});
 const button=screen.getByRole('button',{name:/Supino reto com barra/i});
 fireEvent.click(button);
 expect(screen.getByRole('heading',{name:'Supino reto com barra'})).toBeInTheDocument();
 expect(screen.getByRole('button',{name:'Concluir série 1 de Supino reto com barra'})).toBeInTheDocument();
});
test('descanso automático só inicia após marcar uma série quando ativado',()=>{
 render(<WorkoutPlanner userId={17}/>);
 addSupino();
 fireEvent.click(screen.getByLabelText('AUTO DESCANSO'));
 fireEvent.click(screen.getByRole('button',{name:'Concluir série 1 de Supino reto'}));
 expect(screen.getByText('90 s')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'PARAR'}));
 expect(screen.getByText('DESCANSO')).toBeInTheDocument();
});
