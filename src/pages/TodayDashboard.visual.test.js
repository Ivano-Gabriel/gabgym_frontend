import React from 'react';
import {render, screen} from '@testing-library/react';
import {readFileSync} from 'fs';
import {join} from 'path';
import TodayDashboard from './TodayDashboard';
import {getCurrentUser,getDiaryLogs,getMetas} from '../services/apiService';

jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useLocation:()=>({pathname:'/'})
}));
jest.mock('../components/StreakCalendar',()=>()=>null);
jest.mock('../services/apiService',()=>({
  getCurrentUser:jest.fn(),
  getDiaryLogs:jest.fn(),
  getMetas:jest.fn()
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
