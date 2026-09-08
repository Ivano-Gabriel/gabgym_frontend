// src/pages/ProfilePage.js (Versão Final com Streak À Prova de Balas)

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUser } from '../services/apiService';
import './ProfilePage.css';

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [imc, setImc] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('/images/default-avatar.png');
  const fileInputRef = useRef(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Carrega dados do usuário direto do backend (fonte da verdade agora é o Java, não mais o localStorage)
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    getUser(userId)
      .then(response => {
        const user = response.data;
        setUserData(user);
        if (user.weight && user.height) {
          const heightInMeters = parseFloat(user.height) / 100;
          const bmi = (parseFloat(user.weight) / (heightInMeters * heightInMeters)).toFixed(2);
          setImc(bmi);
        }
      })
      .catch(err => {
        console.error('Erro ao carregar perfil:', err);
      });

    // Avatar ainda é só local por enquanto (backend não tem upload de imagem ainda — fica pra próxima fase)
    const storedAvatar = localStorage.getItem('gabgymAvatar');
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }
    
    // =================================================================
    // LÓGICA DO STREAK - VERSÃO "TANQUE DE GUERRA"
    // =================================================================
    
    // Pega a data de hoje no formato YYYY-MM-DD, que não tem fuso horário
    const todayString = new Date().toLocaleDateString('en-CA');
    
    // Pega a data de ontem no mesmo formato
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString('en-CA');

    const streakDataString = localStorage.getItem('gabgymStreakData');
    let streakData = streakDataString ? JSON.parse(streakDataString) : { count: 0, lastVisit: null };

    // A mágica: só fazemos qualquer cálculo SE o texto da última visita não for igual ao texto de hoje
    if (streakData.lastVisit !== todayString) {
      if (streakData.lastVisit === yesterdayString) {
        // Dia consecutivo! Aumenta o streak.
        streakData.count++;
      } else {
        // Quebrou o streak ou é o primeiro acesso de todos. Reseta para 1.
        streakData.count = 1;
      }
      
      // Salva a data de hoje (em texto) como a última visita
      streakData.lastVisit = todayString;
      localStorage.setItem('gabgymStreakData', JSON.stringify(streakData));
    }
    
    setStreak(streakData.count);
    

  }, []);

  
  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/');
    window.location.reload(); 
  };
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        localStorage.setItem('gabgymAvatar', reader.result);
      };
    }
  };

  return (
    // O seu JSX continua exatamente o mesmo
    <div className="profile-page-container">
      <div className="profile-card">
        
        <div className="profile-header">
          <div className="profile-avatar-container" onClick={handleAvatarClick} title={t('hub.mudar_foto')}>
            <img src={avatarUrl} alt="Foto de Perfil" className="profile-avatar" />
            <div className="change-photo-overlay">📷</div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload}
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData ? userData.name : 'Visitante'}</h1>
            <p className="profile-email">{userData && userData.name ? `${userData.name.toLowerCase().replace(/\s/g, '.')}@gabgym.com` : 'email@exemplo.com'}</p>
          </div>
        </div>

        <div className="consistency-tracker">
          <div className="foguinho">🔥</div>
          <div className="foguinho-text">
            <strong>{streak}</strong>
            <span>{t('hub.dias_foco')}</span>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">{t('hub.suas_estatisticas')}</h3>
          <div className="stats-grid">
            <div className="stat-item"><span>{t('hub.altura')}</span><strong>{userData ? `${userData.height} cm` : '-'}</strong></div>
            <div className="stat-item"><span>{t('hub.peso')}</span><strong>{userData ? `${userData.weight} kg` : '-'}</strong></div>
            <div className="stat-item"><span>{t('hub.idade')}</span><strong>{userData ? `${userData.age} anos` : '-'}</strong></div>
            <div className="stat-item"><span>{t('hub.imc')}</span><strong>{imc || '-'}</strong></div>
          </div>
        </div>
        
        <div className="profile-section">
            <h3 className="section-title">{t('hub.navegacao')}</h3>
            <div className="hub-grid">
                <Link to="/training-models" className="hub-card"><div className="hub-card-title">{t('hub.treinos')}</div></Link>
                <Link to="/dietas" className="hub-card"><div className="hub-card-title">{t('hub.dietas')}</div></Link>
                <Link to="/cardio" className="hub-card"><div className="hub-card-title">{t('hub.cardio')}</div></Link>
                <Link to="/diario" className="hub-card"><div className="hub-card-title">{t('hub.diario')}</div></Link>
                <Link to="/curiosidades" className="hub-card"><div className="hub-card-title">{t('hub.curiosidades')}</div></Link>
                <Link to="/me-ajude" className="hub-card"><div className="hub-card-title">{t('hub.me_ajude')}</div></Link>
            </div>
        </div>

        <div className="profile-actions">
          <button onClick={toggleLanguage} className="action-button language-button">
            {i18n.language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          </button>
          <Link to="/profile-form" className="action-button edit-profile">
            {t('hub.editar_perfil')}
          </Link>
          <button className="action-button logout" onClick={handleLogout}>
            {t('hub.sair')}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;