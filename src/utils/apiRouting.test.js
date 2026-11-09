import { chooseApiBaseUrl } from './apiRouting';
import config from '../../vercel.json';

test('QA preview protegido chama Neon direto para não ser bloqueado pelo proxy Vercel', () => {
  expect(chooseApiBaseUrl('production', 'https://gabgym-api-piloto-us.onrender.com/api'))
    .toBe('https://gabgym-backend-java-v2.onrender.com/api');
  expect(chooseApiBaseUrl('development', undefined)).toBe('http://localhost:8080/api');
  expect(chooseApiBaseUrl('development', 'https://api.example.com/api'))
    .toBe('https://api.example.com/api');
});
test('PREVIEW ISOLADO: Vercel aponta para Neon, não para a API piloto de produção', () => {
  expect(config.rewrites[0]).toEqual({
    source: '/api/:path*',
    destination: 'https://gabgym-backend-java-v2.onrender.com/api/:path*',
  });
  expect(config.rewrites[1]).toEqual({
    source: '/ping',
    destination: 'https://gabgym-backend-java-v2.onrender.com/ping',
  });
  expect(config.rewrites[2]).toEqual({ source: '/:path*', destination: '/index.html' });
  expect(config).not.toHaveProperty('headers');
});
