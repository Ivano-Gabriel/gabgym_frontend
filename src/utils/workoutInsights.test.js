import {workoutSuggestions,lastExerciseResult,workoutGroups} from './workoutInsights';

test('biblioteca local filtra por músculo e acentuação sem buscar dados externos',()=>{
  expect(workoutGroups).toContain('peito');
  const results=workoutSuggestions('SUPINO','peito',6);
  expect(results.length).toBeGreaterThan(0);
  expect(results.every(x=>x.group==='peito')).toBe(true);
  expect(results.every(x=>x.name.toLowerCase().includes('supino'))).toBe(true);
});
test('último desempenho considera apenas séries realmente concluídas',()=>{
  const history=[{recordedAt:1000,exercises:[{name:'Supino reto',sets:[
    {reps:'10',weightKg:'60',done:true},
    {reps:'8',weightKg:'70',done:true},
    {reps:'8',weightKg:'90',done:false}
  ]}]}];
  expect(lastExerciseResult(history,'supino reto')).toEqual({
    weightKg:70,totalSets:2,volumeKg:1160,recordedAt:1000
  });
  expect(lastExerciseResult(history,'agachamento')).toBeNull();
});
