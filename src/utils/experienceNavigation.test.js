import {experienceNavigation,experienceRouteAllowed} from './experienceNavigation';
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

test.each(['/alimentacao','/legado/dietas','/cardio/select','/exercicio/12','/meu-personal'])('disabled areas stay unavailable at %s',path=>{
 expect(experienceRouteAllowed(path,{mode:'complete',food:false,workout:false,coach:false,weight:true})).toBe(false);
});
test('simple mode preserves essential routes and removes advanced workout tools',()=>{
 const state={mode:'simple',food:true,workout:true,weight:true,coach:false};
 for(const path of ['/','/perfil','/profile-form','/configuracoes','/alimentacao','/treino','/cardio/select','/historico','/registros'])expect(experienceRouteAllowed(path,state)).toBe(true);
 for(const path of ['/routine-generator','/exercise-library','/plano-de-treino/3'])expect(experienceRouteAllowed(path,state)).toBe(false);
});

test.each(['/ALIMENTACAO','/diario-alimentar','/dietas','/legado/diario'])('disabled nutrition blocks alias %s',path=>{
 expect(experienceRouteAllowed(path,{mode:'normal',food:false})).toBe(false);
});
