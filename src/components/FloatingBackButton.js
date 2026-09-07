// src/components/FloatingBackButton.js (Versão Corrigida com Destino Fixo)

import React from 'react';
// 1. Voltamos a usar o Link, que é a ferramenta certa para destinos fixos.
import { Link } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5';
import './FloatingBackButton.css';

// 2. O componente agora recebe uma propriedade (prop) chamada 'to'
function FloatingBackButton({ to }) {
  // 3. Removemos toda a lógica do useNavigate, não precisamos mais dela.
  
  return (
    // 4. Em vez de um <button>, agora temos um <Link> que leva para o destino 'to'.
    // O className continua o mesmo, então o seu estilo CSS não muda nada.
    <Link to={to} className="floating-back-button">
      <IoArrowBack size={24} /> {/* Adicionei um tamanho para o ícone ficar consistente */}
    </Link>
  );
}

export default FloatingBackButton;