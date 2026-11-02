// src/App.js
import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// Imports Completos e Verificados
import HomePage from './pages/HomePage';
import ProfileForm from './pages/ProfileForm';
import MobileMenu from './components/MobileMenu';
import TutorialModal from './components/TutorialModal';
import MeAjudePage from './pages/MeAjudePage';
import TrainingModels from './pages/TrainingModels';
import TrainingTodayPage from './pages/TrainingTodayPage';
import TrainingPlanPage from './pages/TrainingPlanPage';
import MuscleGroupPage from './pages/MuscleGroupPage';
import DietPage from './pages/DietPage';
import NutritionTodayPage from './pages/NutritionTodayPage';
import DailyNavigation from './components/DailyNavigation';
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
import PersonalPage from './pages/PersonalPage';
import RegistrosPage from './pages/RegistrosPage';
import SignupPage from './pages/SignupPage';
import MinhasMetasPage from './pages/MinhasMetasPage';



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsChevronDown } from "react-icons/bs";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import FoodLibraryPage from './pages/FoodLibraryPage'; // <--- A LINHA MÁGICA
import { isLoggedIn, isSuperAdmin } from './utils/auth';
import AdminPage from './pages/AdminPage';
import { nutritionLegacyAliases, nutritionHome } from './utils/nutritionRoutes';
import { getSwipeDestination, shouldIgnoreSwipeOrigin } from './utils/swipeNavigation';
import './components/Header.css';
import './styles/metalFinish.css';
import './styles/interactionPolish.css';
import './styles/redEdition.css';


function RequireAuth({ children, admin = false }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (admin && !isSuperAdmin()) return <Navigate to="/perfil" replace />;
  return children;
}

