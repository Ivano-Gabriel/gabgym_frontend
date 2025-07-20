// src/data/workoutDatabase.js
export const MUSCLE_GROUP_WORKOUTS = {
  'peito-triceps': { 
    title: 'Peito & Tríceps', 
    exercises: [
      { type: 'subheading', text: 'PEITO' },
      { name: 'Supino Reto', description: 'Deite-se no banco, pegada um pouco mais larga que os ombros. Desça a barra até tocar o peito e empurre de volta à posição inicial.' },
      { name: 'Supino Inclinado com Halteres', description: 'Deite-se no banco inclinado, segure os halteres na altura do peito e empurre para cima até estender os braços.' },
      { name: 'Voador (Peck Deck)', description: 'Sente-se na máquina, ajuste a altura. Junte os braços à frente do corpo, contraindo o peitoral.' },
      { type: 'subheading', text: 'TRÍCEPS' },
      { name: 'Tríceps Polia Corda', description: 'Na polia alta, segure a corda e empurre para baixo até estender completamente os cotovelos.' },
      { name: 'Tríceps Francês', description: 'Deitado, segure a barra ou halteres acima da cabeça e flexione os cotovelos, descendo o peso atrás da cabeça.' },
    ] 
  },
  'costas-biceps': { 
    title: 'Costas & Bíceps', 
    exercises: [
        { type: 'subheading', text: 'COSTAS' },
        { name: 'Puxada Alta (Pulley)', description: 'Sente-se na máquina, pegada aberta. Puxe a barra até a parte superior do peito, contraindo as costas.' },
        { name: 'Remada Curvada', description: 'Incline o tronco para frente, costas retas. Puxe a barra em direção ao abdômen.' },
        { name: 'Serrote com Halter', description: 'Apoie um joelho e uma mão no banco. Puxe o halter para cima, ao lado do corpo.' },
        { type: 'subheading', text: 'BÍCEPS' },
        { name: 'Rosca Direta com Barra', description: 'Em pé, segure a barra com as palmas para cima. Flexione os cotovelos, subindo a barra.' },
        { name: 'Rosca Martelo', description: 'Em pé, segure os halteres com as palmas viradas uma para a outra (pegada neutra). Flexione os cotovelos.' },
    ] 
  },
  'ombro-completo': { 
    title: 'Ombros Completo', 
    exercises: [
        { name: 'Desenvolvimento com Halteres', description: 'Sente-se com as costas retas e levante os halteres acima da cabeça até a extensão completa dos cotovelos.' },
        { name: 'Elevação Lateral', description: 'Mantenha os cotovelos ligeiramente flexionados e eleve os halteres até a altura dos ombros.' },
        { name: 'Elevação Frontal', description: 'Eleve os halteres à frente do corpo até a altura dos ombros, mantendo os braços estendidos.' },
        { name: 'Crucifixo Inverso na Máquina', description: 'Sente-se virado para a máquina. Abra os braços para trás, contraindo a parte posterior dos ombros.' },
    ] 
  },
  'pernas-completo': { 
    title: 'Pernas Completo', 
    exercises: [
        { type: 'subheading', text: 'QUADRÍCEPS & GLÚTEOS' },
        { name: 'Agachamento Livre', description: 'Com a barra nas costas, desça como se fosse sentar em uma cadeira, mantendo as costas retas.' },
        { name: 'Leg Press 45°', description: 'Sente-se na máquina, pés na plataforma. Empurre a plataforma até estender as pernas.' },
        { name: 'Cadeira Extensora', description: 'Sente-se e estenda as pernas para cima, contraindo o quadríceps.' },
        { type: 'subheading', text: 'POSTERIOR & PANTURRILHA' },
        { name: 'Stiff com Barra', description: 'Desça a barra em direção ao chão, mantendo as pernas quase retas e as costas retas.' },
        { name: 'Mesa Flexora', description: 'Deitado de bruços, flexione os joelhos, puxando o rolo em direção aos glúteos.' },
        { name: 'Panturrilha em pé', description: 'Fique na ponta dos pés, elevando os calcanhares o máximo possível.' },
    ] 
  },
  'upper-body': {
    title: 'Membros Superiores',
    exercises: [
      { type: 'subheading', text: 'FOCO EM PEITO & TRÍCEPS' },
      { name: 'Supino Reto', description: '3x10' },
      { name: 'Voador', description: '3x12' },
      { name: 'Tríceps Polia Corda', description: '3x12' },
      { type: 'subheading', text: 'FOCO EM COSTAS & BÍCEPS' },
      { name: 'Puxada Alta', description: '3x10' },
      { name: 'Rosca Martelo', description: '3x12' },
    ]
  },
  'lower-body': {
    title: 'Membros Inferiores',
    exercises: [
      { type: 'subheading', text: 'FOCO EM QUADRÍCEPS & GLÚTEOS' },
      { name: 'Agachamento com Barra', description: '3x10' },
      { name: 'Leg Press', description: '3x12' },
      { name: 'Cadeira Abdutora', description: '3x15' },
      { type: 'subheading', text: 'FOCO EM POSTERIOR & PANTURRILHA' },
      { name: 'Stiff', description: '3x12' },
      { name: 'Panturrilha em pé', description: '4x20' },
    ]
  },
  'full-body-male': {
    title: 'Full Body (Foco Superior)',
    exercises: [
      { name: 'Supino Reto', description: '3x10 - Peito' },
      { name: 'Puxada Alta', description: '3x10 - Costas' },
      { name: 'Agachamento com Barra', description: '3x12 - Pernas' },
      { name: 'Elevação Lateral', description: '3x15 - Ombros' },
      { name: 'Rosca Direta', description: '3x12 - Bíceps' },
    ]
  },
  'full-body-female': {
    title: 'Full Body (Foco Inferior)',
    exercises: [
      { name: 'Agachamento com Barra', description: '3x12 - Pernas' },
      { name: 'Elevação Pélvica', description: '3x15 - Glúteos' },
      { name: 'Puxada Alta', description: '3x10 - Costas' },
      { name: 'Elevação Lateral', description: '3x15 - Ombros' },
      { name: 'Tríceps Polia', description: '3x12 - Tríceps' },
    ]
  }
};