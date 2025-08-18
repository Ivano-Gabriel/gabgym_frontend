// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ferramentas de navegação
import { loginUser } from '../services/apiService'; // Nosso serviço de comunicação
import './LoginPage.css'; // Nosso arquivo de estilo

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      
      const token = response.data.key; 
      localStorage.setItem('authToken', token); // Salvamos o "crachá" no cofre do navegador
      
      console.log('Login bem-sucedido! Token salvo.');
      
      navigate('/perfil'); // Redireciona para a página de perfil após o login!

    } catch (err) {
      console.error('Falha no login:', err);
      setError('E-mail ou senha inválidos. Tente novamente.');
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
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
        <p className="signup-link">
          Não tem uma conta? <Link to="/signup">Crie uma agora</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;