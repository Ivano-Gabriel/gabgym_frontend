import {getSwipeDestination,shouldIgnoreSwipeOrigin} from './swipeNavigation';
test('abas Hoje, Comer, Treino, Perfil avançam e voltam por gesto',()=>{
 expect(getSwipeDestination('/',-120,12,230)).toBe('/alimentacao');
 expect(getSwipeDestination('/alimentacao',-120,12,230)).toBe('/treino');
 expect(getSwipeDestination('/treino',-120,12,230)).toBe('/perfil');
 expect(getSwipeDestination('/treino',120,12,230)).toBe('/alimentacao');
 expect(getSwipeDestination('/perfil',-120,12,230)).toBeNull();
 expect(getSwipeDestination('/',120,12,230)).toBeNull();
});
test('swipes curtos, verticais, lentos ou fora das abas nao mudam pagina',()=>{
 expect(getSwipeDestination('/treino',40,3,200)).toBeNull();
 expect(getSwipeDestination('/treino',120,130,200)).toBeNull();
 expect(getSwipeDestination('/treino',120,9,1600)).toBeNull();
 expect(getSwipeDestination('/biblioteca',-120,9,200)).toBeNull();
});
test('campos e componentes interativos bloqueiam o swipe para nao perder dados',()=>{
 const el=document.createElement('main');el.innerHTML='<input aria-label="Nome"/><div data-no-tab-swipe><span id="closed">x</span></div><p id="open">y</p>';
 expect(shouldIgnoreSwipeOrigin(el.querySelector('input'),el)).toBe(true);
 expect(shouldIgnoreSwipeOrigin(el.querySelector('#closed'),el)).toBe(true);
 expect(shouldIgnoreSwipeOrigin(el.querySelector('#open'),el)).toBe(false);
});
