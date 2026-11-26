import {experienceNavigation} from './experienceNavigation';
test('usuário que quer apenas comer vê um caminho simples e sem distrações',()=>{
 const nav=experienceNavigation({mode:'simple',food:true,workout:false,weight:false,coach:false});
 expect(nav.primary.map(x=>x.label)).toEqual(['Hoje','Comer','Perfil']);
 expect(nav.menu.map(x=>x.title)).toEqual(['Alimentação','Personalizar']);
 expect(nav.menu.some(x=>x.to==='/treino')).toBe(false);
});
test('modo completo libera atalhos de histórico e configuração independente dos módulos',()=>{
 const nav=experienceNavigation({mode:'complete',food:false,workout:true,weight:true,coach:false});
 expect(nav.menu.map(x=>x.label)).toContain('Histórico');
 expect(nav.menu.map(x=>x.label)).toContain('Personalizar');
 expect(nav.menu.find(x=>x.key==='coach')).toBeUndefined();
});
test('quem não configurou mantém a navegação padrão do app atual',()=>{
 const nav=experienceNavigation({});
 expect(nav.menu.some(x=>x.key==='food')).toBe(true);
 expect(nav.menu.some(x=>x.key==='workout')).toBe(true);
 expect(nav.menu.some(x=>x.key==='coach')).toBe(true);
});
