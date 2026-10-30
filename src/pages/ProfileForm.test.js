import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileForm from './ProfileForm';
import { getCurrentUser, updateUser } from '../services/apiService';

jest.mock('react-router-dom', () => ({
  Link: ({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useNavigate:()=>()=>{}
}));
jest.mock('../services/apiService', () => ({getCurrentUser:jest.fn(),updateUser:jest.fn()}));
jest.mock('react-toastify', () => ({toast:{success:jest.fn(),error:jest.fn()}}));
beforeEach(()=>{
  jest.clearAllMocks();
  getCurrentUser.mockResolvedValue({data:{id:17,name:'Pessoa',weight:80,height:180,age:25,gender:'male',objective:'maintain-weight',activityLevel:'light'}});
  updateUser.mockResolvedValue({data:{}});
  localStorage.removeItem('gabgym:body-measures:17');
});
test('salva peso/altura no servidor, com medidas avançadas opcionais', async()=>{
  render(<ProfileForm/>);
  expect(await screen.findByLabelText(/^PESO \(KG\)$/i)).toHaveValue(80);
  expect(screen.getByLabelText(/cintura/i)).toHaveValue(null);
  fireEvent.change(screen.getByLabelText(/cintura/i),{target:{value:'98'}});
  fireEvent.click(screen.getByRole('button',{name:/salvar perfil/i}));
  await waitFor(()=>expect(updateUser).toHaveBeenCalledWith(17,expect.objectContaining({weight:80,height:180})));
  expect(JSON.parse(localStorage.getItem('gabgym:body-measures:17')).waist).toBe(98);
});
