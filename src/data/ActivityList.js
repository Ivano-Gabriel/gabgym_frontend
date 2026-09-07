// src/data/ActivityList.js
import { FaRunning, FaBicycle, FaEllipsisH, FaFire, FaTree, FaFutbol } from 'react-icons/fa';

// Usaremos os ícones do Font Awesome (Fa)
export const ACTIVITIES = [
  { id: 'treadmill', name: 'Esteira', icon: <FaRunning /> },
  { id: 'stationary_bike', name: 'Bike Ergométrica', icon: <FaBicycle /> },
  { id: 'elliptical', name: 'Elíptico', icon: <FaEllipsisH /> },
  { id: 'jump_rope', name: 'Pular Corda', icon: <FaFire /> },
  { id: 'outdoor_run', name: 'Corrida na Rua', icon: <FaTree /> },
  { id: 'soccer', name: 'Futebolzinho', icon: <FaFutbol /> },
];