// src/data/exerciseLibraryData.js
import { MUSCLE_GROUP_WORKOUTS } from './workoutDatabase';

const exerciseLibraryData = {
  superior: {
    title: 'Membros Superiores',
    muscleGroups: [
      { name: 'Peito & Tríceps', items: MUSCLE_GROUP_WORKOUTS['peito-triceps'].exercises },
      { name: 'Costas & Bíceps', items: MUSCLE_GROUP_WORKOUTS['costas-biceps'].exercises },
      { name: 'Ombros', items: MUSCLE_GROUP_WORKOUTS['ombro-completo'].exercises },
      { name: 'Trapézio', items: MUSCLE_GROUP_WORKOUTS['trapezio'].exercises },
      { name: 'Antebraços', items: MUSCLE_GROUP_WORKOUTS['antebraco'].exercises }, // <-- CORRIGIDO AQUI
      { name: 'Abdômen', items: MUSCLE_GROUP_WORKOUTS['abdomen'].exercises }
    ]
  },
  inferior: {
    title: 'Membros Inferiores',
    muscleGroups: [
      { name: 'Quadríceps', items: MUSCLE_GROUP_WORKOUTS['quadriceps'].exercises },
      { name: 'Posterior de Coxa', items: MUSCLE_GROUP_WORKOUTS['posterior-coxa'].exercises },
      { name: 'Glúteos', items: MUSCLE_GROUP_WORKOUTS['gluteos'].exercises },
      { name: 'Panturrilhas', items: MUSCLE_GROUP_WORKOUTS['panturrilhas'].exercises },
      { name: 'Adutores & Abdutores', items: MUSCLE_GROUP_WORKOUTS['adutores-abdutores'].exercises } // <-- ADICIONADO AQUI
    ]
  }
};

export default exerciseLibraryData;