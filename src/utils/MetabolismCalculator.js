// src/utils/MetabolismCalculator.js

// Fórmula de Harris-Benedict (Revisada) - USA ALTURA EM CM
export const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};
  
// Fator de atividade fixo de 1.55 (moderadamente ativo)
export const calculateTDEE = (bmr, activityFactor = 1.55) => {
  return bmr * activityFactor;
};
  
// Calcula as metas de calorias e macros com base no TDEE
export const calculateMacros = (tdee, objective) => {
  let targetCalories = tdee;

  if (objective === 'gain-muscle') {
    targetCalories += 300; // Superávit para ganho
  } else if (objective === 'lose-fat') {
    targetCalories -= 400; // Déficit para perda
  }
  // Para 'maintain-weight', as calorias são o próprio TDEE

  // Divisão de Macros: 35% Proteína, 40% Carbo, 25% Gordura
  const proteinGrams = Math.round((targetCalories * 0.35) / 4);
  const carbsGrams = Math.round((targetCalories * 0.40) / 4);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  
  return {
    calories: Math.round(targetCalories),
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
    objective: objective, // Passando o objetivo para uso futuro
  };
};

// --- Outras funções que já estavam corretas ---

export const calculateWaterIntake = (weight) => {
    return Math.round(weight * 35);
};

export const calculateSleepDuration = (sleepTime, wakeTime) => {
    if (!sleepTime || !wakeTime) return null;
    const [sleepH, sleepM] = sleepTime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);
    let sleepDate = new Date();
    sleepDate.setHours(sleepH, sleepM, 0, 0);
    let wakeDate = new Date();
    wakeDate.setHours(wakeH, wakeM, 0, 0);
    if (wakeDate < sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
    const durationMillis = wakeDate - sleepDate;
    const durationMinutes = Math.floor(durationMillis / 60000);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return {
      totalMinutes: durationMinutes,
      formatted: `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min`,
    };
};

export const calculateCardioCalories = (metValue, userWeight, durationInSeconds) => {
    if (!metValue || !userWeight || !durationInSeconds) return 0;
    const durationInMinutes = durationInSeconds / 60;
    const caloriesBurned = (metValue * userWeight * 3.5) / 200 * durationInMinutes;
    return Math.round(caloriesBurned);
};