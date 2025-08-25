// src/utils/MetabolismCalculator.js (Versão Turbinada)

// Harris-Benedict Equation for BMR
export const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// =================================================================
// A GRANDE MUDANÇA ESTÁ AQUI!
// O TDEE agora recebe o 'activityLevel' e usa o multiplicador correto.
// =================================================================
export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  };
  
  const multiplier = multipliers[activityLevel] || 1.55; // Usa 'moderate' como padrão
  return bmr * multiplier;
};

// Macro calculation based on TDEE, objective, and weight
export const calculateMacros = (tdee, objective, weight) => {
  let calorieTarget = tdee;
  
  if (objective === 'lose-fat') {
    calorieTarget -= 500; // Déficit de 500 kcal para perda de gordura
  } else if (objective === 'gain-muscle') {
    calorieTarget += 300; // Superávit de 300 kcal para ganho de massa
  }

  // Distribuição de macros
  const proteinGrams = weight * 2; // 2g de proteína por kg de peso corporal
  const proteinCalories = proteinGrams * 4;

  const fatGrams = weight * 0.8; // 0.8g de gordura por kg
  const fatCalories = fatGrams * 9;

  const carbCalories = calorieTarget - proteinCalories - fatCalories;
  const carbGrams = carbCalories / 4;

  return {
    calories: Math.round(calorieTarget),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbGrams),
    fat: Math.round(fatGrams),
  };
};

// ... (as outras funções de cálculo, como de água e sono, continuam iguais) ...
export const calculateWaterIntake = (weight) => {
    return Math.round(weight * 35);
};

export const calculateSleepDuration = (sleepTime, wakeTime) => {
  if (!sleepTime || !wakeTime) return null;
  const [sleepH, sleepM] = sleepTime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);
  let sleepDate = new Date(2025, 1, 1, sleepH, sleepM);
  let wakeDate = new Date(2025, 1, 2, wakeH, wakeM);
  if (wakeH < sleepH) { // Se acordou no "dia seguinte"
    // Já está correto
  } else { // Se acordou no mesmo dia (ex: dormiu 01:00, acordou 08:00)
    wakeDate.setDate(wakeDate.getDate() - 1);
  }
  const diffMs = wakeDate - sleepDate;
  if (diffMs < 0) { // Lógica para o caso de dormir e acordar no mesmo dia
      wakeDate.setDate(wakeDate.getDate() + 1);
      const newDiff = wakeDate - sleepDate;
      const totalMinutes = Math.round(newDiff / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return { formatted: `${hours}h ${String(minutes).padStart(2, '0')}min`, totalMinutes };
  }
  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { formatted: `${hours}h ${String(minutes).padStart(2, '0')}min`, totalMinutes };
};