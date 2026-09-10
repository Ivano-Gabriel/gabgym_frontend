// src/data/workoutDatabase.js (Versão Centralizada "Bestaferamente Clean")

// ===================================================================================
// PARTE 1: A FONTE DA VERDADE (A ENCICLOPÉDIA COMPLETA DE EXERCÍCIOS)
// Aqui listamos CADA exercício UMA ÚNICA VEZ. Esta é a nossa base de dados principal.
// ===================================================================================

export const EXERCISE_LIBRARY = {
  // --- PEITO ---
  'supino-reto-halter': { id: 'supino-reto-halter', name: 'Supino reto com halter', description: 'Principal construtor de massa para o peitoral.', muscleGroup: 'peito', localVideo: '/media/videos/supinu.mp4', image: '/media/images/biblioteca/supino.jpg' },
  'supino-inclinado-halter': { id: 'supino-inclinado-halter', name: 'Supino inclinado com halter', description: 'Foco na porção superior (clavicular) do peito.', muscleGroup: 'peito', localVideo: '/media/videos/su.mp4', image: '/media/images/biblioteca/inclinado.jpg' },
  'supino-reto-polia': { id: 'supino-reto-polia', name: 'Supino reto polia', description: 'Excelente para alongar e trabalhar a parte interna do peitoral.', muscleGroup: 'peito', localVideo: '/media/videos/p.mp4', image: '/media/images/biblioteca/cruci.jpg' },
  'crossover-polia-alta': { id: 'crossover-polia-alta', name: 'Crossover na polia alta', description: 'Ótimo para definição e pico de contração.', muscleGroup: 'peito', localVideo: '/media/videos/cro.mp4', image: '/media/images/biblioteca/cross.jpg' },
  'supino-reto-barra': { id: 'supino-reto-barra', name: 'Supino reto com barra', description: 'Exercício base para força e volume no peitoral.', muscleGroup: 'peito', localVideo: '/media/videos/supino-reto-com-barra.mp4', image: '/media/images/biblioteca/supino-reto-com-barra-card.jpg' },

  // --- TRÍCEPS ---
  'triceps-corda-polia': { id: 'triceps-corda-polia', name: 'Tríceps corda na polia', description: 'Isolamento eficaz para todas as cabeças do tríceps.', muscleGroup: 'triceps', localVideo: '/media/videos/polia.mp4', image: '/media/images/biblioteca/corda.jpg' },
  'triceps-testa-barra': { id: 'triceps-testa-barra', name: 'Tríceps testa com barra', description: 'Foco na cabeça longa do tríceps, ótimo para volume.', muscleGroup: 'triceps', localVideo: '/media/videos/tes.mp4', image: '/media/images/biblioteca/testa.jpg' },
  'triceps-mergulho': { id: 'triceps-mergulho', name: 'Tríceps mergulho', description: 'Exercício com peso corporal que trabalha força e resistência.', muscleGroup: 'triceps', localVideo: '/media/videos/mergulho.mp4', image: '/media/images/biblioteca/mergulho.jpg' },

  // --- COSTAS ---
  'puxada-frente': { id: 'puxada-frente', name: 'Puxada na frente', description: 'Construtor de largura para as costas (dorsais).', muscleGroup: 'costas', localVideo: '/media/videos/pux.mp4', image: '/media/images/biblioteca/puxada.jpg' },
  'remada-curvada-barra': { id: 'remada-curvada-barra', name: 'Remada curvada com barra', description: 'Trabalha a espessura do meio das costas.', muscleGroup: 'costas', localVideo: '/media/videos/cur.mp4', image: '/media/images/biblioteca/remada1.jpg' },
  'remada-serrote': { id: 'remada-serrote', name: 'Remada serrote', description: 'Corrige desequilíbrios e trabalha cada lado individualmente.', muscleGroup: 'costas', localVideo: '/media/videos/ser.mp4', image: '/media/images/biblioteca/unilateral.jpg' },
  'remada-baixa-polia': { id: 'remada-baixa-polia', name: 'Remada baixa na polia', description: 'Foco na parte inferior da dorsal e trapézio.', muscleGroup: 'costas', localVideo: '/media/videos/re.mp4', image: '/media/images/biblioteca/remada.jpg' },
  
  // --- BÍCEPS ---
  'rosca-direta-barra': { id: 'rosca-direta-barra', name: 'Rosca direta com barra', description: 'O principal construtor de massa para o bíceps.', muscleGroup: 'biceps', localVideo: '/media/videos/ro.mp4', image: '/media/images/biblioteca/rosca.jpg' },
  'rosca-alternada-halteres': { id: 'rosca-alternada-halteres', name: 'Rosca alternada com halteres', description: 'Trabalha cada braço individualmente, focando na supinação.', muscleGroup: 'biceps', localVideo: '/media/videos/rosca.mp4', image: '/media/images/biblioteca/alternada.jpg' },
  'rosca-martelo': { id: 'rosca-martelo', name: 'Rosca martelo', description: 'Trabalha o braquial e o antebraço, dando espessura ao braço.', muscleGroup: 'biceps', localVideo: '/media/videos/mar.mp4', image: '/media/images/biblioteca/martelo.jpg' },
  
  // --- OMBROS ---
  'desenvolvimento-halteres': { id: 'desenvolvimento-halteres', name: 'Desenvolvimento com halteres', description: 'Trabalha todas as cabeças do deltoide.', muscleGroup: 'ombros', localVideo: '/media/videos/desen.mp4', image: '/media/images/biblioteca/desenvolvimento-card.jpg' },
  'elevacao-lateral': { id: 'elevacao-lateral', name: 'Elevação lateral', description: 'O melhor exercício para criar o aspecto de ombros largos.', muscleGroup: 'ombros', localVideo: '/media/videos/lat.mp4', image: '/media/images/biblioteca/elevacao-card.jpg' },
  'elevacao-frontal': { id: 'elevacao-frontal', name: 'Elevação frontal', description: 'Isola a parte frontal do deltoide.', muscleGroup: 'ombros', localVideo: '/media/videos/front.mp4', image: '/media/images/biblioteca/frontal-card.jpg' },
  'crucifixo-invertido': { id: 'crucifixo-invertido', name: 'Crucifixo invertido', description: 'Foco nos deltoides posteriores e miolo das costas.', muscleGroup: 'ombros', localVideo: '/media/videos/inv.mp4', image: '/media/images/biblioteca/inv.jpg' },

  // --- QUADRÍCEPS ---
  'agachamento-livre': { id: 'agachamento-livre', name: 'Agachamento livre', description: 'O rei dos exercícios de perna.', muscleGroup: 'quadriceps', localVideo: '/media/videos/agacholivre.mp4', image: '/media/images/biblioteca/agachamento-card.jpg' },
  'leg-press': { id: 'leg-press', name: 'Leg press', description: 'Permite mover cargas altas com segurança.', muscleGroup: 'quadriceps', localVideo: '/media/videos/leg-press.mp4', image: '/media/images/biblioteca/leg-card.jpg' },
  'agachamento-invertido': { id: 'agachamento-invertido', name: 'Agachamento invertido', description: 'Variação que pode focar mais em glúteos ou quadríceps.', muscleGroup: 'quadriceps', localVideo: '/media/videos/invergacho.mp4', image: '/media/images/biblioteca/againv.jpg' },
  'cadeira-extensora': { id: 'cadeira-extensora', name: 'Cadeira extensora', description: 'Isolamento máximo para o quadríceps.', muscleGroup: 'quadriceps', localVideo: '/media/videos/cadeira-extensora.mp4', image: '/media/images/biblioteca/cadeira-card.jpg' },
  'agachamento-bulgaro': { id: 'agachamento-bulgaro', name: 'Agachamento búlgaro', description: 'Excelente para equilíbrio e trabalho unilateral.', muscleGroup: 'quadriceps', localVideo: '/media/videos/agachamento-bulgaro.mp4', image: '/media/images/biblioteca/bulgaro-card.jpg' },
  'leg-press-sumo': { id: 'leg-press-sumo', name: 'Leg press sumô', description: 'Foco nos adutores e glúteos além do quadríceps.', muscleGroup: 'quadriceps', localVideo: '/media/videos/leg-sumoxd.mp4', image: '/media/images/biblioteca/legsumo.jpg' },
  'agachamento-smith': { id: 'agachamento-smith', name: 'Agachamento smith', description: 'Permite uma execução mais controlada e segura.', muscleGroup: 'quadriceps', localVideo: '/media/videos/controlada.mp4', image: '/media/images/biblioteca/smitiaga.jpg' },
  
  // --- POSTERIOR DE COXA ---
  'stiff-barra': { id: 'stiff-barra', name: 'Stiff com barra', description: 'Excelente para alongar e fortalecer o posterior.', muscleGroup: 'posterior-coxa', localVideo: '/media/videos/stiff-com-barra.mp4', image: '/media/images/biblioteca/stiff-card.jpg' },
  'mesa-flexora': { id: 'mesa-flexora', name: 'Mesa flexora', description: 'Isolamento para os isquiotibiais (posteriores).', muscleGroup: 'posterior-coxa', localVideo: '/media/videos/mes.mp4', image: '/media/images/biblioteca/mesa-flexora-card.jpg' },
  'cadeira-flexora': { id: 'cadeira-flexora', name: 'Cadeira flexora', description: 'Ótimo isolamento para posteriores, sentado.', muscleGroup: 'posterior-coxa', localVideo: '/media/videos/posteripos.mp4', image: '/media/images/biblioteca/cadpost.jpg' },
  'levantamento-terra-romeno': { id: 'levantamento-terra-romeno', name: 'Levantamento terra romeno', description: 'Variação do Stiff com foco na contração.', muscleGroup: 'posterior-coxa', localVideo: '/media/videos/levantamento-terra-romeno.mp4', image: '/media/images/biblioteca/terra-romeno-card.jpg' },
  'good-morning': { id: 'good-morning', name: '"Good morning"', description: 'Exige mais elasticidade. Ótima ativação.', muscleGroup: 'posterior-coxa', localVideo: '/media/videos/xaaxa.mp4', image: '/media/images/biblioteca/goodmorning.jpg' },
  
  // --- GLÚTEOS ---
  'elevacao-quadril': { id: 'elevacao-quadril', name: 'Elevação de quadril (hip thrust)', description: 'O melhor exercício para ativação dos glúteos.', muscleGroup: 'gluteos', localVideo: '/media/videos/elevacao-de-quadril.mp4', image: '/media/images/biblioteca/elevacao-de-quadril-card.jpg' }, 
  'agachamento-sumo': { id: 'agachamento-sumo', name: 'Agachamento sumô', description: 'Foco nos glúteos e na parte interna da coxa.', muscleGroup: 'gluteos', localVideo: '/media/videos/sumo.mp4', image: '/media/images/biblioteca/sumo-card.jpg' },
  'coice-cabo': { id: 'coice-cabo', name: 'Coice no cabo', description: 'Isolamento que permite um pico de contração no glúteo.', muscleGroup: 'gluteos', localVideo: '/media/videos/coice-no-cabo.mp4', image: '/media/images/biblioteca/coice-card.jpg' },
  'passada-lateral': { id: 'passada-lateral', name: 'Passada lateral', description: 'Boa ativação de glúteos, com foco no glúteo médio.', muscleGroup: 'gluteos', localVideo: '/media/videos/xixixixix.mp4', image: '/media/images/biblioteca/passadaa.jpg' },

  // --- PANTURRILHAS ---
  'panturrilha-em-pe': { id: 'panturrilha-em-pe', name: 'Panturrilha em pé', description: 'Trabalha o gastrocnêmio, a parte maior da panturrilha.', muscleGroup: 'panturrilhas', localVideo: '/media/videos/panturrilha-em-pe.mp4', image: '/media/images/biblioteca/pantu.jpg' },
  'panturrilha-sentado': { id: 'panturrilha-sentado', name: 'Elevação de panturrilha sentado', description: 'Foco no sóleo, músculo que dá espessura à panturrilha.', muscleGroup: 'panturrilhas', localVideo: '/media/videos/panturrilha-sentado.mp4', image: '/media/images/biblioteca/sentado-car.jpg' },
  'panturrilha-leg-press': { id: 'panturrilha-leg-press', name: 'Panturrilha no leg press', description: 'Permite usar altas cargas de forma estável.', muscleGroup: 'panturrilhas', localVideo: '/media/videos/panturrilha-no-leg-press.mp4', image: '/media/images/biblioteca/pantu-leg.jpg' },

  // --- ABDUTORES / ADUTORES ---
  'cadeira-adutora': { id: 'cadeira-adutora', name: 'Cadeira adutora', description: 'Foco na parte interna da coxa.', muscleGroup: 'adutores-abdutores', localVideo: '/media/videos/adutora.mp4', image: '/media/images/biblioteca/adutora-card.jpg' },
  'cadeira-abdutora': { id: 'cadeira-abdutora', name: 'Cadeira abdutora', description: 'Trabalha o glúteo médio, na parte externa do quadril.', muscleGroup: 'adutores-abdutores', localVideo: '/media/videos/abdutora.mp4', image: '/media/images/biblioteca/abdutora-card.jpg' },

  // --- ABDÔMEN ---
  'abdomen-encolhimento': { id: 'abdomen-encolhimento', name: 'Encolhimento (Crunch)', description: 'Foco na parte superior do abdômen.', muscleGroup: 'abdomen', localVideo: '/media/videos/eabc.mp4', image: '/media/images/biblioteca/ombreta-card.jpg' },
  'prancha-isometrica': { id: 'prancha-isometrica', name: 'Prancha isométrica', description: 'Fortalece o core como um todo, incluindo lombar.', muscleGroup: 'abdomen', localVideo: '/media/videos/0725.mp4', image: '/media/images/biblioteca/prancha-card.jpg' },

  // --- TRAPÉZIO ---
  'encolhimento-halteres': { id: 'encolhimento-halteres', name: 'Encolhimento com halteres', description: 'Exercício fundamental para a parte superior do trapézio.', muscleGroup: 'trapezio', localVideo: '/media/videos/en.mp4', image: '/media/images/biblioteca/encolhimento.jpg' },
  'encolhimento-barra': { id: 'encolhimento-barra', name: 'Encolhimento com barra', description: 'Permite maior sobrecarga de peso para o trapézio.', muscleGroup: 'trapezio', localVideo: '/media/videos/e.mp4', image: '/media/images/biblioteca/iii.jpg' },
  'remada-alta': { id: 'remada-alta', name: 'Remada alta', description: 'Trabalha o trapézio em conjunto com os deltoides.', muscleGroup: 'trapezio', localVideo: '/media/videos/alta.mp4', image: '/media/images/biblioteca/alta-card.jpg' },
  
  // --- ANTEBRAÇO ---
  'rosca-inversa': { id: 'rosca-inversa', name: 'Rosca inversa', description: 'Fortalece os extensores do punho e o braquiorradial.', muscleGroup: 'antebraco', localVideo: '/media/videos/ros.mp4', image: '/media/images/biblioteca/invertida.jpg' },  'rosca-de-punho': { id: 'rosca-de-punho', name: 'Rosca de punho', description: 'Isolamento para os flexores do punho (parte interna).', muscleGroup: 'antebraco', localVideo: '/media/videos/ante.mp4', image: '/media/images/biblioteca/rosca-card.jpg' },
};

