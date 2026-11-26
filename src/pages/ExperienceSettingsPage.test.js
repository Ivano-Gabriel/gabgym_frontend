import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import ExperienceSettingsPage from './ExperienceSettingsPage';

const mockSave=jest.fn();
jest.mock('../context/ExperienceContext',()=>{
  const settings={mode:'normal',food:true,workout:true,weight:true,coach:true,
    language:'pt',completed:true};
  return {useExperience:()=>({settings,ready:true,save:mockSave,source:'server',error:''})};
});
jest.mock('react-router-dom',()=>({
  Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)
}));
beforeEach(()=>{jest.clearAllMocks();mockSave.mockResolvedValue({source:'server'});});
test('mudar para simples em espanhol salva os módulos sem remover dados',async()=>{
 render(<ExperienceSettingsPage/>);
 fireEvent.click(screen.getByRole('checkbox',{name:/Treinos e cardio/i}));
 fireEvent.click(screen.getByRole('radio',{name:/SIMPLES/i}));
 fireEvent.change(screen.getByLabelText('Idioma do aplicativo'),{target:{value:'es'}});
 fireEvent.click(screen.getByRole('button',{name:/SALVAR PREFERÊNCIAS/i}));
 await waitFor(()=>expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
   mode:'simple',workout:false,language:'es',completed:true
 })));
 expect(await screen.findByText('Preferências atualizadas.')).toBeInTheDocument();
});
test('não deixa desativar todas as áreas',()=>{
 render(<ExperienceSettingsPage/>);
 for(const text of [/Alimentação e água/i,/Treinos e cardio/i,/Peso e evolução/i,/Meu Personal/i])
   fireEvent.click(screen.getByRole('checkbox',{name:text}));
 expect(screen.getByRole('button',{name:/SALVAR PREFERÊNCIAS/i})).toBeDisabled();
});
