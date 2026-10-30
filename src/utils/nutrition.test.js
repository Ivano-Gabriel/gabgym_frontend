import { dayKey, summarizeDay, scaleFood, isValidServingCount, parseReferenceGrams, scaleFoodGrams, calorieProgress, estimateRestingEnergy } from './nutrition';

describe('diário nutricional: dados reais por dia', () => {
  it('usa data local e nao o dia UTC', () => {
    expect(dayKey(new Date(2026, 9, 30, 23, 55))).toBe('2026-10-30');
  });
  it('separa alimento de exercício e água sem confundir déficit', () => {
    const daily = summarizeDay([
      { type: 'food', calories: 180, protein: 8.5, carbs: 21, fat: 6 },
      { type: 'food', calories: 120, protein: 10, carbs: 6, fat: 3 },
      { type: 'exercise', calories: -200 },
      { type: 'water', volume: 250 },
      { type: 'water', volume: 500 },
    ]);
    expect(daily).toEqual({ calories: 300, protein: 18.5, carbs: 27, fat: 9, water: 750, meals: 2 });
  });
  it('escala porcoes de alimento do catalogo sem arredondar demais os macros', () => {
    expect(scaleFood({ calories: 123, protein: 3.9, carbs: 20.4, fat: 2 }, 1.5)).toEqual({
      calories: 185, protein: 5.9, carbs: 30.6, fat: 3,
    });
  });
  it('recusa porcoes invalidas e excessivas', () => {
    expect(isValidServingCount(0)).toBe(false);
    expect(isValidServingCount(-1)).toBe(false);
    expect(isValidServingCount(101)).toBe(false);
    expect(isValidServingCount(1.5)).toBe(true);
  });
});

test('balança usa a referência do catálogo e calcula 180g de bife com base em 100g', () => {
  const bife = { name: 'Bife grelhado', unit: '100g', servingDesc: '1 bife', calories: 250, protein: 26, carbs: 0, fat: 17 };
  expect(parseReferenceGrams(bife)).toBe(100);
  expect(scaleFoodGrams(bife, 180)).toEqual({ calories: 450, protein: 46.8, carbs: 0, fat: 30.6 });
});
test('balança não inventa equivalência para um ovo por unidade', () => {
  const ovo = { unit: '1 unidade', servingDesc: '1 ovo grande', calories: 78 };
  expect(parseReferenceGrams(ovo)).toBe(null);
  expect(() => scaleFoodGrams(ovo, 180)).toThrow();
});
test('progresso separa zero, metade, proximidade e acima da meta', () => {
  expect(calorieProgress(0, 2000).percent).toBe(0);
  expect(calorieProgress(1000, 2000).percent).toBe(50);
  expect(calorieProgress(1950, 2000).stage).toBe('near');
  expect(calorieProgress(2100, 2000).stage).toBe('over');
  expect(calorieProgress(2000, 0)).toBe(null);
});
test('energia de repouso não multiplica por atividade nem vira meta automática', () => {
  expect(estimateRestingEnergy({ gender: 'male', weight: 80, height: 180, age: 30 })).toBeGreaterThan(1700);
  expect(estimateRestingEnergy({ gender: 'male', weight: 80, height: 180, age: 30, activityLevel: 'very_active' }))
    .toBe(estimateRestingEnergy({ gender: 'male', weight: 80, height: 180, age: 30, activityLevel: 'sedentary' }));
});