function AppContent() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const swipeStart = useRef(null);
  const swipeSurface = useRef(null);
  const resetSwipe = () => { if (swipeSurface.current) { swipeSurface.current.style.transform = ''; swipeSurface.current.style.transition = ''; } };

  const isOverlayActive = isLogoMenuOpen || isMobileMenuOpen || showTutorialModal;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

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

  const onTabTouchStart = event => {
    swipeStart.current=null;
    if(!isLoggedIn()||isOverlayActive||window.innerWidth>767)return;
    if(event.touches.length!==1||shouldIgnoreSwipeOrigin(event.target,event.currentTarget))return;
    const touch=event.touches[0];
    if(touch.clientX<28||touch.clientX>window.innerWidth-28)return;
    swipeStart.current={x:touch.clientX,y:touch.clientY,id:touch.identifier,at:Date.now()};
  };
  const onTabTouchMove = event => {
    const start = swipeStart.current;
    if (!start || !swipeSurface.current || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x, dy = touch.clientY - start.y;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { swipeStart.current = null; resetSwipe(); return; }
    if (Math.abs(dx) < 9 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    const pageIndex = ['/', '/alimentacao', '/treino', '/perfil'].indexOf(location.pathname);
    if (pageIndex < 0) return;
    const edge = (pageIndex === 0 && dx > 0) || (pageIndex === 3 && dx < 0);
    const offset = Math.max(-110, Math.min(110, dx * (edge ? .12 : .34)));
    swipeSurface.current.style.transition = 'none';
    swipeSurface.current.style.transform = `translate3d(${offset}px,0,0)`;
  };
  const onTabTouchEnd = event => {
    const start=swipeStart.current;swipeStart.current=null;
    if(swipeSurface.current){swipeSurface.current.style.transition='transform 180ms ease-out';swipeSurface.current.style.transform='';}
    if(!start||isOverlayActive||event.changedTouches.length!==1)return;
    const touch=event.changedTouches[0];if(touch.identifier!==start.id)return;
    const next=getSwipeDestination(location.pathname,touch.clientX-start.x,touch.clientY-start.y,Date.now()-start.at);
    if(next){event.preventDefault();navigate(next);}
  };
  const headerLabel=({'/':'Hoje','/alimentacao':'Comer','/treino':'Treino','/perfil':'Perfil'})[location.pathname];

  return (
    <div className="App">
      {!isAuthPage && <header className="gg-header">
        <div className="gg-logo-container">
          <Link to="/" className="gg-logo-link" onClick={handleLogoClick}>
            <img className="gg-header-monogram" src="/gg-mark.svg" alt="" aria-hidden="true"/>
            <span className="gg-logo-text">GABGYM</span>
          </Link>
          <div className={`gg-logo-dropdown-trigger ${isLogoMenuOpen ? 'open' : ''}`} onClick={toggleLogoMenu}>
            <BsChevronDown />
          </div>
          {isLogoMenuOpen && (
            <div className="gg-logo-dropdown">
              <Link to="/biblioteca" className="gg-logo-dropdown-link" onClick={closeAllMenus}>Biblioteca</Link>
              <Link to="/meu-personal" className="gg-logo-dropdown-link" onClick={closeAllMenus}>Meu Personal</Link>
            </div>
          )}
          <span className="gg-header-route" aria-live="polite">{headerLabel||'SEU PROGRESSO'}</span>
        </div>
        <nav className="gg-nav-desktop">
          <ul className="gg-nav-list">
            <li><Link to="/" className="gg-nav-link" onClick={closeAllMenus}>{t('header.inicio')}</Link></li>
            <li><Link to={isSuperAdmin() ? '/admin' : '/perfil'} className="gg-nav-link" onClick={closeAllMenus}>{t('header.perfil')}</Link></li>
          </ul>
        </nav>
        <div className="gg-header-right">
          <Link
            to={isLoggedIn() ? (isSuperAdmin() ? '/admin' : '/perfil') : '/login'}
            className="gg-header-cta"
          >
            {isLoggedIn() ? t('header.meu_perfil') : t('header.criar_perfil')} <FiArrowRight />
          </Link>
          <button type="button" className={"gg-hamburger"+(isMobileMenuOpen?" is-open":"")} onClick={toggleMobileMenu} aria-label={isMobileMenuOpen?"Fechar menu":"Abrir menu"} aria-expanded={isMobileMenuOpen}>
            {isMobileMenuOpen?<FiX className="gg-menu-symbol" aria-hidden="true"/>:<FiMenu className="gg-menu-symbol" aria-hidden="true"/>}
          </button>
        </div>
      </header>}
      
      {isOverlayActive && ( <div className={`site-blur-overlay active`} onClick={() => { closeAllMenus(); setShowTutorialModal(false); }}></div> )}
      <ToastContainer position="top-right" className="gg-toast-container" newestOnTop limit={3} autoClose={3200} hideProgressBar={false} theme="dark" closeOnClick={false} draggable={false}/>

      <main ref={swipeSurface} className={isAuthPage ? 'gg-auth-main' : 'gg-swipe-surface'} onTouchStart={onTabTouchStart} onTouchMove={onTabTouchMove} onTouchEnd={onTabTouchEnd} onTouchCancel={()=>{swipeStart.current=null;resetSwipe();}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfil" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/profile-form" element={<RequireAuth><ProfileForm /></RequireAuth>} />
          <Route path="/legado/diario" element={<RequireAuth><DiarioPage /></RequireAuth>} />
          {nutritionLegacyAliases.map(path => <Route key={path} path={path} element={<Navigate to={nutritionHome} replace />} />)}
          <Route path="/legado/diario-alimentar" element={<RequireAuth><DiarioAlimentarPage /></RequireAuth>} />
          <Route path="/legado/biblioteca-alimentos" element={<FoodLibraryPage />} />
          <Route path="/training-models" element={<Navigate to="/treino" replace />} />
          <Route path="/treino" element={<RequireAuth><TrainingTodayPage /></RequireAuth>} />
          <Route path="/legado/training-models" element={<TrainingModels />} />
          <Route path="/legado/dietas" element={<DietPage />} />
          <Route path="/alimentacao" element={<RequireAuth><NutritionTodayPage /></RequireAuth>} />
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
          <Route path="/historico" element={<RequireAuth><HistoryPage /></RequireAuth>} />
          <Route path="/meu-personal" element={<RequireAuth><PersonalPage /></RequireAuth>} />
          <Route path="/registros" element={<RequireAuth><RegistrosPage /></RequireAuth>} />
          <Route path="/minhas-metas" element={<RequireAuth><MinhasMetasPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><AdminPage /></RequireAuth>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      
      {!isAuthPage && isLoggedIn() && <DailyNavigation />}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} onTutorialClick={toggleTutorialModal} />
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