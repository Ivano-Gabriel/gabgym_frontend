// src/pages/CardioPage.js (Versão Final com GPS e Cálculos Corrigidos)

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './CardioPage.css';

// --- CORREÇÃO DO ÍCONE DO MARCADOR ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- FIM DA CORREÇÃO ---


// =================================================================
// FUNÇÕES AUXILIARES
// =================================================================

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(val => val.toString().padStart(2, '0'))
    .join(':');
};

const calculatePace = (timeInSeconds, distanceInKm) => {
    if (distanceInKm === 0) return '00:00';
    const paceInMinutes = (timeInSeconds / 60) / distanceInKm;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
};

// Fórmula de calorias baseada na distância (muito mais precisa)
// Aproximação padrão: 1 caloria por quilograma de peso corporal por quilômetro percorrido.
const calculateCalories = (distanceInKm, weightKg = 75) => {
    return Math.round(distanceInKm * weightKg);
};

// =================================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// =================================================================

function CardioPage() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState('00:00');
  const [position, setPosition] = useState([-9.5186, -36.0625]);
  const [path, setPath] = useState([]);
  
  const intervalRef = useRef(null);
  const mapRef = useRef(null);

  // Vigia do cronômetro
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  // Vigia do GPS
  useEffect(() => {
    if (isActive && !isPaused) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = [latitude, longitude];
          setPosition(newPosition);
          
          setPath((prevPath) => {
            const newPath = [...prevPath, newPosition];
            if (newPath.length > 1) {
              const lastPoint = newPath[newPath.length - 2];
              const newDistanceSegment = calculateDistance(lastPoint[0], lastPoint[1], newPosition[0], newPosition[1]);
              
              // Atualiza a distância total
              setDistance(prevDistance => prevDistance + newDistanceSegment);
            }
            return newPath;
          });

          if (mapRef.current) {
            mapRef.current.flyTo(newPosition, 16);
          }
        },
        (error) => console.error("Erro ao obter GPS:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isActive, isPaused]);

  // Vigia para atualizar calorias e pace SOMENTE quando os dados mudam
  useEffect(() => {
      setCalories(calculateCalories(distance)); // Calorias agora dependem da distância
      setPace(calculatePace(time, distance));
  }, [time, distance]);

  const handleStart = () => {
    setTime(0);
    setDistance(0);
    setCalories(0);
    setPace('00:00');
    setPath([]);

    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const startPosition = [latitude, longitude];
        setPosition(startPosition);
        setPath([startPosition]);
        if (mapRef.current) {
            mapRef.current.flyTo(startPosition, 16);
        }
        setIsActive(true);
        setIsPaused(false);
    }, 
    (error) => {
        console.error("Não foi possível obter a localização inicial:", error);
        alert("Por favor, habilite a permissão de localização no seu navegador para iniciar a atividade.");
    });
  };

  const handlePauseResume = () => setIsPaused(!isPaused);
  
  const handleFinish = () => {
    setIsActive(false);
    setIsPaused(true);
    
    // AQUI, NO FUTURO, VAI A LÓGICA PARA SALVAR OS DADOS
    console.log("Atividade Finalizada:", { time, distance, calories, path });

    // AGORA SIM, ZERANDO TUDO AO CONCLUIR
    setTime(0);
    setDistance(0);
    setCalories(0);
    setPace('00:00');
    setPath([]);
  };

  return (
    <div className="cardio-page-container">
      <div className="metrics-panel">
        <div className="main-metric">
          <span id="duration">{formatTime(time)}</span>
          <label>Duração</label>
        </div>
        <div className="secondary-metrics">
          <div><span>{distance.toFixed(2)}</span><label>Distância (km)</label></div>
          <div><span>{calories}</span><label>Calorias (kcal)</label></div>
          <div><span>{pace}</span><label>Ritmo médio (min/km)</label></div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={position} zoom={16} scrollWheelZoom={false} ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>Você está aqui!</Popup>
          </Marker>
          <Polyline pathOptions={{ color: 'var(--primaryGreen)', weight: 6, opacity: 0.8 }} positions={path} />
        </MapContainer>
      </div>

      <div className="controls-panel">
        {!isActive ? (
          <button className="start-button" onClick={handleStart}>INICIAR</button>
        ) : (
          <div className="running-controls">
            <button className="pause-button" onClick={handlePauseResume}>{isPaused ? 'RETOMAR' : 'PAUSA'}</button>
            <button className="finish-button" onClick={handleFinish}>CONCLUIR</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardioPage;