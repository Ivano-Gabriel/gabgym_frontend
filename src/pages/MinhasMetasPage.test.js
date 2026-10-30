import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import MinhasMetasPage from './MinhasMetasPage';
import {getCurrentUser,getMetas} from '../services/apiService';
jest.mock('../services/apiService',()=>({
 getCurrentUser:jest.fn(),getMetas:jest.fn(),createMeta:jest.fn(),updateMetaStatus:jest.fn()
}));
jest.mock('react-toastify',()=>({toast:{success:jest.fn(),error:jest.fn()}}));
beforeEach(()=>{localStorage.removeItem('gabgym:weight-goal:17');getCurrentUser.mockResolvedValue({data:{id:17,weight:90}});getMetas.mockResolvedValue({data:[]});});
test('meta de peso é opcional e salva com referência à conta',async()=>{
 render(<MinhasMetasPage/>);
 const field=await screen.findByRole('spinbutton',{name:/Meta de peso/i});
 fireEvent.change(field,{target:{value:'85'}});
 fireEvent.click(screen.getByRole('button',{name:/Salvar meta de peso/i}));
 await waitFor(()=>expect(localStorage.getItem('gabgym:weight-goal:17')).toBe('85'));
});
