import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import ProfessionalAuthPage from './ProfessionalAuthPage';
import {registerProfessional,loginUser,warmUpApi} from '../services/apiService';

const mockNavigate=jest.fn();
let mockReadyState;
jest.mock('../hooks/useApiReady',()=>({useApiReady:()=>mockReadyState}));
jest.mock('react-router-dom',()=>({
  Link:({to,children,...rest})=>require('react').createElement('a',{href:to,...rest},children),
  useNavigate:()=>mockNavigate
}));
jest.mock('../services/apiService',()=>({
  registerProfessional:jest.fn(),loginUser:jest.fn(),warmUpApi:jest.fn()
}));
beforeEach(()=>{jest.clearAllMocks();sessionStorage.clear();mockReadyState={ready:true,checking:false,status:'ready',attempt:0,retry:jest.fn()};});

test('cadastro profissional é distinto do cadastro de aluno e não escolhe role no cliente',async()=>{
  registerProfessional.mockResolvedValueOnce({data:{role:'PERSONAL'}});
  render(<ProfessionalAuthPage mode="signup"/>);
  fireEvent.change(screen.getByLabelText('Usuário do personal'),{target:{value:'treinador'}});
  fireEvent.change(screen.getByLabelText('Senha'),{target:{value:'senhafortedemais'}});
  fireEvent.click(screen.getByRole('button',{name:/CRIAR CONTA PROFISSIONAL/i}));
  await waitFor(()=>expect(registerProfessional).toHaveBeenCalledWith({
    username:'treinador',password:'senhafortedemais'
  }));
  expect(mockNavigate).toHaveBeenCalledWith('/login-personal',{replace:true});
  expect(screen.getByRole('link',{name:/sou aluno/i})).toHaveAttribute('href','/signup');
});
test('login profissional rejeita papel ALUNO e não abre painel alheio',async()=>{
  loginUser.mockResolvedValueOnce({data:{role:'ALUNO'}});
  render(<ProfessionalAuthPage mode="login"/>);
  fireEvent.change(screen.getByLabelText('Usuário do personal'),{target:{value:'aluno'}});
  fireEvent.change(screen.getByLabelText('Senha'),{target:{value:'senhafortedemais'}});
  fireEvent.click(screen.getByRole('button',{name:/ENTRAR COMO PERSONAL/i}));
  expect(await screen.findByRole('alert')).toHaveTextContent(/conta pertence à área de aluno/i);
  expect(mockNavigate).not.toHaveBeenCalledWith('/painel-personal',expect.anything());
});
test('login pessoal com papel PERSONAL abre painel profissional',async()=>{
  loginUser.mockResolvedValueOnce({data:{role:'PERSONAL'}});
  render(<ProfessionalAuthPage mode="login"/>);
  fireEvent.change(screen.getByLabelText('Usuário do personal'),{target:{value:'treinador'}});
  fireEvent.change(screen.getByLabelText('Senha'),{target:{value:'senhafortedemais'}});
  fireEvent.click(screen.getByRole('button',{name:/ENTRAR COMO PERSONAL/i}));
  await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith('/painel-personal',{replace:true}));
});

test('campo de cadastro compila no padrão Unicode v, sem bloquear nomes válidos no navegador',()=>{
  render(<ProfessionalAuthPage mode="signup"/>);
  const field=screen.getByLabelText('Usuário do personal');
  const re=new RegExp('^(?:'+field.pattern+')$','v');
  expect(re.test('treinador')).toBe(true);
  expect(re.test('coach.gab')).toBe(true);
  expect(re.test('personal-01')).toBe(true);
  expect(re.test('inválido@')).toBe(false);
});
test('não envia cadastro repetido enquanto servidor gratuito está acordando',()=>{
  mockReadyState={ready:false,checking:true,status:'checking',attempt:3,retry:jest.fn()};
  render(<ProfessionalAuthPage mode="signup"/>);
  expect(screen.getByRole('button',{name:/CRIAR CONTA PROFISSIONAL/i})).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent(/tentativa 3/i);
  expect(registerProfessional).not.toHaveBeenCalled();
});
