import { greetingFor, makeWaterEntry, recentFoodsToday } from './todayActions';

test('saudação usa o nome, nunca um ID numérico exposto no perfil', () => {
  expect(greetingFor({ name: '157', username: 'gabriel' })).toBe('Continue, gabriel.');
  expect(greetingFor({ name: 'João Pedro', username: '157' })).toBe('Continue, João.');
  expect(greetingFor({ name: '157', username: '123' })).toBe('O importante é continuar.');
  expect(greetingFor({ name: ' ' })).toBe('O importante é continuar.');
});
test('atalho de água gera o mesmo contrato do diário e rejeita volume inesperado', () => {
  const entry = makeWaterEntry(17, 250, '2026-11-08', 1234);
  expect(entry).toEqual({userId:17,type:'water',name:'Água',volume:250,
    calories:0,protein:0,carbs:0,fat:0,logDate:'2026-11-08',timestamp:1234});
  expect(makeWaterEntry(17,500,'2026-11-08',1245).volume).toBe(500);
  expect(() => makeWaterEntry(17, 2500, '2026-11-08', 1234)).toThrow();
});
test('refeições recentes mostram apenas registros existentes e não inventam calorias', () => {
 const rows=recentFoodsToday([
    {id:1,type:'water',name:'Água'},
    {id:2,type:'food',name:'Ovo',calories:140},
    {id:3,type:'food',name:'Cuscuz',calories:220},
    {id:4,type:'exercise',name:'Treino'},
    {id:5,type:'food',name:'Banana',calories:80},
    {id:6,type:'food',name:'',calories:200},
 ], 2);
 expect(rows.map(x=>x.name)).toEqual(['Banana','Cuscuz']);
 expect(rows.map(x=>x.calories)).toEqual([80,220]);
 expect(recentFoodsToday([{type:'food',name:'Manga'}])[0].calories).toBeUndefined();
});
