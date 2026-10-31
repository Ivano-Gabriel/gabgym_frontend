import {suggestDailyGoals,goalOrEstimate} from './nutritionGoals';
const p={weight:80,height:180,age:22,gender:'male',activityLevel:'light',objective:'lose-fat'};
test('meta não fixa em 2300 e mantém macros coerentes',()=>{
 const g=suggestDailyGoals(p);
 expect(g).toEqual(expect.objectContaining({calories:2153,protein:128,water:2400}));
 expect(suggestDailyGoals({...p,objective:'gain-muscle'}).calories).toBeGreaterThan(g.calories);
});
test('perfil incompleto não recebe falsa meta',()=>{
 expect(suggestDailyGoals({...p,age:null})).toBeNull();
 expect(suggestDailyGoals({...p,gender:''})).toBeNull();
 expect(suggestDailyGoals({...p,activityLevel:''})).toBeNull();
});
test('meta manual tem prioridade e fallback preserva vazio',()=>{
 expect(goalOrEstimate('2400',2153,1200,7000)).toBe(2400);
 expect(goalOrEstimate('',2153,1200,7000)).toBe(2153);
 expect(goalOrEstimate('',null,1200,7000)).toBeNull();
});
