import React from 'react';
import { render,screen,fireEvent,waitFor } from '@testing-library/react';
import RegistrosPage from './RegistrosPage';
import {getCurrentUser,getDiaryLogs,deleteDiaryLog} from '../services/apiService';

jest.mock('react-router-dom',()=>({
 Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)
}));
jest.mock('../services/apiService',()=>({getCurrentUser:jest.fn(),getDiaryLogs:jest.fn(),deleteDiaryLog:jest.fn()}));
beforeEach(()=>{
 jest.clearAllMocks();
 getCurrentUser.mockResolvedValue({data:{id:17,name:'Pessoa'}});
 getDiaryLogs.mockResolvedValue({data:[{id:12,name:'Bife Grelhado',type:'food',calories:450},{id:13,type:'water',name:'Água',volume:250}]});
 deleteDiaryLog.mockResolvedValue({data:null});
});
test('exclusão não ocorre antes de confirmação',async()=>{
 render(<RegistrosPage/>);
 expect(await screen.findByText('Bife Grelhado')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:/remover bife grelhado/i}));
 expect(deleteDiaryLog).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:/cancelar exclusão/i}));
 expect(deleteDiaryLog).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:/remover bife grelhado/i}));
 fireEvent.click(screen.getByRole('button',{name:/confirmar exclusão/i}));
 await waitFor(()=>expect(deleteDiaryLog).toHaveBeenCalledWith(12));
 expect(screen.queryByText('Bife Grelhado')).not.toBeInTheDocument();
});
test('filtros mostram tipo de registro sem apagar dados',async()=>{
 render(<RegistrosPage/>);
 await screen.findByText('Bife Grelhado');
 fireEvent.click(screen.getByRole('button',{name:/^Água$/i}));
 expect(screen.queryByText('Bife Grelhado')).not.toBeInTheDocument();
 expect(screen.getByText('250 ml')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:/Todos/i}));
 expect(screen.getByText('Bife Grelhado')).toBeInTheDocument();
});