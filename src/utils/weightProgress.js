/** Evolução registrada no dispositivo; não usar peso anterior imaginado. */
export function weightTrend(entries) {
  const values=(Array.isArray(entries)?entries:[]).filter(x=>typeof x.date==='string'&&Number(x.weight)>0)
    .slice().sort((a,b)=>a.date.localeCompare(b.date));
  if(!values.length)return null;
  const starting=Number(values[0].weight),latest=Number(values[values.length-1].weight);
  return {starting,latest,change:Math.round((latest-starting)*10)/10};
}
/** 0–100% apenas para deslocamento em direção à meta; não premiar regresso. */
export function weightGoalProgress(starting,current,goal) {
  const s=Number(starting),c=Number(current),g=Number(goal);
  if (![s,c,g].every(n=>Number.isFinite(n) && n>0)) return null;
  if (s===g) return c===g ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round(100*(c-s)/(g-s))));
}
/** Apenas cenário matemático a partir de tendência observada; não é promessa clínica. */
export function safeWeightProjection(current,target,weeklyTrend) {
  const c=Number(current),t=Number(target),w=Number(weeklyTrend);
  if(![c,t,w].every(Number.isFinite)||c<=0||t<=0||!w||Math.abs(w)>1.5)return null;
  if((t-c)*w<=0)return null;
  const weeks=Math.ceil(Math.abs(t-c)/Math.abs(w));
  if(weeks>156)return null;
  return {weeks,days:weeks*7};
}
export const loadWeightHistory = userId => {
  try{ const rows=JSON.parse(localStorage.getItem('gabgym:weight-history:'+userId)||'[]');
    return Array.isArray(rows)?rows:[]; }catch{return [];}
};
export function persistWeightMeasurement(userId,weight,date) {
  if(!userId||!Number.isFinite(weight)||weight<=0)return;
  const history=loadWeightHistory(userId).filter(item=>item.date!==date);
  history.push({date,weight});
  history.sort((a,b)=>a.date.localeCompare(b.date));
  localStorage.setItem('gabgym:weight-history:'+userId,JSON.stringify(history.slice(-150)));
  return history;
}