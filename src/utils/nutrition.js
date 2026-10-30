/** Agregacao do diario persistido pela API, sem dados ficticios. */
export function dayKey(date = new Date()) {
  const pad = number => String(number).padStart(2, '0');
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}
const safeNumber = value => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
export function summarizeDay(logs = []) {
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, meals: 0 };
  for (const row of logs) {
    if (row.type === 'food') {
      total.calories += safeNumber(row.calories);
      total.protein += safeNumber(row.protein);
      total.carbs += safeNumber(row.carbs);
      total.fat += safeNumber(row.fat);
      total.meals += 1;
    }
    if (row.type === 'water') total.water += safeNumber(row.volume);
  }
  total.calories = Math.round(total.calories);
  for (const key of ['protein', 'carbs', 'fat']) total[key] = Math.round(total[key] * 10) / 10;
  return total;
}
export function isValidServingCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0.25 && n <= 20;
}
export function scaleFood(food, servings) {
  if (!isValidServingCount(servings)) throw new Error('Número de porções inválido.');
  const n = Number(servings);
  const scale = prop => Math.round((Number(food[prop]) || 0) * n * 10) / 10;
  return { calories: Math.round((Number(food.calories) || 0) * n), protein: scale('protein'), carbs: scale('carbs'), fat: scale('fat') };
}

/** Referencia de massa confiavel do catalogo. Nunca adivinha massa da unidade. */
export function parseReferenceGrams(food) {
  const parse = value => {
    const match = /^\\s*(?:aprox\\.?\\s*)?(\\d+(?:[.,]\\d+)?)\\s*g(?:ramas)?\\s*$/i.exec(String(value || ''));
    return match ? Number(match[1].replace(',', '.')) : null;
  };
  const amount = parse(food.unit) ?? parse(food.servingDesc);
  return amount && amount > 0 ? amount : null;
}
export function scaleFoodGrams(food, grams) {
  const ref = parseReferenceGrams(food);
  const n = Number(grams);
  if (!ref || !Number.isFinite(n) || n < 1 || n > 3000) throw new Error('Referência de gramas indisponível ou quantidade inválida.');
  const multiplier = n / ref;
  return {
    calories: Math.round((Number(food.calories) || 0) * multiplier),
    protein: Math.round((Number(food.protein) || 0) * multiplier * 10) / 10,
    carbs: Math.round((Number(food.carbs) || 0) * multiplier * 10) / 10,
    fat: Math.round((Number(food.fat) || 0) * multiplier * 10) / 10,
  };
}
export function calorieProgress(consumed, goal) {
  const c = Number(consumed), g = Number(goal);
  if (!Number.isFinite(c) || !Number.isFinite(g) || g <= 0) return null;
  const ratio = Math.max(0, c) / g;
  return { percent: Math.min(100, Math.round(ratio * 100)),
    remaining: Math.round(g - c),
    stage: ratio > 1 ? 'over' : ratio >= 0.9 ? 'near' : ratio >= 0.5 ? 'half' : 'start' };
}
/** Estimativa de repouso (Harris-Benedict); NAO e meta de ingestao diaria. */
export function estimateRestingEnergy(user) {
  if (!user || !['male','female'].includes(user.gender)) return null;
  const w = Number(user.weight), h = Number(user.height), a = Number(user.age);
  if (!(w > 0 && h > 0 && a > 0) || ![w,h,a].every(Number.isFinite)) return null;
  return Math.round(user.gender === 'male'
    ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
    : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a);
}
