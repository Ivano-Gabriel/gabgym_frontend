import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HistoryPage.css'; // Vamos criar o estilo para ela

function HistoryPage() {
  const [logHistory, setLogHistory] = useState([]);

  useEffect(() => {
    // Carrega o histórico salvo no "cofre" do localStorage
    const history = JSON.parse(localStorage.getItem('gabgymLogHistory') || '[]');
    // Inverte o array para mostrar os dias mais recentes primeiro
    setLogHistory(history.reverse());
  }, []);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/history-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Meu Histórico</h2>
      <p className="content-description">Aqui está o resumo dos seus dias anteriores.</p>

      <div className="history-container">
        {logHistory.length > 0 ? (
          logHistory.map((log, index) => (
            <div key={index} className="history-card">
              <h3 className="history-date">{formatDate(log.date)}</h3>
              <div className="history-macros">
                <div className="history-macro-item">
                  <span className="macro-label">Calorias</span>
                  <span className="macro-value">{log.calories} kcal</span>
                </div>
                <div className="history-macro-item">
                  <span className="macro-label">Proteínas</span>
                  <span className="macro-value">{log.protein}g</span>
                </div>
                <div className="history-macro-item">
                  <span className="macro-label">Carbs</span>
                  <span className="macro-value">{log.carbs}g</span>
                </div>
                <div className="history-macro-item">
                  <span className="macro-label">Gorduras</span>
                  <span className="macro-value">{log.fat}g</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum histórico encontrado ainda. Complete um dia no seu diário para começar a registrar!</p>
        )}
      </div>

      <Link to="/diario-alimentar" className="back-button-general">Voltar ao Diário</Link>
    </div>
  );
}

export default HistoryPage;