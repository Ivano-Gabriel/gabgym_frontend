import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import ExperienceOnboardingPage from './ExperienceOnboardingPage';
const mockSave=jest.fn();
const mockSaveLocal=jest.fn();
const mockNavigate=jest.fn();
jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useNavigate:()=>mockNavigate,useLocation:()=>({search:''})
}));
jest.mock('../context/ExperienceContext',()=>{
  const settings={mode:'normal',food:true,workout:true,weight:true,coach:true,
    language:'pt',completed:false};
  return {useExperience:()=>({settings,ready:true,save:mockSave,saveLocal:mockSaveLocal})};
});
beforeEach(()=>{jest.clearAllMocks();mockSave.mockResolvedValue({source:'server'});});
test('pessoa pode escolher só dieta e modo simples sem perder dados antigos',async()=>{
  render(<ExperienceOnboardingPage/>);
  fireEvent.click(screen.getByRole('checkbox',{name:/Treinos e cardio/i}));
  fireEvent.click(screen.getByRole('checkbox',{name:/Peso e evolução/i}));
  fireEvent.click(screen.getByRole('checkbox',{name:/Meu Personal/i}));
  fireEvent.click(screen.getByRole('radio',{name:/SIMPLES/i}));
  fireEvent.click(screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i}));
  await waitFor(()=>expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
    mode:'simple',food:true,workout:false,weight:false,coach:false,completed:true
  })));
  expect(mockNavigate).toHaveBeenCalledWith('/',{replace:true});
});
test('ninguém pode esconder todos os módulos',()=>{
  render(<ExperienceOnboardingPage/>);
  for(const text of [/Alimentação e água/i,/Treinos e cardio/i,/Peso e evolução/i,/Meu Personal/i]){
    fireEvent.click(screen.getByRole('checkbox',{name:text}));
  }
  expect(screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i})).toBeDisabled();
});

test('first access requires explicit mode selection without a skip button',()=>{
 render(<ExperienceOnboardingPage/>);
 const start=screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i});
 expect(start).toBeDisabled();
 expect(screen.queryByRole('button',{name:/pular/i})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('radio',{name:/NORMAL/i}));
 expect(start).toBeEnabled();
});

test('failed server save requires explicit choice before saving locally',async()=>{
 mockSave.mockRejectedValueOnce(new Error('legacy endpoint'));
 mockSaveLocal.mockResolvedValueOnce({source:'local'});
 render(<ExperienceOnboardingPage/>);
 fireEvent.click(screen.getByRole('radio',{name:/SIMPLES/i}));
 fireEvent.click(screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i}));
 const local=await screen.findByRole('button',{name:'SALVAR NESTE NAVEGADOR'});
 expect(mockNavigate).not.toHaveBeenCalled();
 expect(mockSaveLocal).not.toHaveBeenCalled();
 fireEvent.click(local);
 await waitFor(()=>expect(mockSaveLocal).toHaveBeenCalledWith(expect.objectContaining({mode:'simple',completed:true})));
 await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith('/',{replace:true}));
});
