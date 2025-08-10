// src/components/MetaForm.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './MetaForm.css'; // Crie este arquivo de CSS depois!

const MetaForm = ({ onAdicionarMeta }) => {
  const { t } = useTranslation();
  const [novaMetaTexto, setNovaMetaTexto] = useState('');
  const [novoTipoMeta, setNovoTipoMeta] = useState('rapida');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaMetaTexto.trim() === '') return;
    onAdicionarMeta(novaMetaTexto, novoTipoMeta);
    setNovaMetaTexto(''); // Limpa o campo após o envio
  };

  return (
    <form className="add-meta-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        className="meta-input"
        placeholder={t('goals.formPlaceholder', 'Qual sua nova meta, guerreiro(a)?')}
        value={novaMetaTexto}
        onChange={(e) => setNovaMetaTexto(e.target.value)}
      />
      <div className="custom-select-container">
        <div className="selected-value" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {novoTipoMeta === 'rapida' ? t('goals.typeQuick', 'Rápida') : t('goals.typeLongTerm', 'Longo Prazo')}
          <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
        </div>
        {isDropdownOpen && (
          <div className="options-list">
            <div className="option-item" onClick={() => { setNovoTipoMeta('rapida'); setIsDropdownOpen(false); }}>
              {t('goals.typeQuick', 'Rápida')}
            </div>
            <div className="option-item" onClick={() => { setNovoTipoMeta('longo_prazo'); setIsDropdownOpen(false); }}>
              {t('goals.typeLongTerm', 'Longo Prazo')}
            </div>
          </div>
        )}
      </div>
      <button type="submit" className="add-meta-button">{t('goals.addButton', 'Adicionar')}</button>
    </form>
  );
};

export default MetaForm;