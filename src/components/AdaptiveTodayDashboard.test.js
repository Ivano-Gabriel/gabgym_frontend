import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import AdaptiveTodayDashboard from './AdaptiveTodayDashboard';
import {getCurrentUser,getDiaryLogs,addDiaryLog} from '../services/apiService';
let mockExperience={settings:{mode:'simple',food:true,workout:false,weight:false,coach:false},ready:true};
jest.mock('../context/ExperienceContext',()=>({useExperience:()=>mockExperience}));
jest.mock('react-router-dom',()=>({
  Link:({to,children,...rest})=>require('react').createElement('a',{href:to,...rest},children)
}));
jest.mock('../services/apiService',()=>({
  getCurrentUser:jest.fn(),getDiaryLogs:jest.fn(),addDiaryLog:jest.fn()
}));
jest.mock('../pages/TodayDashboard',()=>()=>require('react').createElement('div',{},'Hoje normal'));
beforeEach(()=>{
 jest.clearAllMocks();
 mockExperience={settings:{mode:'simple',food:true,workout:false,weight:false,coach:false},ready:true};
 getCurrentUser.mockResolvedValue({data:{id:17,name:'Ana'}});
 getDiaryLogs.mockResolvedValue({data:[{type:'food',calories:400},{type:'water',volume:1000}]});
 addDiaryLog.mockResolvedValue({data:{id:12}});
});
test('modo simples mostra só área escolhida e números reais',async()=>{
 render(<AdaptiveTodayDashboard/>);
 expect(await screen.findByText('400 kcal')).toBeInTheDocument();
 expect(screen.getByText('1.000 ml')).toBeInTheDocument();
 expect(screen.getByRole('link',{name:/REGISTRAR REFEIÇÃO/i})).toBeInTheDocument();
 expect(screen.queryByRole('link',{name:/INICIAR UM TREINO/i})).not.toBeInTheDocument();
});
test('água é registrada uma vez e reflete no dia mesmo se GET falhar',async()=>{
 getDiaryLogs.mockResolvedValueOnce({data:[]}).mockRejectedValueOnce(new Error('offline'));
 render(<AdaptiveTodayDashboard/>);
 const b=await screen.findByRole('button',{name:/250 ML DE ÁGUA/i});
 fireEvent.click(b);
 await waitFor(()=>expect(addDiaryLog).toHaveBeenCalledTimes(1));
 expect(await screen.findByText('250 ml')).toBeInTheDocument();
});
test('modo normal preserva o painel atual',()=>{
 mockExperience={settings:{mode:'normal',food:true,workout:true,weight:true,coach:true},ready:true};
 render(<AdaptiveTodayDashboard/>);
 expect(screen.getByText('Hoje normal')).toBeInTheDocument();
});

test('modo normal respeita módulos desativados sem apagar ou alterar dados',()=>{
  mockExperience={settings:{mode:'normal',food:false,workout:false,weight:false,coach:true},ready:true};
  const {container}=render(<AdaptiveTodayDashboard/>);
  expect(container.querySelector('.gg-adaptive-hide-food.gg-adaptive-hide-workout.gg-adaptive-hide-weight')).not.toBeNull();
  expect(screen.getByText('Hoje normal')).toBeInTheDocument();
});
