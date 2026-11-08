import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import {readFileSync} from 'fs';
import {join} from 'path';
import TodayDashboard from './TodayDashboard';
import {getCurrentUser,getDiaryLogs,getMetas,addDiaryLog} from '../services/apiService';

jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useLocation:()=>({pathname:'/'})
}));
jest.mock('../components/StreakCalendar',()=>()=>null);
jest.mock('../services/apiService',()=>({
  getCurrentUser:jest.fn(),
  getDiaryLogs:jest.fn(),
  getMetas:jest.fn(),
  addDiaryLog:jest.fn()
}));

beforeEach(()=>{
  jest.clearAllMocks();
  localStorage.clear();
  getCurrentUser.mockResolvedValue({data:{
    id:17,name:'Usuário teste',age:24,height:180,weight:80,
    gender:'male',activityLevel:'light',objective:'maintain-weight'
  }});
  getDiaryLogs.mockResolvedValue({data:[
    {id:1,type:'food',calories:800},
    {id:2,type:'water',volume:1000}
  ]});
  getMetas.mockResolvedValue({data:[]});
  addDiaryLog.mockResolvedValue({data:{id:99}});
});

test('Hoje distingue alimentação e água com estilos semânticos, mantendo os valores reais',async()=>{
  render(<TodayDashboard/>);
  const food=await screen.findByRole('progressbar',{name:'Calorias diárias'});
  const water=screen.getByRole('progressbar',{name:'Água diária'});
  const foodCard=food.closest('.gg-today-progress-card');
  const waterCard=water.closest('.gg-today-progress-card');

  expect(foodCard).toHaveClass('gg-today-progress-card--food');
  expect(waterCard).toHaveClass('gg-today-progress-card--water');
  expect(foodCard).not.toHaveClass('gg-today-progress-card--water');
  expect(waterCard).not.toHaveClass('gg-today-progress-card--food');
  expect(food).toHaveAttribute('aria-valuenow','800');
  expect(water).toHaveAttribute('aria-valuenow','1000');
  expect(food.querySelector('span').style.width).toMatch(/%$/);
  expect(water.querySelector('span').style.width).toMatch(/%$/);
});

