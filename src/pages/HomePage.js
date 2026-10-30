import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiCoffee, FiTrendingUp } from 'react-icons/fi';
import { isLoggedIn, isSuperAdmin } from '../utils/auth';
import { warmUpApi } from '../services/apiService';
import './HomePage.css';

const pillars = [
  { number: '01', title: 'ALIMENTAÇÃO', subtitle: 'Registrar hoje. Continuar amanhã.', path: '/alimentacao', Icon: FiCoffee },
  { number: '02', title: 'TREINO + CARDIO', subtitle: 'Apareça. Faça seu treino. Evolua.', path: '/training-models', Icon: FiActivity },
  { number: '03', title: 'EVOLUÇÃO', subtitle: 'Acompanhe suas escolhas ao longo dos dias.', path: '/perfil', Icon: FiTrendingUp },
];

export default function HomePage() {
  useEffect(() => { warmUpApi(); }, []);
  const loggedIn = isLoggedIn();
  const admin = isSuperAdmin();
  const start = !loggedIn ? '/signup' : admin ? '/admin' : '/alimentacao';
  return (
    <div className="gg-home">
      <section className="gg-home-hero" aria-labelledby="gg-home-title">
        <div className="gg-home-topline"><span className="gg-home-live" /> CONSTÂNCIA. TODO DIA.</div>
        <div className="gg-home-copy">
          <span className="gg-home-edition">GABGYM / A SUA ROTINA DE VERDADE</span>
          <h1 id="gg-home-title">O SEGREDO<br />É <em>CONTINUAR.</em></h1>
          <p>Treino e alimentação saudável não são sobre um dia perfeito. São sobre voltar, registrar e evoluir. Todos os dias.</p>
          <div className="gg-home-actions">
            <Link className="gg-home-main-action" to={start}>{loggedIn ? 'CONTINUAR MEU DIA' : 'COMEÇAR HOJE'} <FiArrowRight aria-hidden="true" /></Link>
            {!loggedIn && <Link className="gg-home-secondary-action" to="/login">JÁ TENHO CONTA</Link>}
          </div>
        </div>
        <div className="gg-home-footnote"><span>UM DIA DE CADA VEZ.</span><span>CONSISTÊNCIA ACIMA DE PERFEIÇÃO.</span></div>
        <span className="gg-home-mark" aria-hidden="true">GG</span>
      </section>
      <section className="gg-home-pillars" aria-label="Os três pilares do GABGYM">
        <div className="gg-home-pillar-title"><span>FOCO / NO QUE IMPORTA</span><h2>MENOS ABAS.<br />MAIS AÇÃO.</h2></div>
        <div className="gg-home-grid">
          {pillars.map(({ number, title, subtitle, path, Icon }) => (
            <Link key={number} to={!loggedIn ? '/signup' : (admin && path === '/perfil' ? '/admin' : path)} className="gg-home-pillar">
              <div className="gg-home-pillar-top"><span>{number} / TODO DIA</span><Icon aria-hidden="true" /></div>
              <strong>{title}</strong>
              <p>{subtitle}</p><FiArrowRight className="gg-home-pillar-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <p className="gg-home-small-note">O progresso real é construído com registros reais, não com promessas de resultados rápidos.</p>
      </section>
    </div>
  );
}
