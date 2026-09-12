// src/pages/StartCardioPage.js — cronômetro simples pra atividades sem GPS (natação, pular corda, etc)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStopwatch } from '../hooks/useStopwatch';
import { calculateCardioCalories } from '../utils/MetabolismCalculator';
import { getUser, addDiaryLog } from '../services/apiService';
import { FiPlay, FiPause, FiCheck, FiArrowLeft } from 'react-icons/fi';
import './StartCardioPage.css';

function StartCardioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activity } = location.state || {};

  const { seconds, isRunning, start, pause, reset } = useStopwatch();

  const [userWeight, setUserWeight] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Busca o peso real do usuário no backend (antes lia um localStorage que não existe mais)
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    getUser(userId)
      .then(response => {
        setUserWeight(parseFloat(response.data.weight) || 0);
      })
      .catch(err => console.error('Erro ao buscar peso do usuário:', err));
  }, []);

  // Recalcula caloria a cada segundo, com os argumentos certos dessa vez
  useEffect(() => {
    if (activity && userWeight > 0) {
      const burned = calculateCardioCalories(activity.metValue, userWeight, seconds);
      setCaloriesBurned(burned);
    }
  }, [seconds, activity, userWeight]);

  if (!activity) {
    return (
      <div className="gg-startcardio-container">
        <div className="gg-startcardio-empty">
          <p>Nenhuma atividade selecionada.</p>
          <button onClick={() => navigate('/cardio/select')} className="gg-startcardio-btn-primary">Escolher Atividade</button>
        </div>
      </div>
    );
  }

  const formatTime = (totalSeconds) => new Date(totalSeconds * 1000).toISOString().slice(11, 19);

  const handleFinish = async () => {
    pause();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Você precisa estar logado pra registrar essa atividade.');
      return;
    }

    setIsSaving(true);
    try {
      await addDiaryLog({
        userId: parseInt(userId, 10),
        type: 'cardio',
        name: activity.name,
        calories: caloriesBurned,
        durationSeconds: seconds,
        logDate: new Date().toLocaleDateString('en-CA'),
        timestamp: Date.now(),
      });
      toast.success(`${activity.name} registrada! ${caloriesBurned} kcal queimadas.`);
      reset();
      navigate('/registros');
    } catch (err) {
      console.error('Erro ao salvar cardio:', err);
      toast.error('Não foi possível salvar essa atividade. Tenta de novo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="gg-startcardio-container">
      <div className="gg-startcardio-card">
        <Link to="/cardio/select" className="gg-startcardio-back"><FiArrowLeft /> Trocar Atividade</Link>

        <h1 className="gg-startcardio-title">{activity.name}</h1>

        <div className="gg-startcardio-timer">{formatTime(seconds)}</div>

        <div className="gg-startcardio-calories">🔥 {caloriesBurned} kcal</div>

        <div className="gg-startcardio-controls">
          {!isRunning && seconds === 0 ? (
            <button onClick={start} className="gg-startcardio-btn-primary full">
              <FiPlay /> Iniciar
            </button>
          ) : (
            <>
              <button onClick={isRunning ? pause : start} className="gg-startcardio-btn-secondary">
                {isRunning ? <><FiPause /> Pausar</> : <><FiPlay /> Retomar</>}
              </button>
              <button onClick={handleFinish} className="gg-startcardio-btn-primary" disabled={isSaving}>
                <FiCheck /> {isSaving ? 'Salvando...' : 'Finalizar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartCardioPage;