// src/pages/MinhasMetasPage.js — abas Ativas/Histórico, FAB, ícones consistentes

import React, { useState, useEffect } from 'react';
import { getMetas, createMeta, updateMetaStatus } from '../services/apiService';
import { FiTarget, FiAward, FiXCircle, FiChevronDown, FiPlus, FiX } from 'react-icons/fi';
import '../styles/MinhasMetas.css';

const MinhasMetasPage = () => {
  const [metas, setMetas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('ativas');

  const [novaMetaTitulo, setNovaMetaTitulo] = useState('');
  const [novaMetaDescricao, setNovaMetaDescricao] = useState('');

  useEffect(() => {
    carregarMetas();
  }, []);

  const carregarMetas = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const response = await getMetas(userId);
      setMetas(response.data);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    }
  };

  const handleCriarMeta = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const novaMeta = {
        userId: parseInt(userId, 10),
        titulo: novaMetaTitulo,
        descricao: novaMetaDescricao,
        status: 'ATIVA'
      };
      await createMeta(novaMeta);
      setNovaMetaTitulo('');
      setNovaMetaDescricao('');
      setIsModalOpen(false);
      carregarMetas();
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    }
  };

  const handleAtualizarStatus = async (id, novoStatus) => {
    try {
      await updateMetaStatus(id, { status: novoStatus });
      carregarMetas();
    } catch (error) {
      console.error(`Erro ao atualizar meta para ${novoStatus}:`, error);
    }
  };

  const toggleExpandir = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const metasAtivas = metas.filter(m => m.status === 'ATIVA');
  const historicoMetas = metas.filter(m => m.status !== 'ATIVA');

  return (
    <div className="gg-metas-container">

      <div className="gg-metas-top">
        <h1 className="gg-metas-title">Minhas Metas</h1>
        <p className="gg-metas-subtitle">Defina, acompanhe e destrua seus objetivos.</p>
      </div>

      <div className="gg-metas-tabs">
        <button className={`gg-metas-tab ${activeTab === 'ativas' ? 'active' : ''}`} onClick={() => setActiveTab('ativas')}>
          Ativas {metasAtivas.length > 0 && <span className="gg-tab-count">{metasAtivas.length}</span>}
        </button>
        <button className={`gg-metas-tab ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}>
          Histórico
        </button>
      </div>

      {activeTab === 'ativas' && (
        <div className="gg-metas-list fade-in-metas">
          {metasAtivas.length === 0 ? (
            <div className="gg-empty-state">
              <FiTarget className="gg-empty-icon" />
              <p>Nenhuma meta ativa no momento.<br />Toque no + pra criar a primeira.</p>
            </div>
          ) : (
            metasAtivas.map(meta => (
              <div key={meta.id} className={`gg-meta-card ${expandedId === meta.id ? 'expanded' : ''}`}>
                <div className="gg-meta-header" onClick={() => toggleExpandir(meta.id)}>
                  <div className="gg-meta-title">
                    <FiTarget className="gg-meta-icon" />
                    <h3>{meta.titulo}</h3>
                  </div>
                  <FiChevronDown className="gg-expand-icon" />
                </div>

                {expandedId === meta.id && (
                  <div className="gg-meta-body">
                    <p>{meta.descricao || "Sem descrição."}</p>
                    <div className="gg-meta-controls">
                      <button className="gg-btn-concluir" onClick={() => handleAtualizarStatus(meta.id, 'CONCLUIDA')}>
                        <FiAward /> Concluída
                      </button>
                      <button className="gg-btn-desistir" onClick={() => handleAtualizarStatus(meta.id, 'DESISTIDA')}>
                        <FiXCircle /> Desistir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="gg-metas-list fade-in-metas">
          {historicoMetas.length === 0 ? (
            <div className="gg-empty-state">
              <FiAward className="gg-empty-icon" />
              <p>Nenhuma meta no histórico ainda.</p>
            </div>
          ) : (
            historicoMetas.map(meta => (
              <div key={meta.id} className={`gg-meta-card history-card ${meta.status.toLowerCase()}`}>
                <div className="gg-meta-header">
                  <div className="gg-meta-title">
                    {meta.status === 'CONCLUIDA' ? <FiAward className="gg-meta-icon done" /> : <FiXCircle className="gg-meta-icon gave-up" />}
                    <h3 className={meta.status === 'DESISTIDA' ? 'strike' : ''}>{meta.titulo}</h3>
                  </div>
                  <span className={`gg-status-badge ${meta.status.toLowerCase()}`}>
                    {meta.status === 'CONCLUIDA' ? 'Concluída' : 'Desistida'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <button className="gg-fab-nova-meta" onClick={() => setIsModalOpen(true)}>
        <FiPlus /> Nova Meta
      </button>

      {isModalOpen && (
        <div className="gg-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="gg-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="gg-modal-head">
              <h2>Criar Nova Meta</h2>
              <button className="gg-modal-close" onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleCriarMeta}>
              <input
                type="text"
                placeholder="Título (ex: Correr 5km sem parar)"
                value={novaMetaTitulo}
                onChange={(e) => setNovaMetaTitulo(e.target.value)}
                required
              />
              <textarea
                placeholder="Por que essa meta é importante? Qual o plano?"
                value={novaMetaDescricao}
                onChange={(e) => setNovaMetaDescricao(e.target.value)}
                rows="4"
              />
              <div className="gg-modal-actions">
                <button type="button" className="gg-btn-cancelar" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="gg-btn-salvar">Salvar Meta</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MinhasMetasPage;