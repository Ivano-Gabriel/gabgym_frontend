import { chooseApiBaseUrl } from './apiRouting';
import config from '../../vercel.json';

test('deploy Vercel usa mesmo dominio para chamadas API, sem CORS de preview', () => {
  expect(chooseApiBaseUrl('production', 'https://gabgym-api-piloto-us.onrender.com/api'))
    .toBe('/api');
  expect(chooseApiBaseUrl('development', undefined)).toBe('http://localhost:8080/api');
  expect(chooseApiBaseUrl('development', 'https://api.example.com/api'))
    .toBe('https://api.example.com/api');
});
test('Vercel encaminha /api e /ping ao piloto antes do fallback React', () => {
  expect(config.rewrites[0]).toEqual({
    source: '/api/:path*',
    destination: 'https://gabgym-api-piloto-us.onrender.com/api/:path*',
  });
  expect(config.rewrites[1]).toEqual({
    source: '/ping',
    destination: 'https://gabgym-api-piloto-us.onrender.com/ping',
  });
  expect(config.rewrites[2]).toEqual({ source: '/:path*', destination: '/index.html' });
  expect(config).not.toHaveProperty('headers');
});
