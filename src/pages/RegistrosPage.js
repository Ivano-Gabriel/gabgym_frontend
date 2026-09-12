// src/pages/RegistrosPage.js — hub de tudo que foi registrado no dia (comida, cardio, água...)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDiaryLogs, deleteDiaryLog } from '../services/apiService';
import { FiTrash2, FiActivity, FiCoffee, FiDroplet, FiArrowLeft, FiClock, FiMapPin } from 'react-icons/fi';
import './RegistrosPage.css';

const ICONS = { food: FiCoffee, cardio: FiActivity, exercise: FiActivity, water: FiDroplet };

function RegistrosPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarLogs = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const hoje = new Date().toLocaleDateString('en-CA');
    setLoading(true);
    getDiaryLogs(userId, hoje)
      .then(response => {
        const ordenado = [...response.data].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setLogs(ordenado);
      })
      .catch(err => {
        console.error('Erro ao buscar registros:', err);
        toast.error('Não foi possível carregar seus registros de hoje.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    deleteDiaryLog(id)
      .then(() => {
        setLogs(prev => prev.filter(log => log.id !== id));
        toast.success('Registro removido.');
      })
      .catch(err => {
        console.error('Erro ao remover registro:', err);
        toast.error('Não foi possível remover esse registro.');
      });
  };

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}min ${seconds}s`;
  };

  return (
    <div className="gg-registros-container">
      <div className="gg-registros-card">

        <div className="gg-registros-top">
          <h1 className="gg-registros-title">Registros de Hoje</h1>
          <p className="gg-registros-subtitle">Tudo que você registrou hoje: comida, cardio e água.</p>
        </div>

        {loading ? (
          <p className="gg-registros-status">Carregando...</p>
        ) : logs.length === 0 ? (
          <div className="gg-registros-empty">
            <p>Nada registrado ainda hoje.<br />Vai lá registrar sua primeira comida ou atividade!</p>
          </div>
        ) : (
          <div className="gg-registros-list">
            {logs.map(log => {
              const Icon = ICONS[log.type] || FiActivity;
              return (
                <div key={log.id} className={`gg-registro-item ${log.type}`}>
                  <div className="gg-registro-icon"><Icon /></div>
                  <div className="gg-registro-info">
                    <span className="gg-registro-name">{log.name}</span>
                    <span className="gg-registro-meta">
                      {log.calories != null && `${log.calories} kcal`}
                      {log.volume != null && `${log.volume} ml`}
                      {log.durationSeconds != null && <> · <FiClock size={11} /> {formatDuration(log.durationSeconds)}</>}
                      {log.distanceKm != null && <> · <FiMapPin size={11} /> {log.distanceKm.toFixed(2)} km</>}
                    </span>
                  </div>
                  <button className="gg-registro-delete" onClick={() => handleDelete(log.id)} title="Remover">
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <Link to="/perfil" className="gg-registros-back"><FiArrowLeft /> Voltar pro Perfil</Link>
      </div>
    </div>
  );
}

export default RegistrosPage;