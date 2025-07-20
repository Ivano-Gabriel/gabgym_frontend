// src/data/trainingPlans.js
import { MUSCLE_GROUP_WORKOUTS } from './workoutDatabase';

// Objeto especial para o dia de descanso
const REST_DAY = { type: 'rest', title: 'Descanso' };

const malePlans = [
  { 
    id: '3x-male', title: '3x por semana (Full Body)', 
    shortDesc: 'Treino de corpo inteiro com foco em membros superiores.', 
    image: '/images/treino-3x.jpg', 
    schedule: [ MUSCLE_GROUP_WORKOUTS['full-body-male'], REST_DAY, MUSCLE_GROUP_WORKOUTS['full-body-male'], REST_DAY, MUSCLE_GROUP_WORKOUTS['full-body-male'], REST_DAY, REST_DAY ]
  },
  { 
    id: '4x-male', title: '4x por semana (Upper/Lower)', 
    shortDesc: 'Dividindo o corpo entre superiores e inferiores, 2x na semana.', 
    image: '/images/treino-4x.jpg',
    schedule: [ MUSCLE_GROUP_WORKOUTS['upper-body'], MUSCLE_GROUP_WORKOUTS['lower-body'], REST_DAY, MUSCLE_GROUP_WORKOUTS['upper-body'], MUSCLE_GROUP_WORKOUTS['lower-body'], REST_DAY, REST_DAY ]
  },
  {
    id: '5x-male', title: '5x por semana (ABCAB)',
    shortDesc: 'Foco em peito e costas, treinando-os 2x na semana.',
    image: '/images/treino-5x.jpg',
    schedule: [ MUSCLE_GROUP_WORKOUTS['costas-biceps'], MUSCLE_GROUP_WORKOUTS['peito-triceps'], MUSCLE_GROUP_WORKOUTS['pernas-completo'], MUSCLE_GROUP_WORKOUTS['costas-biceps'], MUSCLE_GROUP_WORKOUTS['peito-triceps'], REST_DAY, REST_DAY ]
  },
  // Adicionaremos o 6x aqui no futuro
];

const femalePlans = [
  { 
    id: '3x-fem', title: '3x por semana (Full Body)', 
    shortDesc: 'Treino de corpo inteiro com foco em membros inferiores.', 
    image: '/images/treino-fem-3x.jpg',
    schedule: [ MUSCLE_GROUP_WORKOUTS['full-body-female'], REST_DAY, MUSCLE_GROUP_WORKOUTS['full-body-female'], REST_DAY, MUSCLE_GROUP_WORKOUTS['full-body-female'], REST_DAY, REST_DAY ]
  },
  { 
    id: '4x-fem', title: '4x por semana (Upper/Lower)', 
    shortDesc: 'Foco em treinar pernas 2x na semana com bom descanso.', 
    image: '/images/treino-fem-4x.jpg',
    schedule: [ MUSCLE_GROUP_WORKOUTS['lower-body'], MUSCLE_GROUP_WORKOUTS['upper-body'], REST_DAY, MUSCLE_GROUP_WORKOUTS['lower-body'], MUSCLE_GROUP_WORKOUTS['upper-body'], REST_DAY, REST_DAY ]
  },
  {
    id: '5x-fem', title: '5x por semana (ABCB + Descanso)',
    shortDesc: 'Alto volume para pernas, treinando-as 2x, com descanso estratégico.',
    image: '/images/treino-fem-5x.jpg',
    schedule: [ MUSCLE_GROUP_WORKOUTS['peito-triceps'], MUSCLE_GROUP_WORKOUTS['pernas-completo'], MUSCLE_GROUP_WORKOUTS['costas-biceps'], MUSCLE_GROUP_WORKOUTS['pernas-completo'], REST_DAY, REST_DAY, REST_DAY ]
  },
];

export const trainingPlans = {
  male: malePlans,
  female: femalePlans,
};