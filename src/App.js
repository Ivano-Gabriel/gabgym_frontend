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
import SignupPage from './pages/SignupPage';
import MinhasMetasPage from './pages/MinhasMetasPage';



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsChevronDown } from "react-icons/bs";
import { FiMenu, FiArrowRight } from "react-icons/fi";
import FoodLibraryPage from './pages/FoodLibraryPage'; // <--- A LINHA MÁGICA
import { isLoggedIn } from './utils/auth';
import './components/Header.css';


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
      <header className="gg-header">
        <div className="gg-logo-container">
          <Link to="/" className="gg-logo-link" onClick={handleLogoClick}>
            <img src="/images/gymlogo.png" alt="GabGym Logo" className="gg-logo-image" />
            <span className="gg-logo-text">gabgym</span>
          </Link>
          <div className={`gg-logo-dropdown-trigger ${isLogoMenuOpen ? 'open' : ''}`} onClick={toggleLogoMenu}>
            <BsChevronDown />
          </div>
          {isLogoMenuOpen && (
            <div className="gg-logo-dropdown">
              <Link to="/portfolio" className="gg-logo-dropdown-link" onClick={closeAllMenus}>{t('header.sobre_projeto')}</Link>
              <Link to="/about-me" className="gg-logo-dropdown-link" onClick={closeAllMenus}>{t('header.sobre_programador')}</Link>
            </div>
          )}
        </div>
        <nav className="gg-nav-desktop">
          <ul className="gg-nav-list">
            <li><Link to="/" className="gg-nav-link" onClick={closeAllMenus}>{t('header.inicio')}</Link></li>
            <li><Link to="/perfil" className="gg-nav-link" onClick={closeAllMenus}>{t('header.perfil')}</Link></li>
          </ul>
        </nav>
        <div className="gg-header-right">
          <Link
            to={isLoggedIn() ? '/perfil' : '/profile-form'}
            className="gg-header-cta"
          >
            {isLoggedIn() ? t('header.meu_perfil') : t('header.criar_perfil')} <FiArrowRight />
          </Link>
          <button className="gg-hamburger" onClick={toggleMobileMenu} aria-label="Menu">
            <FiMenu />
          </button>
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
          <Route path="/minhas-metas" element={<MinhasMetasPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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