// ===================================================================================
// PARTE 2: AS ROTINAS PRONTAS (O CARDÁPIO DE TREINOS)

export const ROUTINE_DATABASE = {
  'peito-triceps': {
    title: 'Peito & Tríceps',
    description: 'Um treino focado para peitoral e tríceps, ideal para divisões ABC.',
    plan: [
      { type: 'subheading', text: 'PEITO' },
      { exerciseId: 'supino-reto-halter', sets: 4, reps: '8-12' },
      { exerciseId: 'supino-inclinado-halter', sets: 3, reps: '10-12' },
      { exerciseId: 'crossover-polia-alta', sets: 3, reps: '15' },
      { type: 'subheading', text: 'TRÍCEPS' },
      { exerciseId: 'triceps-testa-barra', sets: 3, reps: '10-12' },
      { exerciseId: 'triceps-corda-polia', sets: 4, reps: '12-15' },
    ]
  },
  'costas-biceps': {
    title: 'Costas & Bíceps',
    description: 'Foco em largura e espessura das costas, com finalização para bíceps.',
    plan: [
      { type: 'subheading', text: 'COSTAS (Dorsais)' },
      { exerciseId: 'puxada-frente', sets: 4, reps: '8-12' },
      { exerciseId: 'remada-curvada-barra', sets: 3, reps: '8-10' },
      { exerciseId: 'remada-serrote', sets: 3, reps: '10 (cada lado)' },
      { type: 'subheading', text: 'BÍCEPS' },
      { exerciseId: 'rosca-direta-barra', sets: 3, reps: '10' },
      { exerciseId: 'rosca-martelo', sets: 3, reps: '12' },
    ]
  },
  'ombro-completo': {
    title: 'Ombros 3D',
    description: 'Um treino completo para trabalhar todas as cabeças do deltoide.',
    plan: [
      { exerciseId: 'desenvolvimento-halteres', sets: 4, reps: '8-10' },
      { exerciseId: 'elevacao-lateral', sets: 4, reps: '12-15' },
      { exerciseId: 'elevacao-frontal', sets: 3, reps: '12' },
      { exerciseId: 'crucifixo-invertido', sets: 3, reps: '15' },
    ]
  },
  'pernas-completo': {
    title: 'Pernas & Glúteos',
    description: 'Um treino completo para membros inferiores, focando em força e volume.',
    plan: [
      { type: 'subheading', text: 'EXERCÍCIOS BASE' },
      { exerciseId: 'agachamento-livre', sets: 4, reps: '8-10' },
      { exerciseId: 'leg-press', sets: 4, reps: '10-12' },
      { type: 'subheading', text: 'FOCO EM POSTERIOR & GLÚTEOS' },
      { exerciseId: 'stiff-barra', sets: 3, reps: '10-12' },
      { exerciseId: 'elevacao-quadril', sets: 3, reps: '12-15' },
      { exerciseId: 'mesa-flexora', sets: 3, reps: '12-15' },
    ]
  },
  'upper-body': {
    title: 'Membros Superiores (Upper)',
    description: 'Treino para o tronco completo, usado em rotinas Upper/Lower.',
    plan: [
      { exerciseId: 'supino-reto-halter', sets: 3, reps: '8-12', note: 'Peito' },
      { exerciseId: 'remada-curvada-barra', sets: 3, reps: '8-12', note: 'Costas' },
      { exerciseId: 'desenvolvimento-halteres', sets: 3, reps: '10-12', note: 'Ombros' },
      { exerciseId: 'rosca-direta-barra', sets: 3, reps: '12-15', note: 'Bíceps' },
      { exerciseId: 'triceps-corda-polia', sets: 3, reps: '12-15', note: 'Tríceps' },
    ]
  },
  'lower-body': {
    title: 'Membros Inferiores (Lower)',
    description: 'Treino para as pernas completo, usado em rotinas Upper/Lower.',
    plan: [
      { exerciseId: 'agachamento-livre', sets: 4, reps: '8-10' },
      { exerciseId: 'leg-press', sets: 3, reps: '10-12' },
      { exerciseId: 'cadeira-extensora', sets: 3, reps: '12-15' },
      { exerciseId: 'stiff-barra', sets: 3, reps: '10-12' },
      { exerciseId: 'mesa-flexora', sets: 3, reps: '12-15' },
      { exerciseId: 'panturrilha-em-pe', sets: 4, reps: '15-20' },
    ]
  },
  'full-body-male': {
    title: 'Full Body (Foco Masculino)',
    description: 'Treino de corpo inteiro com um leve foco em membros superiores.',
    plan: [
      // CORRIGIDO AQUI PARA USAR O ID CORRETO EXISTENTE
      { exerciseId: 'supino-reto-halter', sets: 3, reps: '10', note: 'Peito' },
      { exerciseId: 'puxada-frente', sets: 3, reps: '10', note: 'Costas' },
      { exerciseId: 'agachamento-livre', sets: 3, reps: '12', note: 'Pernas' },
      { exerciseId: 'elevacao-lateral', sets: 3, reps: '15', note: 'Ombros' },
      { exerciseId: 'rosca-direta-barra', sets: 3, reps: '12', note: 'Bíceps' },
    ]
  },
  'full-body-female': {
    title: 'Full Body (Foco Feminino)',
    description: 'Treino de corpo inteiro com ênfase em pernas e glúteos.',
    plan: [
      { exerciseId: 'agachamento-livre', sets: 3, reps: '12', note: 'Pernas' },
      { exerciseId: 'elevacao-quadril', sets: 3, reps: '15', note: 'Glúteos' },
      // CORRIGIDO AQUI PARA USAR UMA REMADA EXISTENTE
      { exerciseId: 'remada-curvada-barra', sets: 3, reps: '10', note: 'Costas' },
      { exerciseId: 'desenvolvimento-halteres', sets: 3, reps: '12', note: 'Ombros' },
      { exerciseId: 'triceps-corda-polia', sets: 3, reps: '12', note: 'Tríceps' },
    ]
  }
};

