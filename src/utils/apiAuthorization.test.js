import {isPublicIdentityRoute} from './apiAuthorization';
test('cadastro Personal, cadastro de aluno e login nunca recebem Bearer de sessão antiga',()=>{
  for(const path of ['/users/login','/users/register','/users/register-personal'])
    expect(isPublicIdentityRoute(path)).toBe(true);
  for(const path of ['/users/me','/personal/coach/students','/personal/student/connection'])
    expect(isPublicIdentityRoute(path)).toBe(false);
});
