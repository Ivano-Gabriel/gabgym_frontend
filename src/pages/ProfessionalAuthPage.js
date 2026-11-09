import React,{useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {clearAuthSession} from '../utils/auth';
import {registerProfessional,loginUser,warmUpApi} from '../services/apiService';
import AuthShell from './AuthShell';
import {useApiReady} from '../hooks/useApiReady';
import ApiWakeNotice from '../components/ApiWakeNotice';

/** A mesma autenticação JWT do GabGym, mas com conta e experiência PERSONAL. */
export default function ProfessionalAuthPage({mode='login'}) {
  const signup=mode==='signup';
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const navigate=useNavigate();
  const connection=useApiReady();
  useEffect(()=>{warmUpApi();},[]);

  const submit=async e=>{
    e.preventDefault();
    if(loading||!connection.ready)return;
    setLoading(true);setError('');
    try {
      if(signup){
        await registerProfessional({username:username.trim(),password});
        navigate('/login-personal',{replace:true});
      } else {
        const response=await loginUser({username:username.trim(),password,codigoMfa:null});
        if(response.data.role!=='PERSONAL'){
          clearAuthSession();
          setError('Esta conta pertence à área de aluno ou administrativa. Use o acesso correspondente.');
          return;
        }
        navigate('/painel-personal',{replace:true});
      }
    }catch(err){
      if(err.response?.status===404)setError('O acesso profissional ainda não está disponível neste servidor.');
      else if(err.response?.status===409)setError('Este nome de usuário já está em uso.');
      else if(err.response?.status===400)setError('Usuário de 3–40 caracteres e senha de 10–72 caracteres.');
      else if(err.response?.status===401)setError(signup
        ? 'O ambiente de testes bloqueou o cadastro (401). Nenhuma conta foi confirmada.'
        : 'Usuário ou senha inválidos.');
      else if(err.response?.status===429)setError('Muitas tentativas. Aguarde e tente novamente.');
      else setError('Não foi possível conectar ao servidor. Ele pode estar iniciando.');
    }finally{setLoading(false);}
  };
  return <AuthShell type={signup?'signup':'login'} audience="personal"
    title={signup?'SUA ÁREA PROFISSIONAL.':'BEM-VINDO, COACH.'}
    subtitle="Acompanhe alunos, converse e organize planos com permissão deles."
    footer={signup
      ? <>Já tem acesso profissional? <Link to="/login-personal">Entrar</Link> · <Link to="/signup">Sou aluno</Link></>
      : <>Primeiro acesso? <Link to="/cadastro-personal">Criar conta profissional</Link> · <Link to="/login">Sou aluno</Link></>}>
    <form className="gg-auth-form" onSubmit={submit} aria-busy={loading}>
      <label className="gg-auth-field"><span>Usuário do personal</span>
        <input value={username} name="username" onChange={e=>setUsername(e.target.value)}
          pattern="[A-Za-z0-9_.\-]{3,40}" maxLength={40} autoComplete="username"
          placeholder="Seu usuário profissional" required disabled={loading}/>
      </label>
      <label className="gg-auth-field"><span>Senha</span>
        <div className="gg-auth-input-wrap">
          <input value={password} name="password" onChange={e=>setPassword(e.target.value)}
            type={showPassword?'text':'password'} minLength={signup?10:undefined}
            maxLength={72} autoComplete={signup?'new-password':'current-password'}
            required placeholder="Sua senha forte" disabled={loading}/>
          <button type="button" className="gg-auth-show-password"
            aria-label={showPassword?'Ocultar senha':'Mostrar senha'} aria-pressed={showPassword}
            disabled={loading} onClick={()=>setShowPassword(x=>!x)}>
            {showPassword?'Ocultar':'Mostrar'}
          </button>
        </div>
      </label>
      <ApiWakeNotice connection={connection}/>
      {error&&<p role="alert" className="gg-auth-error">{error}</p>}
      <button type="submit" className="gg-auth-submit" disabled={loading||!connection.ready}>
        <span>{loading?'VALIDANDO…':signup?'CRIAR CONTA PROFISSIONAL':'ENTRAR COMO PERSONAL'}</span>
        <span aria-hidden="true">→</span>
      </button>
      <p style={{fontSize:12,lineHeight:1.6,color:'#c8c8c8'}}>
        Esta área não registra alimentação ou treinos próprios. Para treinar com o GabGym, use uma conta de aluno.
        O cadastro profissional ainda é autodeclarado, sem verificação de credenciais.
      </p>
    </form>
  </AuthShell>;
}
