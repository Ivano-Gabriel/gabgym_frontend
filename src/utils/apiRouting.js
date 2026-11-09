/** Exclusivo da branch de homologação Personal (Neon).
 * Usar API diretamente porque Vercel Authentication bloqueia POST no proxy do preview.
 * NÃO mesclar esta branch: a produção deve continuar na API piloto.
 */
export function chooseApiBaseUrl(env,configuredUrl) {
  if(env==='production')return 'https://gabgym-backend-java-v2.onrender.com/api';
  return configuredUrl||'http://localhost:8080/api';
}