test('estilos da tela Hoje mantêm cartões neutros e barras específicas por métrica',()=>{
  const css=readFileSync(join(__dirname,'TodayDashboard.css'),'utf8');
  const cardRules=[...css.matchAll(/\.gg-today-progress-card\s*\{([^}]*)\}/g)];
  expect(cardRules.length).toBeGreaterThan(0);
  expect(cardRules.some(([, body])=>/background:\s*#(?:252525|262626|292929)/i.test(body))).toBe(true);
  expect(cardRules.every(([, body])=>!/background:\s*#b1111b/i.test(body))).toBe(true);
  expect(css).toMatch(/\.gg-today-progress-card--food\s*\{[^}]*--gg-today-metric:\s*#[a-f\d]{6}/i);
  expect(css).toMatch(/\.gg-today-progress-card--water\s*\{[^}]*--gg-today-metric:\s*#[a-f\d]{6}/i);
  expect(css).toMatch(/\.gg-today-track\s+span\s*\{[^}]*background:\s*var\(--gg-today-metric\)/i);
});

test('atalho secundário não é forçado a ficar vermelho pelas regras compartilhadas',()=>{
  const polish=readFileSync(join(__dirname,'../styles/interactionPolish.css'),'utf8');
  const metal=readFileSync(join(__dirname,'../styles/metalFinish.css'),'utf8');
  expect(polish).toMatch(/\.gg-today\s+\.gg-today-shortcuts\s+a:last-child\s*\{[^}]*background:\s*#(?:292929|303030)/i);
  expect(metal).not.toMatch(/\.gg-today-shortcuts\s+a/);
});


test('Hoje premium mantém dados reais, hero fotográfico e acesso ao treino',async()=>{
  render(<TodayDashboard />);
  await screen.findByRole('progressbar',{name:'Calorias diárias'});
  expect(screen.getByRole('img',{name:/equipamentos e pesos/i})).toHaveAttribute('sizes');
  expect(screen.getByRole('link',{name:/abrir meu treino/i})).toHaveAttribute('href','/treino');
  expect(screen.getByRole('heading',{name:/seu dia/i})).toBeInTheDocument();
  expect(screen.getByRole('region',{name:'Registros do dia'})).toBeInTheDocument();
  expect(screen.getByRole('region',{name:'Metas e ações'})).toBeInTheDocument();
  expect(screen.getByText((_,el)=>el?.tagName==='STRONG'&&el.textContent?.includes('800 kcal'))).toBeInTheDocument();
});

test('card de água e painel de metas têm fotos decorativas com dados intactos',async()=>{
  render(<TodayDashboard/>);
  const water=await screen.findByRole('progressbar',{name:'Água diária'});
  expect(water).toHaveAttribute('aria-valuenow','1000');
  const card=water.closest('.gg-today-progress-card--water');
  expect(card.querySelector('img.gg-premium-photo')).toHaveAttribute('alt','');
  const metas=screen.getByRole('region',{name:'Metas e ações'});
  expect(metas.querySelector('img.gg-premium-photo')).toHaveAttribute('loading','lazy');
  expect(screen.getByRole('link',{name:/sem metas/i})).toHaveAttribute('href','/minhas-metas');
});

test('Hoje registra +250 ml no contrato real e atualiza progresso sem recarregar a página', async () => {
  getDiaryLogs.mockResolvedValueOnce({data:[
    {id:1,type:'food',name:'Cuscuz',calories:800},{id:2,type:'water',volume:1000}
  ]}).mockResolvedValueOnce({data:[
    {id:1,type:'food',name:'Cuscuz',calories:800},{id:2,type:'water',volume:1000},
    {id:99,type:'water',name:'Água',volume:250}
  ]});
  render(<TodayDashboard/>);
  expect(await screen.findByText('Cuscuz')).toBeInTheDocument();
  const button=screen.getByRole('button',{name:'Registrar 250 mililitros de água'});
  fireEvent.click(button);
  await waitFor(()=>expect(addDiaryLog).toHaveBeenCalledTimes(1));
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({
    userId:17,type:'water',name:'Água',volume:250,calories:0,logDate:expect.any(String)
  }));
  await waitFor(()=>expect(screen.getByRole('progressbar',{name:'Água diária'})).toHaveAttribute('aria-valuenow','1250'));
  expect(screen.getByText(/250 ml registrados no diário/)).toBeInTheDocument();
});

test('duplo toque não duplica registro de água enquanto POST está pendente',async()=>{
  let finish;
  addDiaryLog.mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve;}));
  render(<TodayDashboard/>);
  const b=await screen.findByRole('button',{name:'Registrar 500 mililitros de água'});
  fireEvent.click(b);
  expect(b).toBeDisabled();
  fireEvent.click(b);
  expect(addDiaryLog).toHaveBeenCalledTimes(1);
  await act(async()=>{finish({data:{id:22}});});
  await screen.findByText(/500 ml registrados no diário/);
});

test('ao falhar a API, Hoje mostra tentar novamente e recupera sem recarregar o navegador',async()=>{
  getCurrentUser.mockRejectedValueOnce(new Error('Render dormindo'));
  render(<TodayDashboard/>);
  expect(await screen.findByRole('alert')).toHaveTextContent(/servidor pode estar iniciando/i);
  fireEvent.click(screen.getByRole('button',{name:/tentar novamente/i}));
  expect(await screen.findByRole('progressbar',{name:'Água diária'})).toBeInTheDocument();
  expect(getCurrentUser).toHaveBeenCalledTimes(2);
});

test('saudação não revela ID do perfil no lugar do nome',async()=>{
  getCurrentUser.mockResolvedValueOnce({data:{id:17,name:'157',username:'Gabriel',weight:80}});
  render(<TodayDashboard/>);
  expect(await screen.findByText('Continue, Gabriel.')).toBeInTheDocument();
  expect(screen.queryByText(/Continue, 157/)).not.toBeInTheDocument();
});

test('se POST conclui e GET falha, não informa erro falso e reflete a água na interface',async()=>{
  getDiaryLogs.mockResolvedValueOnce({data:[]}).mockRejectedValueOnce(new Error('GET offline'));
  render(<TodayDashboard/>);
  fireEvent.click(await screen.findByRole('button',{name:'Registrar 250 mililitros de água'}));
  expect(await screen.findByText(/250 ml registrados no diário/)).toBeInTheDocument();
  expect(screen.getByRole('progressbar',{name:'Água diária'})).toHaveAttribute('aria-valuenow','250');
});
