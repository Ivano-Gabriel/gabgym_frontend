// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getUser } from '../services/apiService'; // Adicionado o getUser aqui
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // loginUser salva token, userId e username no localStorage
      await loginUser({ username, password });
      console.log('Login bem-sucedido! Token salvo.');

      // Pega o ID que acabou de ser salvo para checar o status do perfil
      const userId = localStorage.getItem('userId');
      
      try {
        const userResponse = await getUser(userId);
        const userData = userResponse.data;
        
        // Trava de UX: Se não tiver peso ou altura, é uma conta fantasma. Obriga a preencher!
        if (!userData.weight || !userData.height) {
          navigate('/profile-form');
        } else {
          navigate('/perfil');
        }
      } catch (profileErr) {
        console.error('Erro ao verificar status do perfil:', profileErr);
        // Por segurança, se a checagem falhar, manda pro formulário
        navigate('/profile-form'); 
      }

    } catch (err) {
      console.error('Falha no login:', err);
      setError('Usuário ou senha inválidos. Tente novamente.');
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
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
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