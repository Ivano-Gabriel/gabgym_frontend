import {
  summarizeWorkout, buildWorkoutDiaryEntry, readWorkoutTemplates,
  saveWorkoutTemplate, appendWorkoutSession, readWorkoutSessions
} from './workoutPlans';

const done = [
  {id:'a',name:'Supino reto',sets:[
    {id:'a1',reps:'10',weightKg:'60',done:true},
    {id:'a2',reps:'8',weightKg:'65',done:true},
    {id:'a3',reps:'8',weightKg:'65',done:false},
  ]},
  {id:'b',name:'Flexão',sets:[{id:'b1',reps:'12',weightKg:'0',done:true}]},
];
const memory=()=>({
  values:new Map(),
  getItem(k){return this.values.get(k)||null;},
  setItem(k,v){this.values.set(k,v);}
});

test('volume de treino conta apenas séries concluídas e carga real, nunca calorias inventadas',()=>{
  expect(summarizeWorkout(done)).toEqual({
    exerciseCount:2,totalSets:4,completedSets:3,volumeKg:1120
  });
});
test('registro diário só é criado com séries concluídas e envia kcal zero',()=>{
  expect(buildWorkoutDiaryEntry(17,'Peito e tríceps',done,45,'2026-11-08',1000))
    .toEqual({userId:17,type:'exercise',name:expect.stringContaining('3 séries'),
      calories:0,logDate:'2026-11-08',timestamp:1000});
  expect(()=>buildWorkoutDiaryEntry(17,'Peito e tríceps',
    [{name:'Supino',sets:[{reps:10,weightKg:40,done:false}]}],45,'2026-11-08',1000)).toThrow(/concluída/i);
  expect(()=>buildWorkoutDiaryEntry(17,'Peito e tríceps',
    [{name:'Supino',sets:[{reps:1000,weightKg:40,done:true}]}],45,'2026-11-08',1000)).toThrow();
});
test('fichas são separadas por usuário, sem salvar flags de séries concluídas',()=>{
  const storage=memory();
  const list=saveWorkoutTemplate(17,{name:'Peito A',restSeconds:90,exercises:done},storage);
  expect(list).toHaveLength(1);
  expect(list[0].exercises[0].sets[0].done).toBe(false);
  expect(readWorkoutTemplates(17,storage)[0].name).toBe('Peito A');
  expect(readWorkoutTemplates(18,storage)).toEqual([]);
  expect(saveWorkoutTemplate(17,{name:'Peito A',restSeconds:60,exercises:done},storage)).toHaveLength(1);
});
test('dados locais corrompidos não derrubam as fichas',()=>{
  const storage=memory();
  storage.setItem('gabgym:workout-plans:17','invalid json');
  expect(readWorkoutTemplates(17,storage)).toEqual([]);
});
test('histórico detalhado local é separado por usuário e só aceita sessão válida',()=>{
  const storage=memory();
  appendWorkoutSession(17,{name:'Peito A',minutes:45,exercises:done,recordedAt:1000},storage);
  expect(readWorkoutSessions(17,storage)).toHaveLength(1);
  expect(readWorkoutSessions(18,storage)).toEqual([]);
  expect(readWorkoutSessions(17,storage)[0].exercises[0].sets[0].weightKg).toBe('60');
});