// ===================================================================================
// PARTE 3: A BIBLIOTECA DE GRUPOS MUSCULARES
// Organiza os exercícios para a página da "Biblioteca". É super leve, só aponta para os IDs.
// ===================================================================================

export const WORKOUT_GROUPS = {
  'peito-triceps': { 
    title: 'Peito & Tríceps', 
    exerciseIds: ['supino-reto-halter', 'supino-inclinado-halter', 'supino-reto-polia', 'crossover-polia-alta', 'triceps-corda-polia', 'triceps-testa-barra', 'triceps-mergulho'] 
  },
  'costas-biceps': { 
    title: 'Costas & Bíceps', 
    exerciseIds: ['puxada-frente', 'remada-curvada-barra', 'remada-serrote', 'remada-baixa-polia', 'rosca-direta-barra', 'rosca-alternada-halteres', 'rosca-martelo'] 
  },
  'ombro-completo': { 
    title: 'Ombros Completo', 
    exerciseIds: ['desenvolvimento-halteres', 'elevacao-lateral', 'elevacao-frontal', 'crucifixo-invertido'] 
  },
  'pernas-completo': { 
    title: 'Pernas Completo', 
    exerciseIds: ['agachamento-livre', 'leg-press', 'stiff-barra', 'elevacao-quadril'] 
  },
  'trapezio': {
    title: 'Trapézio',
    exerciseIds: ['encolhimento-halteres', 'encolhimento-barra', 'remada-alta']
  },
  'antebraco': {
    title: 'Antebraço',
    exerciseIds: ['rosca-inversa', 'rosca-de-punho']
  },
  'quadriceps': {
    title: 'Quadríceps',
    exerciseIds: ['agachamento-invertido', 'cadeira-extensora', 'agachamento-bulgaro', 'leg-press-sumo', 'agachamento-smith']
  },
  'posterior-coxa': {
    title: 'Posterior de Coxa',
    exerciseIds: ['mesa-flexora', 'stiff-barra', 'cadeira-flexora', 'levantamento-terra-romeno', 'good-morning']
  },
  'gluteos': {
    title: 'Glúteos',
    exerciseIds: ['elevacao-quadril', 'agachamento-sumo', 'coice-cabo', 'passada-lateral']
  },
  'panturrilhas': {
    title: 'Panturrilhas',
    exerciseIds: ['panturrilha-em-pe', 'panturrilha-sentado', 'panturrilha-leg-press']
  },
  'adutores-abdutores': {
    title: 'Adutores & Abdutores',
    exerciseIds: ['cadeira-adutora', 'cadeira-abdutora']
  },
  'abdomen': {
    title: 'Abdômen',
    exerciseIds: ['abdomen-encolhimento', 'prancha-isometrica']
  },
};

