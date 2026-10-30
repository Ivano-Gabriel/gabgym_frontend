import { buildRecentDays, summarizeHistoryDay } from './historyUtils';

test('sete datas locais contínuas atravessam mês e ano corretamente',()=>{
  const items=buildRecentDays(new Date(2026,0,2,22,15),7);
  expect(items.map(x=>x.key)).toEqual(['2026-01-02','2026-01-01','2025-12-31','2025-12-30','2025-12-29','2025-12-28','2025-12-27']);
});
test('alimentos, água e gasto de treino têm contadores independentes',()=>{
  const total=summarizeHistoryDay([
    {type:'food',name:'Macaxeira',calories:420,protein:9,carbs:75},
    {type:'water',volume:300},
    {type:'cardio',calories:160,distanceKm:2.5,durationSeconds:900},
    {type:'exercise',calories:90,durationSeconds:600}
  ]);
  expect(total).toEqual(expect.objectContaining({
    calories:420,water:300,meals:1,movementCalories:250,distanceKm:2.5,movementMinutes:25,activities:2
  }));
});
test('registro inválido ou com números negativos não gera progresso fictício',()=>{
  const total=summarizeHistoryDay([{type:'exercise',calories:-20,durationSeconds:null},{type:'food',calories:null},{type:'water',volume:-5}]);
  expect(total.calories).toBe(0);
  expect(total.water).toBe(0);
  expect(total.movementCalories).toBe(0);
});