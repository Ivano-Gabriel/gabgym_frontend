// src/data/exerciseLibraryData.js (Versão Refatorada)

// 1. Importamos nossas NOVAS fontes de dados
import { WORKOUT_GROUPS, EXERCISE_LIBRARY } from './workoutDatabase';

// Função auxiliar para buscar os detalhes completos dos exercícios a partir dos IDs
const getExercisesByGroupId = (groupId) => {
  // Verifica se o grupo existe no nosso WORKOUT_GROUPS
  if (!WORKOUT_GROUPS[groupId] || !WORKOUT_GROUPS[groupId].exerciseIds) {
    console.warn(`Grupo muscular com id "${groupId}" não encontrado em WORKOUT_GROUPS.`);
    return [];
  }
  
  // Usa o array de IDs para buscar cada exercício completo na nossa enciclopédia
  return WORKOUT_GROUPS[groupId].exerciseIds.map(id => EXERCISE_LIBRARY[id]);
};


const exerciseLibraryData = {
  superior: {
    title: 'Membros Superiores',
    muscleGroups: [
      // 2. Agora, em vez de buscar na estrutura antiga, usamos nossa função auxiliar
      { name: 'Peito & Tríceps', items: getExercisesByGroupId('peito-triceps') },
      { name: 'Costas & Bíceps', items: getExercisesByGroupId('costas-biceps') },
      { name: 'Ombros', items: getExercisesByGroupId('ombro-completo') },
      { name: 'Trapézio', items: getExercisesByGroupId('trapezio') },
      { name: 'Antebraços', items: getExercisesByGroupId('antebraco') },
      { name: 'Abdômen', items: getExercisesByGroupId('abdomen') }
    ]
  },
  inferior: {
    title: 'Membros Inferiores',
    muscleGroups: [
      { name: 'Quadríceps', items: getExercisesByGroupId('quadriceps') },
      { name: 'Posterior de Coxa', items: getExercisesByGroupId('posterior-coxa') },
      { name: 'Glúteos', items: getExercisesByGroupId('gluteos') },
      { name: 'Panturrilhas', items: getExercisesByGroupId('panturrilhas') },
      { name: 'Adutores & Abdutores', items: getExercisesByGroupId('adutores-abdutores') }
    ]
  }
};

export default exerciseLibraryData;