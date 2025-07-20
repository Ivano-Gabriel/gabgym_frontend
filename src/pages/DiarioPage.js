// src/pages/DiarioPage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DiarioPage.css';
import FundoDeMetas from './goals.jpeg';
import Modal from '../components/Modal'; // Importando nosso componente de Modal
import { useSearchParams, Link } from 'react-router-dom';

// --- COMPONENTE PARA A ABA DE METAS ---
const MetasContent = () => {
  const [metas, setMetas] = useState([
    { id: 1, texto: 'Correr 5km sem parar', concluida: false, tipo: 'longo_prazo' },
    { id: 2, texto: 'Fazer supino com 80kg', concluida: true, tipo: 'longo_prazo' },
    { id: 3, texto: 'Ir para a academia 5x essa semana', concluida: false, tipo: 'rapida' },
  ]);
  const [novaMetaTexto, setNovaMetaTexto] = useState('');
  const [novoTipoMeta, setNovoTipoMeta] = useState('rapida');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAdicionarMeta = () => {
    if (novaMetaTexto.trim() === '') return;
    const novaMeta = {
      id: Date.now(),
      texto: novaMetaTexto,
      concluida: false,
      tipo: novoTipoMeta,
    };
    setMetas([novaMeta, ...metas]);
    setNovaMetaTexto('');
  };

  const handleRemoverMeta = (id) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

  const handleConcluirMeta = (id) => {
    setMetas(metas.map(meta => (meta.id === id ? { ...meta, concluida: !meta.concluida } : meta)));
  };

  const metasRapidas = metas.filter(meta => meta.tipo === 'rapida' && !meta.concluida);
  const metasLongoPrazo = metas.filter(meta => meta.tipo === 'longo_prazo' && !meta.concluida);
  const metasConcluidas = metas.filter(meta => meta.concluida);

  return (
    <div className="tab-content-item">
      <form className="add-meta-form" onSubmit={(e) => { e.preventDefault(); handleAdicionarMeta(); }}>
        <input 
          type="text" 
          className="meta-input"
          placeholder="Qual sua nova meta, guerreiro(a)?"
          value={novaMetaTexto}
          onChange={(e) => setNovaMetaTexto(e.target.value)}
        />
        <div className="custom-select-container">
          <div className="selected-value" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {novoTipoMeta === 'rapida' ? 'Rápida' : 'Longo Prazo'}
            <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
          </div>
          {isDropdownOpen && (
            <div className="options-list">
              <div className="option-item" onClick={() => { setNovoTipoMeta('rapida'); setIsDropdownOpen(false); }}>
                Rápida
              </div>
              <div className="option-item" onClick={() => { setNovoTipoMeta('longo_prazo'); setIsDropdownOpen(false); }}>
                Longo Prazo
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="add-meta-button">Adicionar</button>
      </form>

      <div className="meta-bloco">
        <h3 className="meta-bloco-title">Metas Rápidas</h3>
        <div className="metas-list">
          {metasRapidas.length > 0 ? metasRapidas.map(meta => (
            <div key={meta.id} className="meta-item">
              <p className="meta-texto">{meta.texto}</p>
              <div className="meta-actions">
                <button className="action-button" title="Concluir" onClick={() => handleConcluirMeta(meta.id)}>✔️</button>
                <button className="action-button" title="Excluir" onClick={() => handleRemoverMeta(meta.id)}>❌</button>
              </div>
            </div>
          )) : <p className="empty-list-message">Sem metas rápidas no momento. Adicione uma!</p>}
        </div>
      </div>

      <div className="meta-bloco">
        <h3 className="meta-bloco-title">Metas de Longo Prazo</h3>
        <div className="metas-list">
          {metasLongoPrazo.length > 0 ? metasLongoPrazo.map(meta => (
            <div key={meta.id} className="meta-item">
              <p className="meta-texto">{meta.texto}</p>
              <div className="meta-actions">
                <button className="action-button" title="Concluir" onClick={() => handleConcluirMeta(meta.id)}>✔️</button>
                <button className="action-button" title="Excluir" onClick={() => handleRemoverMeta(meta.id)}>❌</button>
              </div>
            </div>
          )) : <p className="empty-list-message">Defina uma grande meta para te motivar!</p>}
        </div>
      </div>
      
      <div className="meta-bloco">
        <h3 className="meta-bloco-title">Conquistas</h3>
        <div className="metas-list">
          {metasConcluidas.length > 0 ? metasConcluidas.map(meta => (
            <div key={meta.id} className="meta-item concluida">
              <p className="meta-texto">{meta.texto}</p>
              <div className="meta-actions">
                <button className="action-button" title="Reativar" onClick={() => handleConcluirMeta(meta.id)}>↩️</button>
                <button className="action-button" title="Excluir" onClick={() => handleRemoverMeta(meta.id)}>❌</button>
              </div>
            </div>
          )) : <p className="empty-list-message">Conclua uma meta para vê-la aqui!</p>}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PARA A ABA DE FOTOS ---
const FotosContent = () => {
  const [fotos, setFotos] = useState([]);
  const [showFotoModal, setShowFotoModal] = useState(false);
  const [fotoParaAdicionar, setFotoParaAdicionar] = useState(null);
  const [legenda, setLegenda] = useState('');

  const handleFotoSelecionada = (event) => {
    if (event.target.files && event.target.files[0]) {
      const arquivoDaFoto = event.target.files[0];
      setFotoParaAdicionar({
        url: URL.createObjectURL(arquivoDaFoto),
        data: new Date().toLocaleDateString('pt-BR'),
      });
      setShowFotoModal(true);
    }
  };

  const handleSalvarFoto = () => {
    if (!fotoParaAdicionar) return;
    const novaFoto = {
      ...fotoParaAdicionar,
      id: Date.now(),
      legenda: legenda,
    };
    setFotos([novaFoto, ...fotos]);
    setShowFotoModal(false);
    setFotoParaAdicionar(null);
    setLegenda('');
  };

  const handleDeletarFoto = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      setFotos(fotos.filter(foto => foto.id !== id));
    }
  };

  return (
    <div className="tab-content-item">
      <div className="upload-container">
        <input 
          type="file" 
          id="upload-foto-input" 
          style={{ display: 'none' }} 
          onChange={handleFotoSelecionada}
          accept="image/*"
        />
        <label htmlFor="upload-foto-input" className="upload-foto-button">
          + Adicionar Foto de Evolução
        </label>
      </div>

      <div className="fotos-grid">
        {fotos.map(foto => (
          <div key={foto.id} className="foto-card">
            <img src={foto.url} alt={foto.legenda || `Foto de ${foto.data}`} />
            <div className="foto-info">
              <span className='foto-legenda'>{foto.legenda}</span>
              <span className='foto-data'>{foto.data}</span>
            </div>
            <button className="delete-foto-button" onClick={() => handleDeletarFoto(foto.id)}>❌</button>
          </div>
        ))}
      </div>
       {fotos.length === 0 && <p className="empty-list-message">Nenhuma foto registrada. Adicione sua primeira foto de evolução!</p>}

      <Modal 
        isOpen={showFotoModal}
        onClose={() => setShowFotoModal(false)}
        title="Adicionar Foto ao Diário"
      >
        <div className="foto-modal-content">
          {fotoParaAdicionar && <img src={fotoParaAdicionar.url} alt="Preview" className="foto-preview-modal" />}
          <textarea 
            className="legenda-input"
            placeholder="Adicione uma legenda... (Ex: 85kg, final do bulking)"
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
          />
          <button className="salvar-foto-button" onClick={handleSalvarFoto}>
            Salvar Foto
          </button>
        </div>
      </Modal>
    </div>
  );
};

// --- COMPONENTE PARA A ABA DE CARDIO ---
const CardioContent = () => {
  const [historicoCardio, setHistoricoCardio] = useState([
    { id: 1, tipo: 'Corrida', duracao: 30, distancia: 5, data: '13/07/2025' },
    { id: 2, tipo: 'Bicicleta', duracao: 45, distancia: 15, data: '12/07/2025' },
  ]);
  const [tipoCardio, setTipoCardio] = useState('Corrida');
  const [duracao, setDuracao] = useState('');
  const [distancia, setDistancia] = useState('');

  const handleAddCardio = (e) => {
    e.preventDefault();
    if (!duracao) {
      alert('Por favor, informe a duração do treino.');
      return;
    }
    const novoRegistro = {
      id: Date.now(),
      tipo: tipoCardio,
      duracao: parseInt(duracao),
      distancia: distancia ? parseFloat(distancia) : null,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    setHistoricoCardio([novoRegistro, ...historicoCardio]);
    setDuracao('');
    setDistancia('');
  };

  return (
    <div className="tab-content-item">
      <form className="cardio-form" onSubmit={handleAddCardio}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo-cardio">Atividade</label>
            <select id="tipo-cardio" value={tipoCardio} onChange={(e) => setTipoCardio(e.target.value)}>
              <option value="Corrida">Corrida</option>
              <option value="Caminhada">Caminhada</option>
              <option value="Bicicleta">Bicicleta</option>
              <option value="Elíptico">Elíptico</option>
              <option value="Escada">Escada</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="duracao">Duração (min)</label>
            <input id="duracao" type="number" value={duracao} onChange={(e) => setDuracao(e.target.value)} placeholder="Ex: 30" />
          </div>
          <div className="form-group">
            <label htmlFor="distancia">Distância (km)</label>
            <input id="distancia" type="number" value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
        <button type="submit" className="add-cardio-button">Registrar Treino</button>
      </form>

      <div className="cardio-history">
        <h3 className="history-title">Seu Histórico</h3>
        {historicoCardio.length > 0 ? historicoCardio.map(treino => (
          <div key={treino.id} className="history-item">
            <div className="history-icon">🏃‍♂️</div>
            <div className="history-details">
              <strong>{treino.tipo}</strong>
              <span>{treino.duracao} min {treino.distancia ? `- ${treino.distancia} km` : ''}</span>
            </div>
            <div className="history-date">{treino.data}</div>
          </div>
        )) : <p className="empty-list-message">Nenhum treino de cardio registrado ainda.</p>}
      </div>
    </div>
  );
};

// --- COMPONENTE PARA A ABA DE DIETA (EXTRATO DIÁRIO) ---
const DietaContent = () => {
  const [historicoDieta, setHistoricoDieta] = useState([
    { id: 1, data: '14/07/2025', calorias: 2550, proteinas: 180, carboidratos: 250, gorduras: 70, obs: 'Dia bom, segui o plano.' },
    { id: 2, data: '13/07/2025', calorias: 2800, proteinas: 150, carboidratos: 300, gorduras: 90, obs: 'Comi uma sobremesa a mais.' },
  ]);
  const [calorias, setCalorias] = useState('');
  const [proteinas, setProteinas] = useState('');
  const [carboidratos, setCarboidratos] = useState('');
  const [gorduras, setGorduras] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const hoje = new Date().toLocaleDateString('pt-BR');
  const registroDeHoje = historicoDieta.find(d => d.data === hoje);

  const handleRegistrarExtrato = (e) => {
    e.preventDefault();
    if (registroDeHoje) { alert('Você já registrou o extrato da sua dieta hoje!'); return; }
    if (!calorias || !proteinas || !carboidratos || !gorduras) { alert('Por favor, preencha todos os macros.'); return; }
    const novoExtrato = {
      id: Date.now(), data: hoje, calorias: parseInt(calorias), proteinas: parseInt(proteinas),
      carboidratos: parseInt(carboidratos), gorduras: parseInt(gorduras), obs: observacoes,
    };
    setHistoricoDieta([novoExtrato, ...historicoDieta]);
    setCalorias(''); setProteinas(''); setCarboidratos(''); setGorduras(''); setObservacoes('');
  };

  return (
    <div className="tab-content-item">
      {registroDeHoje ? (
        <div className="dieta-checkin-container"><p className="checkin-message">Você já registrou sua dieta hoje! 🔥</p></div>
      ) : (
        <form className="dieta-form" onSubmit={handleRegistrarExtrato}>
          <div className="form-row">
            <div className="form-group"><label htmlFor="calorias">Total de Calorias (kcal)</label><input id="calorias" type="number" value={calorias} onChange={(e) => setCalorias(e.target.value)} placeholder="Ex: 2500" /></div>
            <div className="form-group"><label htmlFor="proteinas">Proteínas (g)</label><input id="proteinas" type="number" value={proteinas} onChange={(e) => setProteinas(e.target.value)} placeholder="Ex: 180" /></div>
            <div className="form-group"><label htmlFor="carboidratos">Carboidratos (g)</label><input id="carboidratos" type="number" value={carboidratos} onChange={(e) => setCarboidratos(e.target.value)} placeholder="Ex: 250" /></div>
            <div className="form-group"><label htmlFor="gorduras">Gorduras (g)</label><input id="gorduras" type="number" value={gorduras} onChange={(e) => setGorduras(e.target.value)} placeholder="Ex: 70" /></div>
          </div>
          <div className="form-group-full"><label htmlFor="observacoes">Observações do dia</label><textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Opcional. Ex: Me senti com mais energia..."></textarea></div>
          <button type="submit" className="add-refeicao-button">Registrar Dieta do Dia</button>
        </form>
      )}
      <div className="extrato-history">
        <h3 className="history-title">Seu Extrato Nutricional</h3>
        {historicoDieta.map(dia => (
          <div key={dia.id} className="extrato-item">
            <div className="extrato-data">{dia.data}</div>
            <div className="extrato-macros">
              <div><strong>{dia.calorias}</strong> kcal</div>
              <div><strong>{dia.proteinas}</strong> g Prot</div>
              <div><strong>{dia.carboidratos}</strong> g Carb</div>
              <div><strong>{dia.gorduras}</strong> g Gord</div>
            </div>
            {dia.obs && <div className="extrato-obs"><strong>Obs:</strong> {dia.obs}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function DiarioPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('fotos');
  const [searchParams] = useSearchParams();

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${FundoDeMetas})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: 'calc(100vh - 70px)',
    padding: '20px',
    boxSizing: 'border-box'
  };

  return (
    <div className="diario-page-container" style={pageStyle}>
      <h2 className="diario-title">Metas</h2>
      <p className="diario-subtitle">Registre sua evolução diária. A consistência é a chave.</p>

      <div className="diario-tabs">
        <button className={`diario-tab-button ${activeTab === 'metas' ? 'active' : ''}`} onClick={() => setActiveTab('metas')}>Metas</button>
        <button className={`diario-tab-button ${activeTab === 'fotos' ? 'active' : ''}`} onClick={() => setActiveTab('fotos')}>Fotos</button>
        <button className={`diario-tab-button ${activeTab === 'cardio' ? 'active' : ''}`} onClick={() => setActiveTab('cardio')}>Cardio</button>
        <button className={`diario-tab-button ${activeTab === 'dieta' ? 'active' : ''}`} onClick={() => setActiveTab('dieta')}>Dieta</button>
      </div>

      <div className="diario-content">
        {activeTab === 'metas' && <MetasContent />}
        {activeTab === 'fotos' && <FotosContent />}
        {activeTab === 'cardio' && <CardioContent />}
        {activeTab === 'dieta' && <DietaContent />}
      </div>
    </div>
  );
}

export default DiarioPage;