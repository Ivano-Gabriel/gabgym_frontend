import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import CoachDashboard from './CoachDashboard';
import {getCurrentUser,getCoachStudents,getCoachDay,getPersonalTimeline,
  decideCoachRequest,postPersonalMessage} from '../services/apiService';

const mockNavigate=jest.fn();
jest.mock('react-router-dom',()=>({
 Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
 useNavigate:()=>mockNavigate
}));
jest.mock('../services/apiService',()=>({
 getCurrentUser:jest.fn(),getCoachStudents:jest.fn(),getCoachDay:jest.fn(),
 getPersonalTimeline:jest.fn(),decideCoachRequest:jest.fn(),postPersonalMessage:jest.fn(),logoutUser:jest.fn()
}));
beforeEach(()=>{
 jest.clearAllMocks();
 getCurrentUser.mockResolvedValue({data:{id:8,role:'PERSONAL',username:'coach.gab'}});
 getCoachStudents.mockResolvedValue({data:[
  {id:17,username:'ana',name:'Ana',status:'ACTIVE'},
  {id:19,username:'joao',name:'João',status:'PENDING'}
 ]});
 getCoachDay.mockResolvedValue({data:{studentId:17,name:'Ana',calories:960,waterMl:1200,exercises:1,
  logs:[{type:'food',name:'Arroz',calories:400}],goals:[{title:'Caminhar',status:'ATIVA'}]}});
 getPersonalTimeline.mockResolvedValue({data:[]});
 decideCoachRequest.mockResolvedValue({data:{status:'ACTIVE'}});
 postPersonalMessage.mockResolvedValue({data:{id:1}});
});
test('painel mostra somente alunos autorizados e métricas reais',async()=>{
 render(<CoachDashboard/>);
 expect(await screen.findByText('960 kcal')).toBeInTheDocument();
 expect(screen.getByText('1.200 ml')).toBeInTheDocument();
 expect(screen.getByText('Arroz')).toBeInTheDocument();
 expect(screen.getByText('Caminhar')).toBeInTheDocument();
 expect(screen.getByRole('button',{name:/Aceitar/i})).toBeInTheDocument();
 expect(getCoachDay).toHaveBeenCalledWith(17,undefined);
 expect(getCoachDay).not.toHaveBeenCalledWith(19,undefined);
});
test('coaching precisa aceitar solicitação e envia proposta sem modificar diário',async()=>{
 render(<CoachDashboard/>);
 fireEvent.click(await screen.findByRole('button',{name:/Aceitar/i}));
 await waitFor(()=>expect(decideCoachRequest).toHaveBeenCalledWith(19,'ACCEPT'));
 await screen.findByText('960 kcal');
 fireEvent.change(await screen.findByLabelText('Tipo de comunicação'),{target:{value:'PLAN'}});
 fireEvent.change(await screen.findByLabelText('Proposta de treino para aprovação'),{target:{value:'Costas 3x10'}});
 fireEvent.click(screen.getByRole('button',{name:/ENVIAR PARA ACOMPANHAMENTO/i}));
 await waitFor(()=>expect(postPersonalMessage).toHaveBeenCalledWith(17,'PLAN','Costas 3x10'));
});
