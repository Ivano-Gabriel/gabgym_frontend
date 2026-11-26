import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileForm from './ProfileForm';
let mockMode='normal';
jest.mock('../context/ExperienceContext',()=>({useExperience:()=>({settings:{mode:mockMode}})}));
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

test('simple profile edits weight without erasing existing measurements or goals',async()=>{
 mockMode='simple';
 localStorage.setItem('gabgym:body-measures:17',JSON.stringify({waist:98,chest:110}));
 localStorage.setItem('gabgym:weight-goal:17','75');
 try{
  render(<ProfileForm/>);
  const weight=await screen.findByLabelText(/^PESO \(KG\)$/i);
  expect(screen.queryByLabelText(/cintura/i)).not.toBeInTheDocument();
  fireEvent.change(weight,{target:{value:'79'}});
  fireEvent.click(screen.getByRole('button',{name:/salvar perfil/i}));
  await waitFor(()=>expect(updateUser).toHaveBeenCalledWith(17,expect.objectContaining({weight:79,height:180})));
  expect(JSON.parse(localStorage.getItem('gabgym:body-measures:17'))).toEqual({waist:98,chest:110});
  expect(localStorage.getItem('gabgym:weight-goal:17')).toBe('75');
 }finally{mockMode='normal';localStorage.removeItem('gabgym:weight-goal:17');}
});
