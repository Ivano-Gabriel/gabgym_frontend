// src/hooks/useMetas.js
import { useState } from 'react';

const useMetas = (initialMetas = []) => {
  const [metas, setMetas] = useState(initialMetas);

  const adicionarMeta = (texto, tipo) => {
    if (texto.trim() === '') return;
    const novaMeta = { id: Date.now(), texto, tipo, concluida: false };
    setMetas([novaMeta, ...metas]);
  };

  const removerMeta = (id) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

  const concluirMeta = (id) => {
    setMetas(metas.map(meta => (meta.id === id ? { ...meta, concluida: !meta.concluida } : meta)));
  };

  return {
    metas,
    adicionarMeta,
    removerMeta,
    concluirMeta,
  };
};

export default useMetas;