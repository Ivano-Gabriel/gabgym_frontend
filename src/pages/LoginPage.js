import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../services/apiService';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const login = await loginUser({ username, password });
      if (login.data.role === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
        return;
      }
      const user = (await getCurrentUser()).data;
      navigate(user.weight && user.height ? '/perfil' : '/profile-form', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      else if (status === 401) setError('Usuário ou senha inválidos.');
      else setError('Não foi possível entrar. Verifique a conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h2 className="login-title">ENTRAR NO GABGYM</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input type="text" id="username" autoComplete="username"
              value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" autoComplete="current-password"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
        <p className="signup-link">Não tem conta? <Link to="/signup">Criar conta</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
