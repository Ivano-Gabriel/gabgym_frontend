// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// Imports Completos e Verificados
import HomePage from './pages/HomePage';
import ProfileForm from './pages/ProfileForm';
import MobileMenu from './components/MobileMenu';
import TutorialModal from './components/TutorialModal';
import MeAjudePage from './pages/MeAjudePage';
import TrainingModels from './pages/TrainingModels';
import TrainingPlanPage from './pages/TrainingPlanPage';
import MuscleGroupPage from './pages/MuscleGroupPage';
import DietPage from './pages/DietPage';
import CardioPage from './pages/CardioPage';
import CuriositiesPage from './pages/CuriositiesPage';
import StartCardioPage from './pages/StartCardioPage';
import SelectActivityPage from './pages/SelectActivityPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutMePage from './pages/AboutMePage';
import BibliotecaPage from './pages/BibliotecaPage';
import DiarioPage from './pages/DiarioPage';
import DiarioAlimentarPage from './pages/DiarioAlimentarPage';
import ProfilePage from './pages/ProfilePage';
import RoutineGeneratorPage from './pages/RoutineGeneratorPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import LoginPage from './pages/LoginPage';
import HistoryPage  from './pages/HistoryPage';



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsChevronDown } from "react-icons/bs";
import FoodLibraryPage from './pages/FoodLibraryPage'; // <--- A LINHA MÁGICA
// Objeto de cores
const colors = {
  primaryGreen: '#74E85D',
  darkGreen: '#21331D',
  mediumDarkGray: '#303E2E',
  lightGray: '#60695E',
  whiteText: '#f8f9fa',
  darkText: '#1a1a1a',
};

// Objeto de estilos para o Header
const styles = {
  header: { backgroundColor: colors.darkText, padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.5)', },
  logoContainer: { flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative', zIndex: 211, },
  logoImage: { height: '40px', width: 'auto', objectFit: 'contain', },
  logoTextHeader: { color: colors.primaryGreen, fontSize: '2.2em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', },
  navList: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '25px', },
  navLink: { color: colors.whiteText, textDecoration: 'none', fontSize: '1em', padding: '5px 10px', borderRadius: '5px', transition: 'color 0.3s ease', },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px', },
  headerEnrollButton: { backgroundColor: colors.primaryGreen, color: colors.darkText, textDecoration: 'none', padding: '8px 15px', borderRadius: '5px', fontSize: '0.9em', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', },
  hamburgerMenuStyles: { width: '30px', height: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', cursor: 'pointer', zIndex: 102, },
  bar: { width: '100%', height: '3px', backgroundColor: colors.whiteText, borderRadius: '2px', },
  logoDropdownStyles: { position: 'absolute', top: 'calc(100% + 5px)', left: '0', backgroundColor: colors.mediumDarkGray, padding: '5px 0', borderRadius: '5px', boxShadow: '0 6px 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', minWidth: '180px', zIndex: 210, },
  logoDropdownLink: { color: colors.whiteText, textDecoration: 'none', padding: '15px 25px', fontSize: '1.2em', fontWeight: 'bold', transition: 'all 0.2s ease', display: 'block', textAlign: 'center', borderRadius: '5px', margin: '5px', },
  contentTitle: { fontSize: '2.5em', color: colors.primaryGreen, marginBottom: '15px' },
  contentDescription: { fontSize: '1.1em', maxWidth: '700px', opacity: '0.9', color: colors.whiteText },
};


function AppContent() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const location = useLocation();

  const isOverlayActive = isLogoMenuOpen || isMobileMenuOpen || showTutorialModal;

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleLogoMenu = () => setIsLogoMenuOpen(prev => !prev);

  const toggleTutorialModal = () => {
    console.log("Comando para abrir/fechar o tutorial recebido no App.js!");
    setShowTutorialModal(prev => !prev);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsLogoMenuOpen(false);
  };
  
  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeAllMenus();
  };

  return (
    <div className="App">
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <Link to="/" className="logo-link" onClick={handleLogoClick}>
            <img src="/images/gymlogo.png" alt="GabGym Logo" style={styles.logoImage} />
            <span className="logo-text-header" style={styles.logoTextHeader}>gabgym</span>
          </Link>
          <div className="logo-dropdown-trigger" onClick={toggleLogoMenu}>
            <BsChevronDown />
          </div>
          {isLogoMenuOpen && (
            <div className={`logo-dropdown open`} style={styles.logoDropdownStyles}>
              <Link to="/portfolio" style={styles.logoDropdownLink} onClick={closeAllMenus}>{t('header.sobre_projeto')}</Link>
              <Link to="/about-me" style={styles.logoDropdownLink} onClick={closeAllMenus}>{t('header.sobre_programador')}</Link>
            </div>
          )}
        </div>
        <nav className="nav-desktop">
          <ul style={styles.navList}>
            <li style={styles.navItem}><Link to="/" style={styles.navLink} onClick={closeAllMenus}>{t('header.inicio')}</Link></li>
            <li style={styles.navItem}><Link to="/perfil" style={styles.navLink} onClick={closeAllMenus}>{t('header.perfil')}</Link></li>
          </ul>
        </nav>
        <div style={styles.headerRight}>
          <Link to="/profile-form" style={styles.headerEnrollButton} className="header-enroll-button">
            {t('header.criar_perfil')} <span>↗</span>
          </Link>
          <div className="hamburger-menu" style={styles.hamburgerMenuStyles} onClick={toggleMobileMenu}>
            <div style={styles.bar}></div><div style={styles.bar}></div><div style={styles.bar}></div>
          </div>
        </div>
      </header>
      
      {isOverlayActive && ( <div className={`site-blur-overlay active`} onClick={() => { closeAllMenus(); setShowTutorialModal(false); }}></div> )}
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/profile-form" element={<ProfileForm />} />
          <Route path="/diario" element={<DiarioPage />} />
          <Route path="/diario-alimentar" element={<DiarioAlimentarPage />} />
          <Route path="/biblioteca-alimentos" element={<FoodLibraryPage />} />
          <Route path="/training-models" element={<TrainingModels />} />
          <Route path="/dietas" element={<DietPage />} />
          <Route path="/cardio" element={<CardioPage />} />
          <Route path="/curiosidades" element={<CuriositiesPage />} />
          <Route path="/biblioteca" element={<BibliotecaPage />} />
          <Route path="/me-ajude" element={<MeAjudePage />} />
          <Route path="/plano-de-treino/:days" element={<TrainingPlanPage />} />
          <Route path="/exercicios/:group" element={<MuscleGroupPage />} />
          <Route path="/cardio/start" element={<StartCardioPage />} />
          <Route path="/cardio/select" element={<SelectActivityPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/about-me" element={<AboutMePage />} />
          <Route path="/routine-generator" element={<RoutineGeneratorPage />} />
          <Route path="/exercise-library" element={<ExerciseLibraryPage />} />
          <Route path="/exercicio/:exerciseId" element={<ExerciseDetailPage />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      
      {isMobileMenuOpen && ( <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} onTutorialClick={toggleTutorialModal} /> )}
      {showTutorialModal && ( <TutorialModal onClose={toggleTutorialModal} /> )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;