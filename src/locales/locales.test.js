import pt from './pt.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

test('português, inglês, espanhol e francês oferecem as mesmas chaves centrais',()=>{
 const locales=[pt,en,es,fr];
 for(const locale of locales) {
   for(const area of ['nav','experience','settings','auth','simple','journal','today','profilePage','training','profileEditor']){
     expect(Object.keys(locale[area]).sort()).toEqual(Object.keys(pt[area]).sort());
     expect(Object.values(locale[area]).every(value=>typeof value==='string'&&value.length>0)).toBe(true);
   }
 }
});

test('journal translations preserve interpolation placeholders',()=>{
 for(const locale of [en,es,fr]){
  for(const key of ['daysLoaded','remove','deleteLabel']){
   expect(locale.journal[key].match(/\{\{\w+\}\}/g)).toEqual(pt.journal[key].match(/\{\{\w+\}\}/g));
  }
 }
});
