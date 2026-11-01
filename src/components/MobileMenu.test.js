import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import MobileMenu from './MobileMenu';
jest.mock('react-router-dom',()=>({Link:({to,children,...props})=>require('react').createElement('a',{href:to,...props},children)}));
test('menu secundario permanece no DOM, nao permite foco fechado e sai com Escape',()=>{
 const close=jest.fn();
 const {container,rerender}=render(<MobileMenu isOpen={false} onClose={close}/>);
 expect(container.querySelector('.gg-mobile-menu')).toHaveAttribute('aria-hidden','true');
 expect(container.querySelector('.gg-mobile-menu-link')).toHaveAttribute('tabindex','-1');
 rerender(<MobileMenu isOpen={true} onClose={close}/>);
 expect(screen.getByRole('navigation',{name:/ferramentas secundárias/i})).toBeInTheDocument();
 expect(container.querySelector('.gg-mobile-menu')).toHaveClass('open');
 fireEvent.keyDown(document,{key:'Escape'});
 expect(close).toHaveBeenCalledTimes(1);
});
