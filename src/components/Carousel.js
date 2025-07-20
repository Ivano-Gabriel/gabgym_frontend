// src/components/Carousel.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

function Carousel({ title, items }) {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const setupInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentCardIndex(prevIndex => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
    }, 2000); // 2 segundos, como você pediu
  }, [items.length]);

  useEffect(() => {
    if (scrollRef.current?.children[currentCardIndex]) {
      const card = scrollRef.current.children[currentCardIndex];
      scrollRef.current.scrollTo({
        left: card.offsetLeft - (scrollRef.current.offsetWidth - card.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }
  }, [currentCardIndex]);

  useEffect(() => {
    if (!isHovering) {
      setupInterval();
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovering, setupInterval]);

  return (
    <div className="scroll-section">
      <h3 className="scroll-section-title">{title}</h3>
      <div 
        className="scroll-container" 
        ref={scrollRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {items.map(item => {
          // Define o estilo do card aqui, aplicando a imagem de fundo
          const cardStyle = {
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${item.imageSrc})`
          };

          // Define o conteúdo do card (título)
          const cardContent = (
            <div className="card-content-vertical">
              <h4>{item.title}</h4>
            </div>
          );

          // Se for um link externo, usa <a>. Senão, usa <Link>.
          return item.isExternal ? (
            <a href={item.link} key={item.id} className="topic-card-vertical" style={cardStyle} target="_blank" rel="noopener noreferrer">
              {cardContent}
            </a>
          ) : (
            <Link to={item.link} key={item.id} className="topic-card-vertical" style={cardStyle}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Carousel;