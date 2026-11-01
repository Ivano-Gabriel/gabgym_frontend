import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, getCurrentUser, warmUpApi } from '../services/apiService';
import AuthShell from './AuthShell';

export default function LoginPage() {
  useEffect(() => { warmUpApi(); }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [codigoMfa, setCodigoMfa] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    try {
      const login = await loginUser({ username: username.trim(), password, codigoMfa: mfaRequired ? codigoMfa : null });
      if (login.data.role === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        const user = (await getCurrentUser()).data;
        navigate(user.weight && user.height ? '/perfil' : '/profile-form', { replace: true });
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 428) {
        setMfaRequired(true);
        setCodigoMfa('');
        setError('');
      } else if (status === 429) setError('Muitas tentativas. Aguarde alguns minutos.');
      else if (status === 401) setError(mfaRequired ? 'Código de segurança ou credenciais inválidos.' : 'Usuário ou senha inválidos.');
      else setError('Não foi possível acessar o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthShell type="login" title={mfaRequired ? 'VALIDE SEU ACESSO.' : 'BEM-VINDO DE VOLTA.'}
    subtitle={mfaRequired ? 'Seus seis dígitos garantem que só você entre.' : 'Acesse seu progresso.'}
    footer={<>Ainda não tem uma conta? <Link to="/signup">Criar conta</Link></>}>
    <form className="gg-auth-form" onSubmit={handleSubmit}>
      <label className="gg-auth-field"><span>Usuário</span>
        <input value={username} onChange={e => { setUsername(e.target.value); setMfaRequired(false); }}
          autoComplete="username" placeholder="Seu nome de usuário" required maxLength={40} disabled={isLoading} />
      </label>
      <label className="gg-auth-field"><span>Senha</span>
        <div className="gg-auth-input-wrap">
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" placeholder="Sua senha" required disabled={isLoading}/>
          <button className="gg-auth-show-password" type="button" onClick={() => setShowPassword(x => !x)}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </label>
      {mfaRequired && <label className="gg-auth-field"><span>Código de segurança</span>
        <input value={codigoMfa} onChange={e => setCodigoMfa(e.target.value.replace(/\D/g, '').slice(0,6))}
          inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" placeholder="000000" required
          maxLength={6} disabled={isLoading} />
      </label>}
      {error && <p className="gg-auth-error" role="alert">{error}</p>}
      <button className="gg-auth-submit" type="submit" disabled={isLoading}>
        <span>{isLoading ? 'VERIFICANDO...' : mfaRequired ? 'VALIDAR CÓDIGO' : 'ENTRAR NO GABGYM'}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  </AuthShell>;
}
