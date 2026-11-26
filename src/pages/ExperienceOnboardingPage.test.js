import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import ExperienceOnboardingPage from './ExperienceOnboardingPage';
const mockSave=jest.fn();
const mockNavigate=jest.fn();
jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
  useNavigate:()=>mockNavigate,useLocation:()=>({search:''})
}));
jest.mock('../context/ExperienceContext',()=>({
  useExperience:()=>({settings:{mode:'normal',food:true,workout:true,weight:true,coach:true,
    language:'pt',completed:false},ready:true,save:mockSave})
}));
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
