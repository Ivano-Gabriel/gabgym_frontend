import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity, FiArrowRight, FiArrowUpRight,
  FiChevronDown
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

const gymPhoto = width =>
  `https://images.unsplash.com/photo-1689877020200-403d8542d95d?auto=format&fit=crop&q=82&w=${width}`;
const strengthPhoto = width =>
  `https://images.unsplash.com/photo-1546817372-628669db4655?auto=format&fit=crop&q=82&w=${width}`;
const photoSet = (makeUrl, widths) => widths.map(width => `${makeUrl(width)} ${width}w`).join(', ');
const featureEssays = [
  { number: '01', tag: 'TREINO', headline: 'EXECUÇÃO ACIMA DE DESCULPAS.',
    description: 'Organize suas sessões e registre os exercícios. O que foi feito hoje precisa contar amanhã.' },
  { number: '02', tag: 'ALIMENTAÇÃO', headline: 'ROTINA SEM ADIVINHAÇÃO.',
    description: 'Alimentação, água e metas em um só lugar. Acompanhe o básico com clareza, sem inventar números.' },
  { number: '03', tag: 'EVOLUÇÃO', headline: 'PROGRESSO QUE VOCÊ VÊ.',
    description: 'Medidas, histórico e constância para comparar o que mudou ao longo do tempo.' }
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

      <section id="recursos" className="gg-home-features" aria-label="Recursos GabGym">
        <header className="gg-home-editorial-heading">
          <div className="gg-home-editorial-index"><span>02</span> / A FERRAMENTA</div>
          <div className="gg-home-editorial-heading-grid">
            <h2>MENOS PROMESSA.<br /><em>MAIS PROCESSO.</em></h2>
            <p>Seu treino não é uma sequência de telas. É uma sequência de escolhas. O GabGym ajuda a registrar cada uma delas.</p>
          </div>
        </header>

        <div className="gg-home-editorial-layout">
          <figure className="gg-home-training-photo">
            <img src={gymPhoto(1200)}
              srcSet={photoSet(gymPhoto,[640,960,1200,1600,2400,3840])}
              sizes="(max-width: 760px) 100vw, 44vw"
              loading="lazy" decoding="async"
              alt="Academia real com bancos, pesos e equipamentos de musculação" />
            <figcaption>
              <span>AMBIENTE REAL / FOCO REAL</span>
              <strong>ENTRE, TREINE, REGISTRE.</strong>
            </figcaption>
            <span className="gg-home-photo-origin">FOTO: <a href="https://unsplash.com/photos/a-gym-filled-with-lots-of-machines-and-weights-1RNQ11ZODJM" target="_blank" rel="noreferrer">RICK BARRETT / UNSPLASH</a></span>
          </figure>
          <div className="gg-home-editorial-list">
            {featureEssays.map(({number,tag,headline,description})=>(
              <article className="gg-home-editorial-row" key={number}>
                <div className="gg-home-editorial-row-top"><span>{number}</span><small>{tag}</small></div>
                <h3>{headline}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="gg-home-athlete-strip">
          <figure className="gg-home-athlete-photo">
            <img src={strengthPhoto(960)}
              srcSet={photoSet(strengthPhoto,[480,720,960,1440,1920])}
              sizes="(max-width: 760px) 100vw, 30vw"
              loading="lazy" decoding="async"
              alt="Mulher levantando barra de musculação em academia" />
            <figcaption><a href="https://unsplash.com/photos/woman-standing-and-carrying-barbell-eFx1KZhaSvo" target="_blank" rel="noreferrer">SUSHIL GHIMIRE / UNSPLASH</a></figcaption>
          </figure>
          <div className="gg-home-athlete-copy">
            <span className="gg-home-athlete-index">03 / SEM ATALHOS</span>
            <p>O TREINO DE HOJE<br />NÃO DEVE SE<br /><strong>PERDER AMANHÃ.</strong></p>
            <span className="gg-home-athlete-aside">Registre. Acompanhe. Volte mais forte.</span>
          </div>
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
