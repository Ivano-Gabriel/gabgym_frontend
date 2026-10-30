import { dayKey, summarizeDay } from './nutrition';

const positive = value => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Usa calendário local; evita mudar o dia ao converter para UTC. */
export function buildRecentDays(base = new Date(), count = 7) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i, 12);
    days.push({
      key: dayKey(date),
      label: i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(date).replace('.', ''),
      dateLabel: new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(date).replace('.', '')
    });
  }
  return days;
}

/** Alimentação não compensa treino. Apenas resultados de logs reais. */
export function summarizeHistoryDay(logs = []) {
  const items = Array.isArray(logs) ? logs : [];
  const food = summarizeDay(items.map(item => ({...item,
    calories: item.type === 'food' ? positive(item.calories) : item.calories,
    volume: item.type === 'water' ? positive(item.volume) : item.volume
  })));
  const movement = items.filter(item => ['cardio','exercise'].includes(item.type));
  const movementCalories = Math.round(movement.reduce((sum,row) => sum + positive(row.calories),0));
  const movementMinutes = Math.round(movement.reduce((sum,row) => sum + positive(row.durationSeconds),0)/60);
  const distanceKm = Math.round(movement.filter(row=>row.type==='cardio')
    .reduce((sum,row)=>sum+positive(row.distanceKm),0)*100)/100;
  return {...food,movementCalories,movementMinutes,distanceKm,activities:movement.length,entries:items.length};
}
