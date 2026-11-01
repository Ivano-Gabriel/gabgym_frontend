export const PERSONAL_GOALS=['reduzir gordura','manter peso','ganhar massa','melhorar condicionamento'];
export const PERSONAL_FOCUS=['musculacao','cardio','misto'];
export function sanitizePersonalBrief(value){
 const x=value&&typeof value==='object'?value:{};
 const days=String(x.days??'');
 return {
  goal:PERSONAL_GOALS.includes(x.goal)?x.goal:'',
  focus:PERSONAL_FOCUS.includes(x.focus)?x.focus:'',
  days:/^[1-7]$/.test(days)?days:'',
  notes:typeof x.notes==='string'?x.notes.slice(0,280):''
 };
}
export function personalBriefKey(id){
 return id===undefined||id===null||id===''?null:'gabgym:personal-brief:'+String(id);
}
