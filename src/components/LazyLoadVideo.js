// src/components/LazyLoadVideo.js
import React, { useState, useEffect, useRef } from 'react';

// Este componente é uma versão inteligente do nosso player de vídeo
const LazyLoadVideo = ({ src }) => {
  // Guarda uma referência ao nosso elemento 'div'
  const videoRef = useRef(null);
  // Estado para controlar se o vídeo deve ser carregado
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Copia o valor atual do ref pra uma variável local — assim a função de limpeza
    // usa sempre o mesmo elemento que foi observado, mesmo se o ref mudar depois
    const currentRef = videoRef.current;

    // Cria um "observador" que fica de olho no nosso div
    const observer = new IntersectionObserver(
      (entries) => {
        // A função do observador é chamada quando o elemento entra ou sai da tela
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Se o elemento estiver visível, atualizamos o estado para carregar o vídeo
          setIsVisible(true);
          // Uma vez carregado, não precisamos mais observar
          observer.unobserve(currentRef);
        }
      },
      {
        // Começa a carregar um pouco antes de o elemento aparecer totalmente
        rootMargin: '100px', 
      }
    );

    // Diz ao observador para começar a "vigiar" nosso div
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Função de limpeza para quando o componente for desmontado
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // O array vazio [] garante que este efeito rode só uma vez

  return (
    // Inicialmente, renderizamos um 'div' vazio com a altura correta (para não quebrar o layout)
    // A referência 'videoRef' é anexada aqui
    <div ref={videoRef} style={styles.videoContainer}>
      {/* Quando 'isVisible' se torna true, nós finalmente renderizamos a tag <video> */}
      {isVisible && (
        <video
          style={styles.video}
          src={src}
          
          loop
          muted
          playsInline
          controls
        >
          Seu navegador não suporta a tag de vídeo.
        </video>
      )}
    </div>
  );
};

// Estilos para fazer o vídeo responsivo e o container ter altura
const styles = {
  videoContainer: {
    width: '100%',
    margin: '20px 0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#000', // Um fundo preto para o placeholder
    // Truque para manter a proporção 16:9 antes de o vídeo carregar
    aspectRatio: '16 / 9', 
  },
  video: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
};

export default LazyLoadVideo;