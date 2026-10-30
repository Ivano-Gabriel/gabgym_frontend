import { filterGpsStep } from './gpsTracking';
const at=(lat,long,accuracy,timestamp)=>({coords:{latitude:lat,longitude:long,accuracy},timestamp});
test('ignora deriva de GPS parado dentro de zona de precisão',()=>{
 const prev=at(-9.65,-35.70,9,1000);
 expect(filterGpsStep(prev,at(-9.65001,-35.700005,9,6000))).toBe(null);
});
test('ignora saltos implausíveis, coordenadas sem precisão e duplicatas',()=>{
 const prev=at(-9.65,-35.70,6,1000);
 expect(filterGpsStep(prev,at(-9.64,-35.70,6,3000))).toBe(null);
 expect(filterGpsStep(prev,at(-9.649, -35.70,150,5000))).toBe(null);
 expect(filterGpsStep(prev,at(-9.649,-35.70,5,1000))).toBe(null);
});
test('aceita deslocamento real com precisão boa e velocidade plausível',()=>{
 const prev=at(-9.65,-35.70,5,1000);
 const d=filterGpsStep(prev,at(-9.6495,-35.70,5,11000));
 expect(d).toBeGreaterThan(0.05);expect(d).toBeLessThan(0.07);
});