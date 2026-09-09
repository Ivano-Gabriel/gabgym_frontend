import React, { useState, useEffect } from 'react';
import api from '../services/apiService'; // Ajuste o caminho conforme seu projeto
import '../styles/MinhasMetas.css'; // Vamos criar este CSS abaixo

const MinhasMetasPage = () => {
  const [metas, setMetas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  // Estados do formulário
  const [novaMetaTitulo, setNovaMetaTitulo] = useState('');
  const [novaMetaDescricao, setNovaMetaDescricao] = useState('');

  // Busca as metas do banco de dados (Java) ao carregar a página
  useEffect(() => {
    carregarMetas();
  }, []);

  const carregarMetas = async () => {
    try {
      // Supondo que você criou essa rota no Java e no apiService
      const response = await api.get('/metas'); 
      setMetas(response.data);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    }
  };

  const handleCriarMeta = async (e) => {
    e.preventDefault();
    try {
      const novaMeta = {
        titulo: novaMetaTitulo,
        descricao: novaMetaDescricao,
        status: 'ATIVA'
      };
      await api.post('/metas', novaMeta);
      setNovaMetaTitulo('');
      setNovaMetaDescricao('');
      setIsModalOpen(false);
      carregarMetas(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    }
  };

  const handleAtualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/metas/${id}/status`, { status: novoStatus });
      carregarMetas(); // Atualiza a lista após concluir/desistir
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
      <header className="gg-metas-header">
        <div>
          <h1>MINHAS METAS</h1>
          <p>Defina, acompanhe e destrua seus objetivos.</p>
        </div>
        <button className="gg-btn-nova-meta" onClick={() => setIsModalOpen(true)}>
          + NOVA META
        </button>
      </header>

      {/* MODAL NOVA META */}
      {isModalOpen && (
        <div className="gg-modal-overlay">
          <div className="gg-modal-content">
            <h2>Criar Nova Meta</h2>
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

      {/* METAS ATIVAS */}
      <section className="gg-metas-section">
        <h2 className="gg-section-title">METAS PRINCIPAIS</h2>
        {metasAtivas.length === 0 ? (
          <p className="gg-empty-text">Nenhuma meta ativa no momento. Clique em + para começar.</p>
        ) : (
          <div className="gg-metas-list">
            {metasAtivas.map(meta => (
              <div key={meta.id} className={`gg-meta-card ${expandedId === meta.id ? 'expanded' : ''}`}>
                <div className="gg-meta-header" onClick={() => toggleExpandir(meta.id)}>
                  <div className="gg-meta-title">
                    <span className="gg-target-icon">🎯</span>
                    <h3>{meta.titulo}</h3>
                  </div>
                  <span className="gg-expand-icon">{expandedId === meta.id ? '▲' : '▼'}</span>
                </div>
                
                {expandedId === meta.id && (
                  <div className="gg-meta-body">
                    <p>{meta.descricao || "Sem descrição."}</p>
                    <div className="gg-meta-controls">
                      <button 
                        className="gg-btn-concluir" 
                        onClick={() => handleAtualizarStatus(meta.id, 'CONCLUIDA')}>
                        ✓ CONCLUÍDA
                      </button>
                      <button 
                        className="gg-btn-desistir" 
                        onClick={() => handleAtualizarStatus(meta.id, 'DESISTIDA')}>
                        ✕ DESISTIR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HISTÓRICO */}
      <section className="gg-metas-section">
        <h2 className="gg-section-title">SEU HISTÓRICO RECENTE</h2>
        {historicoMetas.length === 0 ? (
          <p className="gg-empty-text">Nenhuma atividade encontrada no seu histórico.</p>
        ) : (
          <div className="gg-metas-list">
            {historicoMetas.map(meta => (
              <div key={meta.id} className={`gg-meta-card history-card ${meta.status.toLowerCase()}`}>
                <div className="gg-meta-header">
                  <div className="gg-meta-title">
                    <span className="gg-status-icon">
                      {meta.status === 'CONCLUIDA' ? '🏆' : '💀'}
                    </span>
                    <h3 style={{ textDecoration: meta.status === 'DESISTIDA' ? 'line-through' : 'none' }}>
                      {meta.titulo}
                    </h3>
                  </div>
                  <span className={`gg-status-badge ${meta.status.toLowerCase()}`}>
                    {meta.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MinhasMetasPage;