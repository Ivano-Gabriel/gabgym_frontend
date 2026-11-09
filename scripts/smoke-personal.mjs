import { randomBytes } from 'node:crypto';

const targets=[
  {name:'Render direto (Neon de testes)',base:'https://gabgym-backend-java-v2.onrender.com'},
  {name:'Vercel preview (Neon via /api)',base:'https://gabgym-frontend-60qt02ayl-gabriel-team3.vercel.app'}
];
for(const target of targets) {
 const username='smoke_'+Date.now().toString(36)+'_'+randomBytes(3).toString('hex');
 const password='QaTest!'+randomBytes(16).toString('hex');
 for(const [action,path,method] of [['ping','/ping','GET'],['cadastro','/api/users/register-personal','POST']]){
  try {
   const response=await fetch(target.base+path,{
    method,headers:method==='POST'?{'Content-Type':'application/json'}:{},
    body:method==='POST'?JSON.stringify({username,password}):undefined,
    redirect:'manual',signal:AbortSignal.timeout(145000)
   });
   const data=await response.text();
   console.log(JSON.stringify({target:target.name,action,status:response.status,
     contentType:response.headers.get('content-type'),
     server:response.headers.get('server'),
     redirect:response.headers.get('location')?.split('?')[0] || null,
     json:data.trimStart().startsWith('{'),
     html:data.trimStart().startsWith('<'),
     vercel:!!response.headers.get('x-vercel-id'),
     render:!!response.headers.get('rndr-id')
   }));
  } catch(e){console.log(JSON.stringify({target:target.name,action,error:e.name}));}
 }
}
