import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import '../styles/premiumExperience.css';
import './AuthPremium.css';

/** Premium visual shell shared by Login and Signup. Authentication logic stays separate. */
const image = width => `https://images.unsplash.com/photo-1546817372-628669db4655?auto=format&fit=crop&q=80&w=${width}`;
const imageSet = [480,720,960,1440,1920,2560].map(w => `${image(w)} ${w}w`).join(', ');

export default function AuthShell({ type = 'login', title, subtitle, children, footer }) {
  const isSignup = type === 'signup';
  return (
    <div className="gg-auth-screen gg-auth-premium">
      <header className="gg-auth-masthead">
        <Link to="/" className="gg-auth-brand" aria-label="GABGYM, ir para o início">
          <img className="gg-auth-brand-symbol" src="/gg-mark.svg" alt="" aria-hidden="true"/>
          <strong>GAB<span>GYM</span></strong>
          <small>TREINE · EVOLUA</small>
        </Link>
        <div className="gg-auth-masthead-side">
          <span className="gg-auth-masthead-edition">UM DIA DE CADA VEZ</span>
          <Link to={isSignup ? '/login' : '/signup'} className="gg-auth-masthead-link">
            {isSignup ? 'JÁ TENHO CONTA' : 'CRIAR CONTA'} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <div className="gg-auth-stage">
        <section className="gg-auth-showcase" aria-label="Nossa filosofia">
          <img className="gg-auth-backdrop-photo"
            src={image(1440)} srcSet={imageSet}
            sizes="(max-width: 770px) 100vw, 54vw"
            alt="Atleta treinando com barra na academia"
            loading="eager" decoding="async" />
          <div className="gg-auth-photo-overlay" aria-hidden="true" />
          <div className="gg-auth-showcase-top">
            <span className="gg-auth-index">GABGYM / CONTINUE</span>
            <span className="gg-auth-top-divider" aria-hidden="true" />
            <span className="gg-auth-discipline">PEQUENOS PASSOS. GRANDES HÁBITOS.</span>
          </div>

          <div className="gg-auth-showcase-copy">
            <span className="gg-auth-overline">TREINO, ALIMENTAÇÃO, EVOLUÇÃO.</span>
            <h1>CONTINUE.<br /><em>MAIS FORTE.</em></h1>
            <p>Um lugar para continuar.</p>
          </div>

          <div className="gg-auth-performance-strip" aria-label="Nossa filosofia"><span>O PROGRESSO É SEU.</span></div>

          <span className="gg-auth-photo-credit">
            FOTO: <a href="https://unsplash.com/photos/woman-standing-and-carrying-barbell-eFx1KZhaSvo" target="_blank" rel="noreferrer">SUSHIL GHIMIRE / UNSPLASH</a>
          </span>
        </section>

        <section className="gg-auth-access" aria-label={title}>
          <div className="gg-auth-panel">
            <div className="gg-auth-panel-meta">
              <span>{isSignup ? 'CRIAR CONTA' : 'FAZER LOGIN'}</span>
              <span className="gg-auth-panel-meta-icon" aria-hidden="true">↗</span>
            </div>
            <span className="gg-auth-context">
              <span className="gg-auth-context-marker" aria-hidden="true" />
              {isSignup ? 'PRIMEIRO PASSO' : 'ÁREA DE ACESSO'}
            </span>
            <h2>{title}</h2>
            <p className="gg-auth-description">{subtitle}</p>
            {children}
            <div className="gg-auth-bottom">{footer}</div>
            <p className="gg-auth-trust">Seus dados e seu progresso, em um só lugar.</p>
          </div>
        </section>
      </div>
      <footer className="gg-auth-page-footer">
        <span>GABGYM © 2026</span>
        <span>CONSTÂNCIA TODOS OS DIAS</span>
      </footer>
    </div>
  );
}
