import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUser } from '../services/apiService';
import {
  FiActivity, FiPieChart, FiHeart, FiBookOpen, FiZap, FiHelpCircle,
  FiEdit3, FiLogOut, FiGlobe, FiCamera, FiBarChart2, FiGrid
} from 'react-icons/fi';
import './ProfilePage.css';

function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [imc, setImc] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('/images/default-avatar.png');
  const fileInputRef = useRef(null);
  const [streak, setStreak] = useState(0);
  
  // Novo estado para controlar a aba ativa (estatísticas ou navegação)
  const [activeTab, setActiveTab] = useState('stats'); 

  useEffect(() => {
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

    const storedAvatar = localStorage.getItem('gabgymAvatar');
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }
    
    const todayString = new Date().toLocaleDateString('en-CA');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toLocaleDateString('en-CA');

    const streakDataString = localStorage.getItem('gabgymStreakData');
    let streakData = streakDataString ? JSON.parse(streakDataString) : { count: 0, lastVisit: null };

    if (streakData.lastVisit !== todayString) {
      if (streakData.lastVisit === yesterdayString) {
        streakData.count++;
      } else {
        streakData.count = 1;
      }
      streakData.lastVisit = todayString;
      localStorage.setItem('gabgymStreakData', JSON.stringify(streakData));
    }
    
    setStreak(streakData.count);
  }, [navigate]);
  
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
    <div className="profile-page-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar-container" onClick={handleAvatarClick} title={t('hub.mudar_foto')}>
            <img src={avatarUrl} alt="Foto de Perfil" className="profile-avatar" />
            <div className="change-photo-overlay"><FiCamera /></div>
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
          <div className="streak-ring" title={`${streak} ${t('hub.dias_foco')}`}>
            <svg viewBox="0 0 100 100" className="streak-ring-svg">
              <circle cx="50" cy="50" r="44" className="streak-ring-track" />
              <circle
                cx="50" cy="50" r="44"
                className="streak-ring-progress"
                style={{ strokeDasharray: 276.5, strokeDashoffset: 276.5 - (Math.min(streak, 7) / 7) * 276.5 }}
              />
            </svg>
            <div className="streak-ring-content">
              <span className="streak-flame">🔥</span>
              <strong>{streak}</strong>
              <span className="streak-label">{t('hub.dias_foco')}</span>
            </div>
          </div>
        </div>

        {/* Sistema de Abas */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <FiBarChart2 className="tab-icon" /> Visão Geral
          </button>
          <button 
            className={`tab-btn ${activeTab === 'nav' ? 'active' : ''}`}
            onClick={() => setActiveTab('nav')}
          >
            <FiGrid className="tab-icon" /> Navegar
          </button>
        </div>

        {/* Conteúdo Condicional */}
        <div className="tab-content">
          {activeTab === 'stats' ? (
            <div className="profile-section fade-in">
              <div className="stats-strip">
                <div className="stat-item"><span>{t('hub.altura')}</span><strong>{userData ? userData.height : '-'}<small>cm</small></strong></div>
                <div className="stat-item"><span>{t('hub.peso')}</span><strong>{userData ? userData.weight : '-'}<small>kg</small></strong></div>
                <div className="stat-item"><span>{t('hub.idade')}</span><strong>{userData ? userData.age : '-'}<small>anos</small></strong></div>
                <div className="stat-item"><span>{t('hub.imc')}</span><strong>{imc || '-'}</strong></div>
              </div>
            </div>
          ) : (
            <div className="profile-section fade-in">
              <div className="hub-grid">
                <Link to="/training-models" className="hub-card"><FiActivity className="hub-icon" /><span>{t('hub.treinos')}</span></Link>
                <Link to="/dietas" className="hub-card"><FiPieChart className="hub-icon" /><span>{t('hub.dietas')}</span></Link>
                <Link to="/cardio" className="hub-card"><FiHeart className="hub-icon" /><span>{t('hub.cardio')}</span></Link>
                <Link to="/diario" className="hub-card"><FiBookOpen className="hub-icon" /><span>{t('hub.diario')}</span></Link>
                <Link to="/curiosidades" className="hub-card"><FiZap className="hub-icon" /><span>{t('hub.curiosidades')}</span></Link>
                <Link to="/me-ajude" className="hub-card"><FiHelpCircle className="hub-icon" /><span>{t('hub.me_ajude')}</span></Link>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <Link to="/profile-form" className="action-button edit-profile">
            <FiEdit3 /> {t('hub.editar_perfil')}
          </Link>
          <button onClick={toggleLanguage} className="action-button language-button">
            <FiGlobe /> {i18n.language === 'pt' ? 'English' : 'Português'}
          </button>
          <button className="action-button logout" onClick={handleLogout}>
            <FiLogOut /> {t('hub.sair')}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;