// ===================================================================================
// FERRAMENTA DE AUDITORIA - Cole isso no final do seu arquivo para testar
// ===================================================================================

function auditRoutines() {
  console.log("--- Iniciando Auditoria de Rotinas do GabGym ---");
  let errorsFound = 0;
  
  // Itera sobre cada rotina no banco de dados de rotinas
  for (const routineKey in ROUTINE_DATABASE) {
    const routine = ROUTINE_DATABASE[routineKey];

    // Itera sobre cada passo do plano da rotina (for comum, sem closure dentro do loop)
    for (let index = 0; index < routine.plan.length; index++) {
      const step = routine.plan[index];

      // Ignora os subheadings, pois eles não têm exerciseId
      if (step.type === 'subheading') {
        continue;
      }

      // Verifica se o exerciseId existe na nossa enciclopédia
      if (!EXERCISE_LIBRARY[step.exerciseId]) {
        console.error(
          `❌ ERRO na rotina "${routine.title}" (ID: ${routineKey}): O exercício com ID "${step.exerciseId}" no passo ${index + 1} não foi encontrado na EXERCISE_LIBRARY!`
        );
        errorsFound++;
      }
    }
  }

  if (errorsFound === 0) {
    console.log("✅ Auditoria Concluída: Nenhuma inconsistência encontrada. Sua base de dados está BESTAFERAMENTE CLEAN!");
  } else {
    console.warn(`🚨 Auditoria Concluída: ${errorsFound} erro(s) de referência encontrados. Verifique os logs de erro acima.`);
  }
}

// Chame a função aqui para rodar a auditoria sempre que o app carregar (só em desenvolvimento — usuário final não precisa ver isso no console)
if (process.env.NODE_ENV !== 'production') {
  auditRoutines();
}

// Adicione esta nova exportação no seu workoutDatabase.js

export const BODY_PART_MAP = {
  superior: [
    'Peito & Tríceceps', 'Costas & Bíceps', 'Ombros Completo', 'Trapézio', 'Antebraço', 'Abdômen', 'Peito', 'Tríceps', 'Costas', 'Bíceps', 'Ombros', 'Braços'
  ],
  inferior: [
    'Pernas Completo', 'Quadríceps', 'Posterior de Coxa', 'Glúteos', 'Panturrilhas', 'Adutores & Abdutores', 'Pernas'
  ]
};