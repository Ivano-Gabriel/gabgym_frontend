import {EXERCISE_LIBRARY} from '../data/workoutDatabase';

/** Biblioteca já existente, sem dados fictícios nem dependências externas. */
export const workoutGroups=Array.from(new Set(Object.values(EXERCISE_LIBRARY)
  .map(x=>x.muscleGroup).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR'));

const normalize = x => String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

export function workoutSuggestions(query='',group='',max=6) {
  const q=normalize(query),g=normalize(group);
  return Object.values(EXERCISE_LIBRARY).filter(x=>
    (!g||normalize(x.muscleGroup)===g) &&
    (!q||normalize(x.name).includes(q)) &&
    typeof x.name==='string' && x.name.length>1
  ).slice(0,Math.max(0,Math.min(20,max))).map(x=>({
    id:x.id,name:x.name,group:x.muscleGroup
  }));
}

export function lastExerciseResult(sessions,exerciseName) {
  if(!Array.isArray(sessions)||!exerciseName)return null;
  const target=normalize(exerciseName);
  for(const session of sessions){
    for(const exercise of Array.isArray(session?.exercises)?session.exercises:[]){
      if(normalize(exercise.name)!==target)continue;
      const valid=(Array.isArray(exercise.sets)?exercise.sets:[]).filter(set=>
        set?.done && Number.isFinite(Number(set.weightKg)) &&
        Number.isFinite(Number(set.reps)) && Number(set.reps)>0 &&
        Number(set.weightKg)>=0
      );
      if(!valid.length)continue;
      return {weightKg:Math.max(...valid.map(s=>Number(s.weightKg))),
        totalSets:valid.length,
        volumeKg:Math.round(valid.reduce((sum,s)=>sum+Number(s.weightKg)*Number(s.reps),0)*10)/10,
        recordedAt:session.recordedAt};
    }
  }
  return null;
}
