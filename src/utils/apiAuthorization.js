// Login e cadastro são rotas públicas no servidor: nunca anexar JWT de outra sessão.
export const isPublicIdentityRoute = path => [
  '/users/login','/users/register','/users/register-personal'
].includes(path);
