// src/pages/SelectActivityPage.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CARDIO_LIST } from '../data/CardioList';

function SelectActivityPage() {
    const navigate = useNavigate();

    const handleActivitySelect = (activity) => {
        // Usa o navigate para ir para a próxima página,
        // E envia os dados da atividade no 'state'
        navigate('/cardio/start', { state: { activity: activity } });
    };

    const pageStyle = {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/run.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    return (
        <div className="content-page" style={pageStyle}>
            <h2 className="workout-page-title">Escolha sua Atividade</h2>
            <div className="activity-grid">
                {CARDIO_LIST.map((activity) => (
                    <button 
                        key={activity.id} 
                        className="activity-button" 
                        onClick={() => handleActivitySelect(activity)}
                    >
                        <span className="activity-icon">{activity.icon}</span>
                        {activity.name}
                    </button>
                ))}
            </div>
            <Link to="/cardio" className="back-button-general">Voltar</Link>
        </div>
    );
}

export default SelectActivityPage;