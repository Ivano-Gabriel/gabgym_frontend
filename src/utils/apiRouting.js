/** Primeiro domínio na Vercel: evita OPTIONS/preflight a cada preview.
 * A API permanece protegida por JWT e autorizações no backend.
 * O proxy não faz cache de dados privados.
 */
export function chooseApiBaseUrl(env, configuredUrl) {
  if (env === 'production') return '/api';
  return configuredUrl || 'http://localhost:8080/api';
}
