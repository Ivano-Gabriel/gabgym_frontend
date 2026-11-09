/** QA only — read-only CORS preflight; no more synthetic account creation on each CI. */
const api='https://gabgym-backend-java-v2.onrender.com';
const origin='https://gabgym-frontend-git-test-gabgym-personal-n-09dadb-gabriel-team3.vercel.app';
const request=async (name,target,options)=>{
 const res=await fetch(target,{redirect:'manual',signal:AbortSignal.timeout(45000),...options});
 console.log(JSON.stringify({check:name,status:res.status,allowOrigin:res.headers.get('access-control-allow-origin')||null}));
 return res;
};
const ping=await request('Render ping',api+'/ping');
if(ping.status!==200)throw new Error('Render API não está pronta');
const approved=await request('QA preflight',api+'/api/users/register-personal',{
 method:'OPTIONS',headers:{
  Origin:origin,
  'Access-Control-Request-Method':'POST',
  'Access-Control-Request-Headers':'content-type'
 }
});
if(approved.status!==200||approved.headers.get('access-control-allow-origin')!==origin)
 throw new Error('CORS para QA protegido não está ativo');
const untrusted=await request('unknown origin blocked',api+'/api/users/register-personal',{
 method:'OPTIONS',headers:{
  Origin:'https://untrusted.example',
  'Access-Control-Request-Method':'POST',
  'Access-Control-Request-Headers':'content-type'
 }
});
if(untrusted.headers.has('access-control-allow-origin'))
 throw new Error('CORS liberou origem desconhecida');
