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
          <span className="gg-auth-brand-symbol" aria-hidden="true">GG</span>
          <strong>GAB<span>GYM</span></strong>
          <small>PERFORMANCE SYSTEM</small>
        </Link>
        <div className="gg-auth-masthead-side">
          <span className="gg-auth-masthead-edition">TREINO + NUTRIÇÃO / 01</span>
          <Link to={isSignup ? '/login' : '/signup'} className="gg-auth-masthead-link">
            {isSignup ? 'JÁ TENHO CONTA' : 'CRIAR CONTA'} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <div className="gg-auth-stage">
        <section className="gg-auth-showcase" aria-label="Nossa filosofia">
          <div className="gg-auth-showcase-top">
            <span className="gg-auth-index">01 / O SEU PRÓXIMO NÍVEL</span>
            <span className="gg-auth-top-divider" aria-hidden="true" />
            <span className="gg-auth-discipline">DISCIPLINA. NÃO DESCULPAS.</span>
          </div>

          <div className="gg-auth-showcase-copy">
            <span className="gg-auth-overline">UM LUGAR PARA EVOLUIR.</span>
            <h1>MAIS QUE<br />TREINO.<br /><em>PROGRESSO.</em></h1>
            <p>Planeje seus treinos. Cuide da alimentação. Acompanhe cada conquista. Tudo começa com consistência.</p>
          </div>

          <div className="gg-auth-performance-strip" aria-label="Três pilares do GABGYM">
            <span><b>01</b> TREINAR</span>
            <span><b>02</b> ALIMENTAR</span>
            <span><b>03</b> EVOLUIR</span>
          </div>

          <span className="gg-auth-watermark" aria-hidden="true">G/</span>
        </section>

        <section className="gg-auth-access" aria-label={title}>
          <div className="gg-auth-panel">
            <div className="gg-auth-panel-meta">
              <span>{isSignup ? 'CADASTRO / GABGYM' : 'ACESSO / GABGYM'}</span>
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
            <p className="gg-auth-trust">
              <span aria-hidden="true">✳</span> ACESSO PROTEGIDO / DADOS PESSOAIS
            </p>
          </div>
        </section>
      </div>
      <footer className="gg-auth-page-footer">
        <span>GABGYM © 2026</span>
        <span>FORÇA EM CADA DIA <span aria-hidden="true">/</span> RESULTADO EM CADA ESCOLHA</span>
      </footer>
    </div>
  );
}
