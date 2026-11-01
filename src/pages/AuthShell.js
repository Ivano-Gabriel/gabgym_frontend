import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

/**
 * GABGYM / Performance Access
 * Composicao editorial proprietaria: grafite, laranja, tipografia condensada,
 * sem fotografia e sem animacoes decorativas. Preserva login, cadastro e MFA.
 */
export default function AuthShell({ type = 'login', title, subtitle, children, footer }) {
  const isSignup = type === 'signup';
  return (
    <div className="gg-auth-screen">
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
          <div className="gg-auth-showcase-top">
            <span className="gg-auth-index">GABGYM / CONTINUE</span>
            <span className="gg-auth-top-divider" aria-hidden="true" />
            <span className="gg-auth-discipline">PEQUENOS PASSOS. GRANDES HÁBITOS.</span>
          </div>

          <div className="gg-auth-showcase-copy">
            <span className="gg-auth-overline">TREINO, ALIMENTAÇÃO, EVOLUÇÃO.</span>
            <h1>SEU RITMO.<br /><em>SUA EVOLUÇÃO.</em></h1>
            <p>Um lugar para continuar.</p>
          </div>

          <div className="gg-auth-performance-strip" aria-label="Nossa filosofia"><span>O PROGRESSO É SEU.</span></div>

          <span className="gg-auth-watermark" aria-hidden="true">GG</span>
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
