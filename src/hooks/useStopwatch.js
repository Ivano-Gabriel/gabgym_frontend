// src/hooks/useStopwatch.js (Versão Profissional)
import { useState, useRef, useEffect, useCallback } from 'react';

export const useStopwatch = (initialState = 0) => {
  const [time, setTime] = useState(initialState);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  // useCallback garante que a função não seja recriada a cada renderização
  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTime(0);
  }, []);

  // O cérebro do nosso cronômetro.
  // Este useEffect gerencia o setInterval de forma segura.
  useEffect(() => {
    // Se não estiver ativo, não faz nada
    if (!isActive) {
      return;
    }

    // Se estiver ativo, cria o intervalo
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // A MÁGICA ESTÁ AQUI: A função de limpeza
    // Isso garante que, quando o componente for desmontado ou o estado mudar,
    // o timer antigo seja destruído antes de criar um novo.
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isActive]); // Roda essa lógica sempre que 'isActive' mudar

  // Retorna os nomes que a gente tentou usar antes, para ser mais intuitivo
  return { seconds: time, isRunning: isActive, start, pause, reset };
};