// src/pages/ProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css';

function ProfilePage() {
  const { t, i18n } = useTranslation(); // Pegamos o i18n para trocar o idioma
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [imc, setImc] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('/images/default-avatar.png');
  const fileInputRef = useRef(null); // Referência para o input de arquivo escondido

  // Carrega dados do usuário e a foto do perfil
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('gabgymUserData'));
    if (storedUserData) {
      setUserData(storedUserData);
      if (storedUserData.weight && storedUserData.height) {
        const heightInMeters = parseFloat(storedUserData.height) / 100;
        const bmi = (parseFloat(storedUserData.weight) / (heightInMeters * heightInMeters)).toFixed(2);
        setImc(bmi);
      }
    }
    const storedAvatar = localStorage.getItem('gabgymAvatar');
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }
  }, []);

  // --- LÓGICA DO BOTÃO SAIR ---
  const handleLogout = () => {
    localStorage.removeItem('gabgymUserData');
    localStorage.removeItem('gabgymAvatar');
    localStorage.removeItem('gabgymTodaysLog');
    // Adicione outros 'remove' se tiver mais dados salvos
    navigate('/');
    window.location.reload(); // Força o refresh para limpar tudo
  };

  // --- LÓGICA DO BOTÃO DE IDIOMA ---
  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  // --- LÓGICA DA FOTO DE PERFIL ---
  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Clica no input de arquivo escondido
  };

  const handlePhotoUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl); // Atualiza a foto na tela
      
      // Salva a foto no localStorage (converte para base64)
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
            <strong>15</strong>
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