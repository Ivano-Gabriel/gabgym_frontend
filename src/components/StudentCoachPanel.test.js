import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import StudentCoachPanel from './StudentCoachPanel';
import {getPersonalConnection,requestPersonal,getPersonalTimeline,
  getDiaryLogs,revokePersonal,decidePersonalPlan,ensureApiReady} from '../services/apiService';
jest.mock('react-router-dom',()=>({
 Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../services/apiService',()=>({
 getPersonalConnection:jest.fn(),requestPersonal:jest.fn(),getPersonalTimeline:jest.fn(),
 getDiaryLogs:jest.fn(),revokePersonal:jest.fn(),decidePersonalPlan:jest.fn(),
 postPersonalMessage:jest.fn(),ensureApiReady:jest.fn()
}));
beforeEach(()=>{
 jest.clearAllMocks();
 ensureApiReady.mockResolvedValue(true);
 getDiaryLogs.mockResolvedValue({data:[{type:'food',calories:750},{type:'water',volume:1000},{type:'exercise'}]});
 getPersonalTimeline.mockResolvedValue({data:[]});
 getPersonalConnection.mockResolvedValue({data:{status:'NONE'}});
});

test('sem vínculo não exibe nem inventa conversas de coach',async()=>{
 render(<StudentCoachPanel userId={17}/>);
 expect(await screen.findByText(/Nenhum profissional tem acesso aos seus registros/i)).toBeInTheDocument();
 expect(screen.queryByText('CONVERSA E PLANOS')).not.toBeInTheDocument();
 expect(getPersonalTimeline).not.toHaveBeenCalled();
});
test('aluno pode solicitar acompanhamento sabendo o username do profissional',async()=>{
 requestPersonal.mockResolvedValueOnce({data:{status:'PENDING'}});
 render(<StudentCoachPanel userId={17}/>);
 const input=await screen.findByLabelText('Usuário do personal');
 fireEvent.change(input,{target:{value:'coach.gab'}});
 const submit=screen.getByRole('button',{name:'SOLICITAR ACOMPANHAMENTO'});
 expect(submit).toBeDisabled();
 fireEvent.click(screen.getByRole('checkbox',{name:/Autorizo este personal/i}));
 fireEvent.click(submit);
 await waitFor(()=>expect(requestPersonal).toHaveBeenCalledWith('coach.gab'));
});
test('após aceite exibe métricas reais, plano para aprovar e revogação',async()=>{
 getPersonalConnection.mockResolvedValue({data:{id:1,status:'ACTIVE',coachUsername:'coach.gab'}});
 getPersonalTimeline.mockResolvedValue({data:[
  {id:10,kind:'PLAN',content:'Peito e ombro',status:'PENDING',mine:false}
 ]});
 decidePersonalPlan.mockResolvedValue({data:{status:'APPROVED'}});
 render(<StudentCoachPanel userId={17}/>);
 expect(await screen.findByText(/ACOMPANHAMENTO ATIVO/i)).toBeInTheDocument();
 expect(screen.getByText('750 kcal')).toBeInTheDocument();
 expect(screen.getByText('1.000 ml')).toBeInTheDocument();
 expect(screen.getByText('Peito e ombro')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:/APROVAR/i}));
 await waitFor(()=>expect(decidePersonalPlan).toHaveBeenCalledWith(17,10,'APPROVE'));
 await screen.findByText('Plano aprovado.');
 await waitFor(()=>expect(screen.getByRole('button',{name:/REVOGAR ACESSO/i})).toBeEnabled());
 fireEvent.click(screen.getByRole('button',{name:/REVOGAR ACESSO/i}));
 await waitFor(()=>expect(revokePersonal).toHaveBeenCalledTimes(1));
});

test('nome de usuário para vincular personal funciona em browsers com RegExp v',async()=>{
 render(<StudentCoachPanel userId={17}/>);
 const field=await screen.findByLabelText('Usuário do personal');
 const re=new RegExp('^(?:'+field.pattern+')$','v');
 expect(re.test('coach.gab')).toBe(true);
 expect(re.test('personal-01')).toBe(true);
});
