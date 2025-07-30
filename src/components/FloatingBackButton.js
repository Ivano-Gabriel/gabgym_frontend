// src/components/FloatingBackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Trocamos Link por useNavigate
import { IoArrowBack } from 'react-icons/io5';
import './FloatingBackButton.css';

function FloatingBackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // A mágica: -1 significa "volte uma página"
  };

  return (
    // Agora é um botão normal que chama a função goBack
    <button onClick={goBack} className="floating-back-button">
      <IoArrowBack />
    </button>
  );
}

export default FloatingBackButton;