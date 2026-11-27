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
const next=()=>fireEvent.click(screen.getByRole('button',{name:'Continuar'}));
const reachMode=()=>{for(let i=0;i<5;i++)next();};
test('seven-step onboarding requires mode and preserves explicit module choice',async()=>{
 render(<ExperienceOnboardingPage/>);
 expect(screen.getByRole('heading',{name:/sexo biológico/i})).toBeInTheDocument();
 reachMode();
 expect(screen.getByRole('button',{name:'Continuar'})).toBeDisabled();
 fireEvent.click(screen.getByRole('radio',{name:/SIMPLES/i}));
 next();
 for(const name of [/Treinos e cardio/i,/Peso e evolução/i,/Meu Personal/i])fireEvent.click(screen.getByRole('checkbox',{name}));
 fireEvent.click(screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i}));
 await waitFor(()=>expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({mode:'simple',food:true,workout:false,weight:false,coach:false,completed:true})));
 expect(mockNavigate).toHaveBeenCalledWith('/',{replace:true});
});
test('no modules cannot be saved',()=>{
 render(<ExperienceOnboardingPage/>);reachMode();fireEvent.click(screen.getByRole('radio',{name:/NORMAL/i}));next();
 for(const name of [/Alimentação e água/i,/Treinos e cardio/i,/Peso e evolução/i,/Meu Personal/i])fireEvent.click(screen.getByRole('checkbox',{name}));
 expect(screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i})).toBeDisabled();
});
test('failed server save requires explicit local confirmation',async()=>{
 mockSave.mockRejectedValueOnce(new Error('legacy endpoint'));mockSaveLocal.mockResolvedValueOnce({source:'local'});
 render(<ExperienceOnboardingPage/>);reachMode();fireEvent.click(screen.getByRole('radio',{name:/SIMPLES/i}));next();
 fireEvent.click(screen.getByRole('button',{name:/COMEÇAR COM ESSA EXPERIÊNCIA/i}));
 const local=await screen.findByRole('button',{name:'SALVAR NESTE NAVEGADOR'});
 expect(mockNavigate).not.toHaveBeenCalled();
 fireEvent.click(local);
 await waitFor(()=>expect(mockSaveLocal).toHaveBeenCalledWith(expect.objectContaining({mode:'simple',completed:true})));
 await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith('/',{replace:true}));
});
