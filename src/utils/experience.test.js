import {EXPERIENCE_DEFAULTS,normalizeExperience,validateExperience,
  readLocalExperience,writeLocalExperience,visibleSections,experienceGate} from './experience';

const storage=()=>({
  data:new Map(),
  getItem(key){return this.data.get(key)||null;},
  setItem(key,value){this.data.set(key,value);}
});
test('contas antigas têm experiência normal e acesso ao que já usavam',()=>{
 expect(normalizeExperience(null)).toEqual(EXPERIENCE_DEFAULTS);
 expect(visibleSections({})).toEqual(['food','workout','weight','coach']);
});
test('módulos ocultos não são removidos nem implicam exclusão de dados',()=>{
 const s=validateExperience({...EXPERIENCE_DEFAULTS,mode:'simple',food:false});
 expect(s.food).toBe(false);
 expect(visibleSections(s)).not.toContain('food');
});
test('uma pessoa pode configurar modo completo com idioma francês',()=>{
 expect(validateExperience({mode:'complete',food:true,workout:true,weight:true,coach:true,
  language:'fr',completed:true})).toMatchObject({mode:'complete',language:'fr'});
});
test('preferências locais são segregadas por conta',()=>{
 const fake=storage();
 writeLocalExperience(17,{...EXPERIENCE_DEFAULTS,workout:false,language:'es'},fake);
 expect(readLocalExperience(17,fake).workout).toBe(false);
 expect(readLocalExperience(18,fake)).toBeNull();
});
test('dados corrompidos não derrubam o onboarding e nenhuma categoria não pode ser selecionada',()=>{
 const fake=storage();
 fake.setItem('gabgym:experience:17','{bad-json');
 expect(readLocalExperience(17,fake)).toBeNull();
 expect(()=>validateExperience({food:false,workout:false,weight:false,coach:false})).toThrow();
});

test.each(['/','/perfil','/treino','/configuracoes','/login','/historico'])('pending account cannot open %s',path=>{
 expect(experienceGate({student:true,ready:true,accountId:17,completed:false,path})).toBe('redirect');
});
test('gate waits for the current account and preserves professional routes',()=>{
 expect(experienceGate({student:true,ready:false,completed:true,path:'/'})).toBe('loading');
 expect(experienceGate({student:true,ready:true,accountId:null,completed:true,path:'/'})).toBe('unavailable');
 expect(experienceGate({student:true,ready:true,accountId:17,completed:false,path:'/experiencia'})).toBe('onboarding');
 expect(experienceGate({student:true,ready:true,accountId:17,completed:true,path:'/'})).toBe('open');
 expect(experienceGate({student:false,ready:false,path:'/painel-personal'})).toBe('open');
});
