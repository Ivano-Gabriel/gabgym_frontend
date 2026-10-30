import { weightTrend, safeWeightProjection } from './weightProgress';
test('peso muda com registros reais, sem promessa de prazo',()=>{
 expect(weightTrend([{date:'2026-10-01',weight:92},{date:'2026-10-30',weight:90}])).toEqual({starting:92,latest:90,change:-2});
 expect(weightTrend([{date:'2026-10-30',weight:90}])).toEqual({starting:90,latest:90,change:0});
});
test('projeção não cria precisão a partir de um déficit imaginado',()=>{
 expect(safeWeightProjection(90,80,0)).toBeNull();
 const p=safeWeightProjection(90,85,-0.5);
 expect(p).toEqual(expect.objectContaining({weeks:10}));
 expect(safeWeightProjection(90,85,0.4)).toBeNull();
});