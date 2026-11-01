import {sanitizePersonalBrief,personalBriefKey} from './personalBrief';
test('o rascunho valida objetivo, dias e limita observacoes',()=>{
 expect(sanitizePersonalBrief({goal:'invalido',focus:'fake',days:99,notes:'x'.repeat(400)}))
 .toEqual({goal:'',focus:'',days:'',notes:'x'.repeat(280)});
 expect(sanitizePersonalBrief({goal:'ganhar massa',focus:'musculacao',days:4,notes:'Força'}))
 .toEqual({goal:'ganhar massa',focus:'musculacao',days:'4',notes:'Força'});
});
test('o armazenamento distingue cada conta',()=>{
 expect(personalBriefKey(17)).toBe('gabgym:personal-brief:17');
 expect(personalBriefKey(18)).not.toBe(personalBriefKey(17));
 expect(personalBriefKey(null)).toBeNull();
});
