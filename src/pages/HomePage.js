import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity, FiArrowRight, FiArrowUpRight,
  FiChevronDown, FiTarget, FiTrendingUp
} from 'react-icons/fi';
import { isLoggedIn } from '../utils/auth';
import { warmUpApi } from '../services/apiService';
import TodayDashboard from './TodayDashboard';
import './HomePage.css';

// Fotografia de Prateek Saxena — Unsplash License (sem dados fictícios de usuários).
// Fonte original: https://unsplash.com/photos/HRsaEyu_3B0
// A versão de alta definição é escolhida responsivamente, até 3840 px.
const HERO_PHOTO_ID = 'photo-1770616756218-f0abe20da404';
const heroPhoto = width =>
  `https://images.unsplash.com/${HERO_PHOTO_ID}?auto=format&fit=crop&q=82&w=${width}`;
const heroPhotoSet = [640, 960, 1440, 1920, 2560, 3840]
  .map(width => `${heroPhoto(width)} ${width}w`).join(', ');

const features = [
  {
    number: '01', Icon: FiActivity, name: 'Treine com direção.',
    copy: 'Organize os treinos e registre o que realmente foi feito. Sem perder o fio da sua evolução.',
    tag: 'TREINO'
  },
  {
    number: '02', Icon: FiTarget, name: 'Cuide da rotina.',
    copy: 'Alimentação, água e metas no mesmo lugar. Clareza para fazer escolhas todos os dias.',
    tag: 'ALIMENTAÇÃO'
  },
  {
    number: '03', Icon: FiTrendingUp, name: 'Enxergue o progresso.',
    copy: 'Acompanhe medidas, histórico e constância. O processo também merece ser visto.',
    tag: 'EVOLUÇÃO'
  }
];

export default function HomePage() {
  useEffect(() => { warmUpApi(); }, []);
  if (isLoggedIn()) return <TodayDashboard />;

  return (
    <div className="gg-home gg-home-premium">
      <section className="gg-home-hero" aria-labelledby="gg-home-title">
        <div className="gg-home-hero-shell">
          <div className="gg-home-copy">
            <div className="gg-home-eyebrow">
              <span className="gg-home-eyebrow-line" aria-hidden="true" />
              GABGYM / SEU PROGRESSO COMEÇA AQUI
            </div>
            <h1 id="gg-home-title">
              O CORPO MUDA.<br />
              <span> A <em>DISCIPLINA</em></span><br />
              FICA.
            </h1>
            <p className="gg-home-intro">
              Treino, alimentação e evolução em uma rotina que faz sentido.
              Menos distração. Mais constância.
            </p>
            <div className="gg-home-actions">
              <Link className="gg-home-main-action" to="/signup">
                COMEÇAR AGORA <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="gg-home-secondary-action" to="/login">
                ENTRAR NA CONTA <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="gg-home-hero-bottom">
              <span className="gg-home-hero-index">01 <span aria-hidden="true">/</span> O INÍCIO</span>
              <a className="gg-home-discover" href="#recursos">
                CONHECER RECURSOS <FiChevronDown aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="gg-home-stage">
            <div className="gg-home-photo-frame">
              <img
                className="gg-home-photo"
                src={heroPhoto(1440)}
                srcSet={heroPhotoSet}
                sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 56vw"
                alt="Atleta em treino de força sob iluminação vermelha"
                fetchPriority="high"
                decoding="async"
              />
              <div className="gg-home-photo-tint" aria-hidden="true" />
              <div className="gg-home-photo-caption">
                <span>FORÇA É CONSTRUÍDA.</span>
                <strong>CONSTÂNCIA, TAMBÉM.</strong>
              </div>
            </div>
            <div className="gg-home-float-card" aria-label="Foco do GabGym: evoluir um treino por vez">
              <span className="gg-home-float-icon"><FiActivity aria-hidden="true" /></span>
              <span>
                <small>O FOCO É O PROCESSO</small>
                <strong>UM TREINO POR VEZ.</strong>
              </span>
              <FiArrowUpRight aria-hidden="true" className="gg-home-float-arrow" />
            </div>
            <div className="gg-home-photo-credit">
              FOTO: <a href="https://unsplash.com/photos/HRsaEyu_3B0" target="_blank" rel="noreferrer">PRATEEK SAXENA / UNSPLASH</a>
            </div>
          </div>
        </div>
        <div className="gg-home-hero-footer">
          <span>FEITO PARA A SUA ROTINA.</span>
          <span>DISCIPLINA É CONTINUIDADE.</span>
          <span className="gg-home-hero-footer-line" aria-hidden="true" />
        </div>
      </section>

      <section id="recursos" className="gg-home-features" role="region" aria-label="Recursos GabGym">
        <div className="gg-home-features-heading">
          <div>
            <span className="gg-home-section-kicker">FEITO PARA CONTINUAR</span>
            <h2>MENOS PROMESSA.<br /><em>MAIS PROCESSO.</em></h2>
          </div>
          <p>O essencial para construir uma rotina de treino mais clara, tudo no seu ritmo.</p>
        </div>
        <div className="gg-home-feature-grid">
          {features.map(({number, Icon, name, copy, tag}) => (
            <article className="gg-home-feature" key={number}>
              <div className="gg-home-feature-top">
                <span>{number} / {tag}</span>
                <Icon aria-hidden="true" />
              </div>
              <div className="gg-home-feature-content">
                <h3>{name}</h3>
                <p>{copy}</p>
              </div>
              <div className="gg-home-feature-bar" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="gg-home-closing" aria-label="Comece no GabGym">
        <div>
          <span className="gg-home-section-kicker">A PRÓXIMA REPETIÇÃO IMPORTA.</span>
          <h2>O PRIMEIRO PASSO<br /><em>É SEU.</em></h2>
        </div>
        <Link className="gg-home-closing-cta" to="/signup">
          CRIAR MINHA CONTA <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
