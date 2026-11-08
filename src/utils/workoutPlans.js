import { dayKey } from './nutrition';

const planKey = userId => 'gabgym:workout-plans:' + Number(userId);
const historyKey = userId => 'gabgym:workout-sessions:' + Number(userId);
const validUser = id => Number.isSafeInteger(Number(id)) && Number(id)>0;
const safeStorage = () => typeof localStorage !== 'undefined' ? localStorage : null;
const nameOk = value => typeof value === 'string' && value.trim().length>=2 && value.trim().length<=60;
const validSet = set => {
  const reps=Number(set?.reps),weight=Number(set?.weightKg);
  return set?.reps!=='' && Number.isInteger(reps) && reps>=1 && reps<=100 &&
    Number.isFinite(weight) && weight>=0 && weight<=500;
};

export function summarizeWorkout(exercises) {
  if(!Array.isArray(exercises)) throw new Error('Lista de exercícios inválida');
  let totalSets=0,completedSets=0,volume=0,exerciseCount=0;
  exercises.forEach(ex=>{
    const completed=(Array.isArray(ex.sets)?ex.sets:[]).filter(set=>set.done);
    if(completed.length) exerciseCount++;
    totalSets+=(Array.isArray(ex.sets)?ex.sets.length:0);
    completed.forEach(set=>{
      if(!validSet(set)) throw new Error('Confira repetições e carga das séries concluídas.');
      completedSets++;
      volume+=Number(set.reps)*Number(set.weightKg);
    });
  });
  return {exerciseCount,totalSets,completedSets,volumeKg:Math.round(volume*10)/10};
}

function validWorkout(name,exercises) {
  if(!nameOk(name)||!Array.isArray(exercises)||!exercises.length||exercises.length>20) {
    throw new Error('Defina um nome e pelo menos um exercício.');
  }
  exercises.forEach(ex=>{
    if(!nameOk(ex.name)||!Array.isArray(ex.sets)||!ex.sets.length||ex.sets.length>15) {
      throw new Error('Confira os exercícios e as séries da ficha.');
    }
    ex.sets.forEach(set=>{if(!validSet(set)) throw new Error('Repetições devem ser 1–100 e carga 0–500 kg.');});
  });
}

export function buildWorkoutDiaryEntry(userId,name,exercises,minutes,date=dayKey(),timestamp=Date.now()) {
  if(!validUser(userId)) throw new Error('Usuário inválido.');
  validWorkout(name,exercises);
  const mins=Number(minutes);
  if(!Number.isInteger(mins)||mins<1||mins>600) throw new Error('Informe a duração em minutos (1–600).');
  const stats=summarizeWorkout(exercises);
  if(!stats.completedSets) throw new Error('Marque ao menos uma série concluída.');
  const label=(name.trim().slice(0,29)+' · '+stats.exerciseCount+' ex / '+
    stats.completedSets+' séries ('+mins+' min)').slice(0,60);
  // O endpoint /logs atual NÃO aceita séries detalhadas/cargas: persistir resumo e kcal=0.
  return {userId:Number(userId),type:'exercise',name:label,calories:0,logDate:date,timestamp};
}

function templateClean(input) {
  if(!input||!Number.isInteger(Number(input.restSeconds))||
    Number(input.restSeconds)<0||Number(input.restSeconds)>600) throw new Error('Descanso deve ser de 0 a 600 segundos.');
  validWorkout(input.name,input.exercises);
  return {name:input.name.trim(),restSeconds:Number(input.restSeconds),
    exercises:input.exercises.map((ex,i)=>({
      id:typeof ex.id==='string'?ex.id.slice(0,50):'ex-'+i,
      name:ex.name.trim(),
      sets:ex.sets.map((set,j)=>({
        id:typeof set.id==='string'?set.id.slice(0,50):'s-'+i+'-'+j,
        reps:String(set.reps),weightKg:String(set.weightKg),done:false
      }))
    }))
  };
}
export function readWorkoutTemplates(userId,storage=safeStorage()) {
  if(!validUser(userId)||!storage) return [];
  try {
    const raw=JSON.parse(storage.getItem(planKey(userId))||'[]');
    return Array.isArray(raw)?raw.slice(0,6).flatMap(p=>{
      try {return [templateClean(p)];} catch {return [];}
    }):[];
  } catch {return [];}
}
export function saveWorkoutTemplate(userId,plan,storage=safeStorage()) {
  if(!validUser(userId)||!storage) throw new Error('Armazenamento indisponível.');
  const cleaned=templateClean(plan);
  const current=readWorkoutTemplates(userId,storage);
  const next=[cleaned,...current.filter(p=>p.name.toLocaleLowerCase('pt-BR')!==
    cleaned.name.toLocaleLowerCase('pt-BR'))].slice(0,6);
  storage.setItem(planKey(userId),JSON.stringify(next));
  return next;
}
export function deleteWorkoutTemplate(userId,name,storage=safeStorage()) {
  if(!validUser(userId)||!storage) throw new Error('Armazenamento indisponível.');
  const next=readWorkoutTemplates(userId,storage).filter(p=>p.name!==name);
  storage.setItem(planKey(userId),JSON.stringify(next));
  return next;
}
export function readWorkoutSessions(userId,storage=safeStorage()) {
  if(!validUser(userId)||!storage) return [];
  try {const parsed=JSON.parse(storage.getItem(historyKey(userId))||'[]');
    return Array.isArray(parsed)?parsed.slice(0,50):[];
  } catch {return [];}
}
export function appendWorkoutSession(userId,session,storage=safeStorage()) {
  if(!validUser(userId)||!storage) throw new Error('Armazenamento indisponível.');
  const minutes=Number(session?.minutes);
  buildWorkoutDiaryEntry(userId,session?.name,session?.exercises,minutes);
  const stored={name:session.name.trim(),minutes,recordedAt:session.recordedAt||Date.now(),
    exercises:session.exercises.map(ex=>({name:ex.name,sets:ex.sets.map(set=>({
      reps:String(set.reps),weightKg:String(set.weightKg),done:Boolean(set.done)
    }))}))};
  const next=[stored,...readWorkoutSessions(userId,storage)].slice(0,50);
  storage.setItem(historyKey(userId),JSON.stringify(next));
  return next;
}
