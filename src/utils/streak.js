/** Um dia válido exige ação persistida na API; visita à página não conta. */
export const activeDay = logs => Array.isArray(logs) &&
  logs.some(item => ['food','water','cardio','exercise'].includes(item?.type));
/** Ordem: hoje, ontem, anteontem... Últimos sete dias são a janela mínima disponível. */
export function computeStreak(activeDays){
  if(!Array.isArray(activeDays)||activeDays.length===0)return {days:0,atRisk:false,capped:false};
  const atRisk = !activeDays[0] && !!activeDays[1];
  let count=0,offset=atRisk?1:0;
  while(offset+count<activeDays.length && activeDays[offset+count])count++;
  return {days:count,atRisk,capped:count===activeDays.length};
}