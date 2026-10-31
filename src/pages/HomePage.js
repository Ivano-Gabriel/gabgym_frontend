import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { isLoggedIn } from '../utils/auth';
import { warmUpApi } from '../services/apiService';
import './HomePage.css';
import TodayDashboard from './TodayDashboard';

export default function HomePage() {
  useEffect(() => { warmUpApi(); }, []);
  const loggedIn = isLoggedIn();
  const start = '/signup';
  if (loggedIn) return <TodayDashboard />;
  return (
    <div className="gg-home">
      <section className="gg-home-hero" aria-labelledby="gg-home-title">
        <div className="gg-home-topline"><span className="gg-home-live" /> CONSTÂNCIA. TODO DIA.</div>
        <div className="gg-home-copy">
          <span className="gg-home-edition">GABGYM / A SUA ROTINA DE VERDADE</span>
          <h1 id="gg-home-title">O SEGREDO<br />É <em>CONTINUAR.</em></h1>
          <p>Seu progresso começa com uma ação.</p>
          <div className="gg-home-actions">
            <Link className="gg-home-main-action" to={start}>{loggedIn ? 'CONTINUAR MEU DIA' : 'COMEÇAR HOJE'} <FiArrowRight aria-hidden="true" /></Link>
            {!loggedIn && <Link className="gg-home-secondary-action" to="/login">JÁ TENHO CONTA</Link>}
          </div>
        </div>
        <div className="gg-home-footnote"><span>UM DIA DE CADA VEZ.</span><span>CONSISTÊNCIA ACIMA DE PERFEIÇÃO.</span></div>
        <span className="gg-home-mark" aria-hidden="true">GG</span>
      </section>
    </div>
  );
}
