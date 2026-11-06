import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import LoginPage from './LoginPage';
import {loginUser,warmUpApi} from '../services/apiService';

jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useNavigate:()=>jest.fn()
}));
jest.mock('../services/apiService',()=>({
  loginUser:jest.fn(),getCurrentUser:jest.fn(),warmUpApi:jest.fn()
}));

beforeEach(()=>{jest.clearAllMocks();});

test('mostrar e ocultar senha funciona por clique, sem alterar login',()=>{
  render(<LoginPage/>);
  const password=screen.getByLabelText('Senha');
  expect(password).toHaveAttribute('type','password');
  fireEvent.click(screen.getByRole('button',{name:'Mostrar senha'}));
  expect(password).toHaveAttribute('type','text');
  expect(screen.getByRole('button',{name:'Ocultar senha'})).toHaveAttribute('aria-pressed','true');
  fireEvent.click(screen.getByRole('button',{name:'Ocultar senha'}));
  expect(password).toHaveAttribute('type','password');
  expect(warmUpApi).toHaveBeenCalledTimes(1);
});

test('MFA solicitado pelo servidor mantém campo de seis dígitos no login',async()=>{
  loginUser.mockRejectedValueOnce({response:{status:428}});
  render(<LoginPage/>);
  fireEvent.change(screen.getByLabelText('Usuário'),{target:{value:'teste'}});
  fireEvent.change(screen.getByLabelText('Senha'),{target:{value:'senhaforteexemplo'}});
  fireEvent.click(screen.getByRole('button',{name:/ENTRAR NO GABGYM/i}));
  const code=await screen.findByLabelText('Código de segurança');
  expect(code).toHaveAttribute('inputmode','numeric');
  expect(code).toHaveAttribute('maxlength','6');
  expect(screen.getByRole('button',{name:/VALIDAR CÓDIGO/i})).toBeInTheDocument();
  expect(loginUser).toHaveBeenCalledWith({username:'teste',password:'senhaforteexemplo',codigoMfa:null});
});
