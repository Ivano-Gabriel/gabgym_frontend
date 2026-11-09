import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import PersonalPage from './PersonalPage';
import {getCurrentUser} from '../services/apiService';
jest.mock('../services/apiService',()=>({getCurrentUser:jest.fn()}));
jest.mock('../hooks/useApiReady',()=>({useApiReady:()=>({ready:true,checking:false,status:'ready',attempt:0,retry:jest.fn()})}));
jest.mock('../components/StudentCoachPanel',()=>({__esModule:true,default:({userId})=>require('react').createElement('div',{'data-testid':'portal'},'Conexão do aluno '+userId)}));
jest.mock('react-router-dom',()=>({Link:({to,children,...rest})=>require('react').createElement('a',{href:to,...rest},children)}));
beforeEach(()=>{jest.clearAllMocks();localStorage.clear();getCurrentUser.mockResolvedValue({data:{id:17}})});
test('guarda preferencias de treino no dispositivo para esta conta',async()=>{
 render(<PersonalPage/>);
 const goal=await screen.findByLabelText('OBJETIVO');
 fireEvent.change(goal,{target:{value:'ganhar massa'}});
 fireEvent.change(screen.getByLabelText('DIAS DISPONÍVEIS NA SEMANA'),{target:{value:'4'}});
 fireEvent.click(screen.getByRole('button',{name:/salvar preferências/i}));
 await waitFor(()=>expect(JSON.parse(localStorage.getItem('gabgym:personal-brief:17'))).toEqual(expect.objectContaining({goal:'ganhar massa',days:'4'})));
 expect(screen.getByText(/Salvo neste dispositivo/i)).toBeInTheDocument();
});
test('Meu Personal abre portal autorizado e preserva preferências locais',async()=>{
 render(<PersonalPage/>);
 await screen.findByLabelText('OBJETIVO');
 expect(screen.getByTestId('portal')).toHaveTextContent('Conexão do aluno 17');
 expect(screen.getByText(/você decide quando solicitar ou revogar/i)).toBeInTheDocument();
});
