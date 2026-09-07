import React from 'react';
import { Link } from 'react-router-dom';

// --- PALETA DE CORES DO GABGYM ---
const colors = {
  primaryGreen: '#74E85D',
  darkGreen: '#21331D',
  mediumDarkGray: '#303E2E',
  lightGray: '#60695E',
  whiteText: '#f8f9fa',
  darkText: '#1a1a1a',
};
// --- FIM DA PALETA DE CORES ---

// O componente recebe 'to' (para qual rota ele vai), 'onClick' (se houver ação extra)
// e 'direction' ('left' para voltar, 'right' para avançar - padrão é 'right')
function NextPageButton({ to, onClick, direction = 'right' }) {
  const isLeft = direction === 'left'; // Verifica se a direção é 'left'

  return (
    <Link 
      to={to} 
      onClick={onClick} 
      style={{
        ...styles.buttonContainer,
        // AJUSTE CRÍTICO: Posicionamento dinâmico baseado na direção
        [isLeft ? 'left' : 'right']: '30px', // Se for 'left', usa 'left': '30px'; senão, usa 'right': '30px'
        [isLeft ? 'right' : 'left']: 'auto', // Zera a posição oposta para não conflitar
      }}
    >
      <svg style={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* SVG da seta: muda o 'path' (forma da seta) dependendo da direção */}
        <path d={isLeft ? "M15 19L8 12L15 5" : "M9 5L16 12L9 19"} stroke={colors.darkText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}

const styles = {
  buttonContainer: {
    position: 'fixed', // Fixo na tela
    bottom: '30px', // Distância do fundo
    // 'left' e 'right' serão definidos dinamicamente no componente acima
    backgroundColor: colors.primaryGreen, // Fundo verde vibrante
    width: '60px', // Tamanho do botão
    height: '60px', // Tamanho do botão (para ser redondo)
    borderRadius: '50%', // Redondo!
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4)', // Sombra para destacar
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    zIndex: 999, // Acima de quase tudo, mas abaixo de menus abertos
    '&:hover': { // Efeito de zoom no hover
      // Essas pseudo-classes '&:hover' não funcionam diretamente em inline styles,
      // mas são um lembrete do efeito que queremos replicar com CSS em App.css se for o caso.
      // Por enquanto, o transform e background-color no hover ainda seriam feitos em App.css para a classe.
    },
  },
  arrowIcon: {
    width: '30px', // Tamanho da seta
    height: '30px',
    // A cor da seta é definida diretamente no SVG com 'stroke={colors.darkText}'
  },
};

export default NextPageButton;