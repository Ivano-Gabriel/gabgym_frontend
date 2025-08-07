// src/data/trainingPlans.js (Versão Refatorada)

// 1. Importamos a nossa NOVA base de dados de rotinas
import { ROUTINE_DATABASE } from './workoutDatabase';

// O objeto para o dia de descanso continua perfeito
const REST_DAY = { type: 'rest', title: 'Descanso' };

const malePlans = [
  { 
    id: '3x-male', 
    title: '3x por semana (Full Body)', 
    shortDesc: 'Treino de corpo inteiro com foco em membros superiores.', 
    image: '/images/treino-3x.jpg',
    // 2. Agora, em vez de colocar o objeto todo, colocamos apenas a ROTINA que queremos usar.
    // O '...ROUTINE_DATABASE['full-body-male']' pega todos os dados daquela rotina (title, description, plan)
    // e o 'routineId' serve como uma referência clara de qual rotina estamos usando.
    schedule: [ 
      {...ROUTINE_DATABASE['full-body-male'], routineId: 'full-body-male'}, 
      REST_DAY, 
      {...ROUTINE_DATABASE['full-body-male'], routineId: 'full-body-male'}, 
      REST_DAY, 
      {...ROUTINE_DATABASE['full-body-male'], routineId: 'full-body-male'}, 
      REST_DAY, 
      REST_DAY 
    ]
  },
  { 
    id: '4x-male', 
    title: '4x por semana (Upper/Lower)', 
    shortDesc: 'Dividindo o corpo entre superiores e inferiores, 2x na semana.', 
    image: '/images/treino-4xxx.jpg',
    schedule: [ 
      {...ROUTINE_DATABASE['upper-body'], routineId: 'upper-body'}, 
      {...ROUTINE_DATABASE['lower-body'], routineId: 'lower-body'}, 
      REST_DAY, 
      {...ROUTINE_DATABASE['upper-body'], routineId: 'upper-body'}, 
      {...ROUTINE_DATABASE['lower-body'], routineId: 'lower-body'}, 
      REST_DAY, 
      REST_DAY 
    ]
  },
  {
    id: '5x-male', 
    title: '5x por semana (ABCAB)',
    shortDesc: 'Foco em peito e costas, treinando-os 2x na semana.',
    image: '/images/treino-5x.jpg',
    schedule: [ 
      {...ROUTINE_DATABASE['costas-biceps'], routineId: 'costas-biceps'}, 
      {...ROUTINE_DATABASE['peito-triceps'], routineId: 'peito-triceps'}, 
      {...ROUTINE_DATABASE['pernas-completo'], routineId: 'pernas-completo'}, 
      {...ROUTINE_DATABASE['costas-biceps'], routineId: 'costas-biceps'}, 
      {...ROUTINE_DATABASE['peito-triceps'], routineId: 'peito-triceps'}, 
      REST_DAY, 
      REST_DAY 
    ]
  },
];

const femalePlans = [
  { 
    id: '3x-fem', 
    title: '3x por semana (Full Body)', 
    shortDesc: 'Treino de corpo inteiro com foco em membros inferiores.', 
    image: '/images/treino-fem-3x.jpg',
    schedule: [ 
      {...ROUTINE_DATABASE['full-body-female'], routineId: 'full-body-female'}, 
      REST_DAY, 
      {...ROUTINE_DATABASE['full-body-female'], routineId: 'full-body-female'}, 
      REST_DAY, 
      {...ROUTINE_DATABASE['full-body-female'], routineId: 'full-body-female'}, 
      REST_DAY, 
      REST_DAY 
    ]
  },
  { 
    id: '4x-fem', 
    title: '4x por semana (Upper/Lower)', 
    shortDesc: 'Foco em treinar pernas 2x na semana com bom descanso.', 
    image: '/images/treino-fem-4x.jpg',
    schedule: [ 
      {...ROUTINE_DATABASE['lower-body'], routineId: 'lower-body'}, 
      {...ROUTINE_DATABASE['upper-body'], routineId: 'upper-body'}, 
      REST_DAY, 
      {...ROUTINE_DATABASE['lower-body'], routineId: 'lower-body'}, 
      {...ROUTINE_DATABASE['upper-body'], routineId: 'upper-body'}, 
      REST_DAY, 
      REST_DAY 
    ]
  },
  {
    id: '5x-fem', 
    title: '5x por semana (ABCB + Descanso)',
    shortDesc: 'Alto volume para pernas, treinando-as 2x, com descanso estratégico.',
    image: '/images/treino-fem-5x.jpg',
    schedule: [ 
      {...ROUTINE_DATABASE['peito-triceps'], routineId: 'peito-triceps'}, 
      {...ROUTINE_DATABASE['pernas-completo'], routineId: 'pernas-completo'}, 
      {...ROUTINE_DATABASE['costas-biceps'], routineId: 'costas-biceps'}, 
      {...ROUTINE_DATABASE['pernas-completo'], routineId: 'pernas-completo'}, 
      REST_DAY, 
      REST_DAY, 
      REST_DAY 
    ]
  },
];

export const trainingPlans = {
  male: malePlans,
  female: femalePlans,
};