import { nutritionLegacyAliases, nutritionHome } from './nutritionRoutes';

test('todos os três atalhos legados levam ao diário alimentar consolidado', () => {
  expect(nutritionHome).toBe('/alimentacao');
  expect(nutritionLegacyAliases).toEqual(expect.arrayContaining([
    '/dietas', '/diario-alimentar', '/biblioteca-alimentos',
  ]));
  expect(new Set(nutritionLegacyAliases).size).toBe(3);
});
