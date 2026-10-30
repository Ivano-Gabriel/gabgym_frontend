import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NutritionTodayPage from './NutritionTodayPage';
import { getCurrentUser, getFoods, getDiaryLogs, addDiaryLog, deleteDiaryLog } from '../services/apiService';

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
}));
jest.mock('../services/apiService', () => ({
  getCurrentUser: jest.fn(),
  getFoods: jest.fn(),
  getDiaryLogs: jest.fn(),
  addDiaryLog: jest.fn(),
  deleteDiaryLog: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.removeItem('gabgym:daily-goal:17');
  localStorage.removeItem('gabgym:water-goal:17');
  getCurrentUser.mockResolvedValue({ data: { id: 17, username: 'aluno-teste' } });
  getFoods.mockResolvedValue({ data: [{
    id: 1, name: 'Ovo cozido', calories: 78, protein: 6, carbs: 1, fat: 5,
    servingDesc: '1 unidade', category: { name: 'Proteínas' },
  }] });
  getDiaryLogs.mockResolvedValue({ data: [] });
  addDiaryLog.mockResolvedValue({ data: { id: 33 } });
  deleteDiaryLog.mockResolvedValue({ data: null });
});

test('aluno autenticado pode registrar alimento no banco com 2 porções', async () => {
  render(<NutritionTodayPage />);
  fireEvent.click(await screen.findByRole('button', { name: /Ovo cozido/i }));
  const amount = screen.getByRole('spinbutton', { name: /Quantidade de porções/i });
  fireEvent.change(amount, { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: /REGISTRAR NO DIÁRIO/i }));
  await waitFor(() => expect(addDiaryLog).toHaveBeenCalledTimes(1));
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({
    userId: 17, type: 'food', calories: 156, protein: 12, carbs: 2, fat: 10,
  }));
});

test('água registra volume sem atribuir calorias', async () => {
  render(<NutritionTodayPage />);
  fireEvent.click(await screen.findByRole('button', { name: '+ 250 ML' }));
  await waitFor(() => expect(addDiaryLog).toHaveBeenCalledTimes(1));
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({
    type: 'water', volume: 250, calories: 0, protein: 0,
  }));
});

test('bife pesando 180g utiliza referencia de 100g e salva 450 kcal', async () => {
  getFoods.mockResolvedValueOnce({ data: [{
    id: 2, name: 'Bife Grelhado', unit: '100g', servingDesc: '1 bife',
    imagePath: '/imagens_comidas/bife.jpg', calories: 250, protein: 26, carbs: 0, fat: 17,
    category: { name: 'Proteínas' },
  }] });
  render(<NutritionTodayPage />);
  fireEvent.click(await screen.findByRole('button', { name: /Bife Grelhado/i }));
  expect(document.querySelector('img.gg-daily-food-photo')?.getAttribute('src')).toBe('/imagens_comidas/bife.jpg');
  fireEvent.click(screen.getByRole('button', { name: /BALANÇA \/ GRAMAS/i }));
  fireEvent.change(screen.getByRole('spinbutton', { name: /Peso em gramas/i }), { target: { value: '180' } });
  fireEvent.click(screen.getByRole('button', { name: /REGISTRAR NO DIÁRIO/i }));
  await waitFor(() => expect(addDiaryLog).toHaveBeenCalled());
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({
    calories: 450, protein: 46.8, name: expect.stringContaining('180 g'),
  }));
});
test('registro manual aceita nome, gramas e kcal sem inventar macros', async () => {
  render(<NutritionTodayPage />);
  fireEvent.click(await screen.findByRole('button', { name: /REGISTRAR ALIMENTO MANUALMENTE/i }));
  fireEvent.change(screen.getByPlaceholderText('Ex.: caviar'), { target: { value: 'Caviar' } });
  fireEvent.change(screen.getByPlaceholderText('150'), { target: { value: '150' } });
  fireEvent.change(screen.getByPlaceholderText('400'), { target: { value: '400' } });
  fireEvent.click(screen.getByRole('button', { name: /ADICIONAR AO DIÁRIO/i }));
  await waitFor(() => expect(addDiaryLog).toHaveBeenCalled());
  expect(addDiaryLog.mock.calls[0][0]).toEqual(expect.objectContaining({
    name: 'Caviar (150 g — manual)', calories: 400, protein: 0, carbs: 0, fat: 0,
  }));
});
