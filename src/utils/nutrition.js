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
