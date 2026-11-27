import React from 'react';
import {render,screen} from '@testing-library/react';
import ProfilePage from './ProfilePage';
import i18n from '../i18n';
import {getCurrentUser} from '../services/apiService';
jest.mock('react-router-dom',()=>({
 Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children),
 useNavigate:()=>jest.fn()
}));
jest.mock('../services/apiService',()=>({getCurrentUser:jest.fn(),logoutUser:jest.fn()}));
jest.mock('../components/StreakCalendar',()=>()=>null);
test('profile in Spanish preserves real weight and user identity',async()=>{
 try{
  await i18n.changeLanguage('es');
  getCurrentUser.mockResolvedValue({data:{id:17,name:'Persona',weight:80,height:180}});
  render(<ProfilePage/>);
  expect(await screen.findByRole('heading',{name:/Persona/})).toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Actualizar peso'})).toHaveTextContent('80 kg');
  expect(screen.getByRole('button',{name:'CERRAR SESIÓN'})).toBeInTheDocument();
 }finally{await i18n.changeLanguage('pt');}
});
