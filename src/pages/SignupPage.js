import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import './LoginPage.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async event => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await registerUser({ username, password });
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 409) setError('Esse usuário já está em uso.');
      else if (err.response?.status === 400) setError('Confira o nome e a senha antes de continuar.');
      else setError('Não foi possível cadastrar. Verifique a conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h2 className="login-title">CRIAR CONTA NO GABGYM</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input id="username" autoComplete="username" value={username}
              onChange={e => setUsername(e.target.value)} pattern="[A-Za-z0-9_.-]{3,40}"
              title="3 a 40 caracteres: letras, números, ponto, hífen ou sublinhado" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha (mínimo 10 caracteres)</label>
            <input id="password" type="password" autoComplete="new-password" value={password}
              onChange={e => setPassword(e.target.value)} minLength={10} maxLength={72} required />
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </button>
        </form>
        <p className="signup-link">Já tem uma conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;
