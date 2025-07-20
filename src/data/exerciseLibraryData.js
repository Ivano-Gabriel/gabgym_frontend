// src/data/exerciseLibraryData.js
import { MUSCLE_GROUP_WORKOUTS } from './workoutDatabase';

const exerciseLibraryData = {
  superior: {
    title: 'Membros Superiores',
    muscleGroups: [
      { name: 'Ombros', items: MUSCLE_GROUP_WORKOUTS['ombro-completo'].exercises },
      { name: 'Costas & Bíceps', items: MUSCLE_GROUP_WORKOUTS['costas-biceps'].exercises },
      { name: 'Peito & Tríceps', items: MUSCLE_GROUP_WORKOUTS['peito-triceps'].exercises },
    ]
  },
  inferior: {
    title: 'Membros Inferiores',
    muscleGroups: [
      { name: 'Pernas Completo', items: MUSCLE_GROUP_WORKOUTS['pernas-completo'].exercises },
      // Podemos adicionar mais grupos aqui no futuro, como "Glúteos" ou "Panturrilhas"
    ]
  }
};

export default exerciseLibraryData; // Exportando como default