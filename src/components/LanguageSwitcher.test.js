import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import LanguageSwitcher from './LanguageSwitcher';
import i18n from '../i18n';
let mockAccountId=null;
const mockSave=jest.fn();
jest.mock('../context/ExperienceContext',()=>({
  useExperience:()=>({settings:{mode:'normal',food:true,workout:true,weight:true,coach:true,
    language:'pt',completed:true},accountId:mockAccountId,save:mockSave})
}));
beforeEach(async()=>{
 localStorage.clear();jest.clearAllMocks();mockAccountId=null;
 await i18n.changeLanguage('pt');
 mockSave.mockResolvedValue({source:'server'});
});
afterEach(async()=>{await i18n.changeLanguage('pt');});
test('trocar idioma na criação de conta mostra opções e guarda escolha no navegador',async()=>{
 render(<LanguageSwitcher/>);
 expect(screen.getAllByRole('option')).toHaveLength(4);
 fireEvent.change(screen.getByLabelText('Idioma'),{target:{value:'fr'}});
 await waitFor(()=>expect(i18n.language).toBe('fr'));
 expect(localStorage.getItem('gabgym:interface-language')).toBe('fr');
});
test('quando logado tenta salvar idioma na conta autenticada',async()=>{
 mockAccountId=17;
 render(<LanguageSwitcher/>);
 fireEvent.change(screen.getByLabelText('Idioma'),{target:{value:'en'}});
 await waitFor(()=>expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({language:'en'})));
});
