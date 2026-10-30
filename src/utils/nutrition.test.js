import { dayKey, summarizeDay, scaleFood, isValidServingCount } from './nutrition';

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
