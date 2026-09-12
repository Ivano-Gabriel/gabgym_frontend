// src/pages/SelectActivityPage.js — escolhe atividade e manda pro rastreador certo (GPS ou cronômetro)

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CARDIO_LIST } from '../data/CardioList';
import { FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi';
import './SelectActivityPage.css';

function SelectActivityPage() {
  const navigate = useNavigate();

  const handleActivitySelect = (activity) => {
    if (activity.gpsBased) {
      navigate('/cardio', { state: { activity } });
    } else {
      navigate('/cardio/start', { state: { activity } });
    }
  };

  return (
    <div className="gg-select-container">
      <div className="gg-select-card">

        <div className="gg-select-top">
          <h1 className="gg-select-title">Escolha seu Cardio</h1>
          <p className="gg-select-subtitle">Atividades ao ar livre usam GPS pra medir distância. As outras usam cronômetro.</p>
        </div>

        <div className="gg-select-grid">
          {CARDIO_LIST.map((activity) => (
            <button key={activity.id} className="gg-select-card-item" onClick={() => handleActivitySelect(activity)}>
              <span className="gg-select-name">{activity.name}</span>
              <span className="gg-select-mode">
                {activity.gpsBased ? <><FiMapPin /> Com GPS</> : <><FiClock /> Cronômetro</>}
              </span>
            </button>
          ))}
        </div>

        <Link to="/perfil" className="gg-select-back"><FiArrowLeft /> Voltar pro Perfil</Link>
      </div>
    </div>
  );
}

export default SelectActivityPage;