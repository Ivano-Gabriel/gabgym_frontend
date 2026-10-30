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
