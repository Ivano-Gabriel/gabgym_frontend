// src/pages/StartCardioPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStopwatch } from '../hooks/useStopwatch';
import { calculateCardioCalories } from '../utils/MetabolismCalculator';

function StartCardioPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { activity } = location.state || {};

    // Agora estamos usando os nomes corretos retornados pelo hook
    const { seconds, isRunning, start, pause, reset } = useStopwatch();
    
    const [userWeight, setUserWeight] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);

    useEffect(() => {
        const storedUserDataString = localStorage.getItem('gabgymUserData');
        if (storedUserDataString) {
            const userData = JSON.parse(storedUserDataString);
            setUserWeight(parseFloat(userData.weight) || 0);
        }
    }, []);

    useEffect(() => {
        if (activity && userWeight > 0) {
            const burned = calculateCardioCalories(activity.metValue, userWeight, seconds);
            setCaloriesBurned(burned);
        }
    }, [seconds, activity, userWeight]);

    if (!activity) {
        return (
            <div className="content-page">
                <h2>Erro</h2>
                <p>Nenhuma atividade selecionada. Por favor, volte e escolha uma atividade.</p>
                <button onClick={() => navigate('/cardio/select')} className="back-button-general">Voltar</button>
            </div>
        );
    }

    const handleFinish = () => {
        // AQUI ESTÁ A CORREÇÃO: chamando reset() em vez de handleReset()
        reset(); 

        const newExerciseLog = {
            id: `cardio-${Date.now()}`,
            name: `${activity.name} (${new Date(seconds * 1000).toISOString().slice(14, 19)})`,
            calories: -caloriesBurned,
            icon: activity.icon,
            type: 'exercise',
            timestamp: Date.now()
        };
        localStorage.setItem('gabgymNewlyCompletedExercise', JSON.stringify(newExerciseLog));
        navigate('/diario');
    };

    return (
        <div className="content-page">
            <div className="timer-view-container">
                <span className="current-activity-icon">{activity.icon}</span>
                <h2 className="current-activity-title">{activity.name}</h2>
                
                {!isRunning && seconds === 0 ? (
                    <button onClick={start} className="start-cardio-button">INICIAR</button>
                ) : (
                    <>
                        <div className="timer-display">
                            {new Date(seconds * 1000).toISOString().slice(11, 19)}
                        </div>
                        
                        <div className="calories-burned-display">
                            🔥 {caloriesBurned} kcal gastas
                        </div>

                        <div className="timer-controls">
                            <button onClick={isRunning ? pause : start} className="pause-resume-button">
                                {isRunning ? 'Pausar' : 'Retomar'}
                            </button>
                            <button onClick={handleFinish} className="finish-button">
                                Finalizar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default StartCardioPage;