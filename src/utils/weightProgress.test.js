import { weightTrend, safeWeightProjection, weightGoalProgress } from './weightProgress';
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
test('progresso de peso avança só na direção da meta (perda e ganho)',()=>{
 expect(weightGoalProgress(100,95,80)).toBe(25);
 expect(weightGoalProgress(100,110,80)).toBe(0);
 expect(weightGoalProgress(100,80,80)).toBe(100);
 expect(weightGoalProgress(100,75,80)).toBe(100);
 expect(weightGoalProgress(70,75,90)).toBe(25);
 expect(weightGoalProgress(70,65,90)).toBe(0);
 expect(weightGoalProgress(70,90,90)).toBe(100);
});
test('peso sem histórico válido não inventa percentual',()=>{
 expect(weightGoalProgress(null,95,80)).toBeNull();
 expect(weightGoalProgress(100,undefined,80)).toBeNull();
 expect(weightGoalProgress(100,95,0)).toBeNull();
 expect(weightGoalProgress(80,80,80)).toBe(100);
 expect(weightGoalProgress(80,82,80)).toBe(0);
});
