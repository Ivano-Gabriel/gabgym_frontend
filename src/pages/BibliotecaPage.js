// src/pages/BibliotecaPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articles } from '../data/articles';
import './BibliotecaPage.css';

// Componente auxiliar para renderizar cada bloco de conteúdo
const ContentBlock = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return <h2>{block.text}</h2>;
    case 'paragraph':
      return <p dangerouslySetInnerHTML={{ __html: block.text }} />;
    case 'image':
      return <img src={block.src} alt={block.alt} className="article-image" />;
    case 'list':
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
    case 'youtube':
      return (
      <a href={`https://youtu.be/${block.videoId}`} target="_blank" rel="noopener noreferrer" className="youtube-link-card">
          <img 
            src={`https://i.ytimg.com/vi/${block.videoId}/sddefault.jpg`} 
            alt={block.title}
            className="youtube-thumbnail"
          />
          <div className="play-icon-overlay">▶</div>
          <p className="youtube-title">{block.title}</p>
        </a>
      );
    default:
      return null;
  }
};

function BibliotecaPage() {
  const { t } = useTranslation();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('suplementacao');
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(-1);
  
  const articleRefs = useRef([]);
  const filteredArticles = articles.filter(article => article.category === activeTab);

  // Efeito para o deep-linking (âncora) - SEM MUDANÇAS
  useEffect(() => {
    const hash = location.hash.substring(1);
    if (hash) {
      const targetArticle = articles.find(article => article.id === hash);
      if (targetArticle) {
        setActiveTab(targetArticle.category);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [location.hash]);

  // Efeito para mostrar o botão de Voltar flutuante - SEM MUDANÇAS
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // EFEITO DO "OBSERVADOR" CORRIGIDO E MAIS INTELIGENTE
  useEffect(() => {
    articleRefs.current = articleRefs.current.slice(0, filteredArticles.length);

    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          const index = parseInt(intersectingEntry.target.dataset.index, 10);
          setCurrentArticleIndex(index);
        }
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Ativa quando o elemento cruza o meio da tela
        threshold: 0
      }
    );

    const currentRefs = articleRefs.current;
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [filteredArticles]);

  // Funções de navegação que usam o estado do observador
  const scrollToArticle = (index) => {
    const targetElement = document.getElementById(filteredArticles[index].id);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextArticle = () => {
    const nextIndex = currentArticleIndex + 1;
    if (nextIndex < filteredArticles.length) {
      scrollToArticle(nextIndex);
      
    }
  };

  const handlePreviousArticle = () => {
    const prevIndex = currentArticleIndex - 1;
    if (prevIndex >= 0) {
      scrollToArticle(prevIndex);
    }
  };

  return (
    <div className="content-page biblioteca-page">
      <h2 className="biblioteca-main-title">{t('biblioteca.titulo')}</h2>
      <p className="curiosities-main-subtitle">{t('biblioteca.subtitulo')}</p>
      
      <div className="biblioteca-tabs">
        <button className={`tab-button ${activeTab === 'suplementacao' ? 'active' : ''}`} onClick={() => setActiveTab('suplementacao')}>
          {t('biblioteca.aba_suplementacao')}
        </button>
        <button className={`tab-button ${activeTab === 'treinamento' ? 'active' : ''}`} onClick={() => setActiveTab('treinamento')}>
          {t('biblioteca.aba_treinamento')}
        </button>
        <button className={`tab-button ${activeTab === 'alimentacao' ? 'active' : ''}`} onClick={() => setActiveTab('alimentacao')}>
          {t('biblioteca.aba_alimentacao')}
        </button>
      </div>

      <div className="biblioteca-content">
        {filteredArticles.map((article, index) => (
          // O "SINALIZADOR" AGORA TEM AS INFORMAÇÕES QUE O OBSERVADOR PRECISA
          <div 
            key={article.id} 
            id={article.id} 
            className="article-card"
            ref={el => articleRefs.current[index] = el}
            data-index={index}
          >
            <h3 className="article-title">{article.title}</h3>
            <div className="article-body">
              {article.content.map((block, index) => (
                <ContentBlock key={index} block={block} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to="/curiosidades" className="back-button-general">
        {t('biblioteca.botao_voltar_curiosidades')}
      </Link>

      <Link
        to="/curiosidades"
        className={`floating-back-button ${showFloatingButton ? 'visible' : ''}`}
        title="Voltar para Curiosidades"
      >
        Voltar
      </Link>
      
      <div className="article-nav-buttons">
        <button 
            className="nav-arrow-button" 
            onClick={handlePreviousArticle}
            disabled={currentArticleIndex <= 0}
            title="Artigo Anterior"
        >
            ↑
        </button>
        <button 
            className="nav-arrow-button" 
            onClick={handleNextArticle}
            disabled={currentArticleIndex >= filteredArticles.length - 1}
            title="Próximo Artigo"
        >
            ↓
        </button>
      </div>
    </div>
  );
}

export default BibliotecaPage;