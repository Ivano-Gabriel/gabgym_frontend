import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function AuthShell({ type = 'login', title, subtitle, children, footer }) {
  return (
    <div className="gg-auth-screen">
      <aside className="gg-auth-showcase" aria-label="Bem-vindo ao GABGYM">
        <Link to="/" className="gg-auth-logo" aria-label="Ir para o início do GABGYM">
          <span className="gg-auth-logo-icon" aria-hidden="true">G</span>
          <strong>gabgym</strong>
          <span className="gg-auth-logo-dot" aria-hidden="true">.</span>
        </Link>
        <div className="gg-auth-visual" aria-hidden="true">
          <span className="gg-auth-visual-circle gg-auth-visual-circle--one" />
          <span className="gg-auth-visual-circle gg-auth-visual-circle--two" />
          <span className="gg-auth-visual-circle gg-auth-visual-circle--three" />
          <span className="gg-auth-visual-bar" />
        </div>
        <div className="gg-auth-showcase-copy">
          <span className="gg-auth-kicker">O SEU ESPAÇO DE EVOLUÇÃO</span>
          <h1>Sua rotina.<em>Seu próximo nível.</em></h1>
          <p>Treinos, evolução e hábitos. Tudo no seu ritmo, em um só lugar.</p>
        </div>
        <span className="gg-auth-showcase-footer">GABGYM / SUA JORNADA</span>
      </aside>

      <main className="gg-auth-access">
        <div className="gg-auth-mobile-brand"><span>G</span> gabgym.</div>
        <section className="gg-auth-card" aria-label={title}>
          <span className="gg-auth-context">{type === 'login' ? 'ACESSO À CONTA' : 'PRIMEIRO ACESSO'}</span>
          <h2>{title}</h2>
          <p className="gg-auth-description">{subtitle}</p>
          {children}
          <div className="gg-auth-bottom">{footer}</div>
          <p className="gg-auth-trust">
            <span aria-hidden="true">◈</span> Seus dados são pessoais e protegidos.
          </p>
        </section>
      </main>
    </div>
  );
}
