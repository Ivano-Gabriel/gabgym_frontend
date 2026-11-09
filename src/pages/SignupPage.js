import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import AuthShell from './AuthShell';
import {useApiReady} from '../hooks/useApiReady';
import ApiWakeNotice from '../components/ApiWakeNotice';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const connection=useApiReady();

  const submit = async event => {
    event.preventDefault();
    if (isLoading||!connection.ready) return;
    setError('');
    setIsLoading(true);
    try {
      await registerUser({ username: username.trim(), password });
      navigate('/login', { replace: true });
    } catch (err) {
      if (err.response?.status === 409) setError('Esse usuário já está em uso.');
      else if (err.response?.status === 400) setError('Confira o nome e a senha antes de continuar.');
      else setError('Não foi possível criar a conta agora.');
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthShell type="signup" title="SEU COMEÇO."
    subtitle="Crie sua conta e comece."
    footer={<>Já tem uma conta? <Link to="/login">Entrar</Link> · <Link to="/cadastro-personal">Sou personal</Link></>}>
    <form className="gg-auth-form" onSubmit={submit} aria-busy={isLoading}>
      <label className="gg-auth-field"><span>Nome de usuário</span>
        <input name="username" value={username} onChange={e => setUsername(e.target.value)}
          autoComplete="username" placeholder="Como vamos chamar você?" required
          pattern="[A-Za-z0-9_.\-]{3,40}" maxLength={40} disabled={isLoading}/>
      </label>
      <label className="gg-auth-field"><span>Senha (10 a 72 caracteres)</span>
        <div className="gg-auth-input-wrap">
          <input name="password" type={showPassword ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)} autoComplete="new-password"
            placeholder="Crie uma senha forte" required minLength={10} maxLength={72} disabled={isLoading}/>
          <button type="button" className="gg-auth-show-password" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} disabled={isLoading} onClick={() => setShowPassword(x => !x)}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </label>
      <ApiWakeNotice connection={connection}/>
      {error && <p role="alert" className="gg-auth-error">{error}</p>}
      <button className="gg-auth-submit" type="submit" disabled={isLoading||!connection.ready}>
        <span>{isLoading ? 'CRIANDO CONTA...' : 'CRIAR MINHA CONTA'}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  </AuthShell>;
}
