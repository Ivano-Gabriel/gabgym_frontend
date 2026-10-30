import { activeDay, computeStreak } from './streak';
test('foguinho só acende com registro real, não por abrir aplicativo',()=>{
 expect(activeDay([])).toBe(false);
 expect(activeDay([{type:'food',calories:0}])).toBe(true);
 expect(activeDay([{type:'cardio',calories:0}])).toBe(true);
});
test('sequência termina quando se falta um dia inteiro',()=>{
 expect(computeStreak([true,true,true,false,true])).toEqual({days:3,atRisk:false,capped:false});
 expect(computeStreak([false,true,true,false])).toEqual({days:2,atRisk:true,capped:false});
 expect(computeStreak([false,false,true])).toEqual({days:0,atRisk:false,capped:false});
 expect(computeStreak([true,true,true,true,true,true,true])).toEqual({days:7,atRisk:false,capped:true});
});