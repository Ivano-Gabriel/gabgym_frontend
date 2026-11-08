import { dayKey } from './nutrition';

export function greetingFor(user) {
  for (const candidate of [user?.name,user?.username]) {
    if (typeof candidate !== 'string') continue;
    const first = candidate.trim().split(/\s+/)[0];
    // APIs antigas às vezes retornam ID no campo "name".
    if (first && first.length <= 30 && /[A-Za-zÀ-ÿ]/.test(first) && !first.includes('@')) {
      return 'Continue, ' + first + '.';
    }
  }
  return 'O importante é continuar.';
}

export function makeWaterEntry(userId, volume, date = dayKey(), timestamp = Date.now()) {
  if (!Number.isSafeInteger(Number(userId)) || Number(userId) <= 0 || ![250,500].includes(volume)) {
    throw new Error('Registro de água inválido');
  }
  return {userId:Number(userId),type:'water',name:'Água',volume,
    calories:0,protein:0,carbs:0,fat:0,logDate:date,timestamp};
}

export function recentFoodsToday(logs, max = 2) {
  if (!Array.isArray(logs)) return [];
  return logs.filter(x=>x?.type==='food' && typeof x.name==='string' && x.name.trim())
    .slice().reverse().slice(0,Math.max(0,Math.min(5,max)));
}
