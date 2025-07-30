// src/data/workoutDatabase.js
export const MUSCLE_GROUP_WORKOUTS = {
  // --- GRUPOS COMBINADOS (Usados no Gerador de Rotinas) ---
  'peito-triceps': { 
    title: 'Peito & Tríceps', 
    exercises: [
      { type: 'subheading', text: 'PEITO' },
      { name: 'Supino reto com halter', description: 'Principal construtor de massa para o peitoral.', localVideo: '/videos/supinu.mp4', image: '/images/supino.jpg' },
      { name: 'Supino inclinado com halter', description: 'Foco na porção superior (clavicular) do peito.', localVideo: '/videos/su.mp4', image: '/images/inclinado.jpg' },
      { name: 'supino reto polia', description: 'Excelente para alongar e trabalhar a parte interna do peitoral.', localVideo: '/videos/p.mp4', image: '/images/cruci.jpg' },
      { name: 'Crossover na polia alta', description: 'Ótimo para definição e pico de contração.', localVideo: '/videos/cro.mp4', image: '/images/cross.jpg' },
      { type: 'subheading', text: 'TRÍCEPS' },
      { name: 'Tríceps corda na polia', description: 'Isolamento eficaz para todas as cabeças do tríceps.', localVideo: '/videos/polia.mp4', image: '/images/corda.jpg' },
      { name: 'Tríceps testa com barra', description: 'Foco na cabeça longa do tríceps, ótimo para volume.', localVideo: '/videos/tes.mp4', image: '/images/testa.jpg' },
      { name: 'Tríceps mergulho', description: 'Exercício com peso corporal que trabalha força e resistência.', localVideo: '/videos/mergulho.mp4', image: '/images/mergulho.jpg' },
    ] 
  },
  'costas-biceps': { 
    title: 'Costas & Bíceps', 
    exercises: [
      { type: 'subheading', text: 'COSTAS (Dorsais)' },
      { name: 'Puxada na frente ', description: 'Construtor de largura para as costas.', localVideo: '/videos/pux.mp4', image: '/images/puxada.jpg' },
      { name: 'Remada curvada com barra', description: 'Trabalha a espessura do meio das costas.', localVideo: '/videos/cur.mp4', image: '/images/remada1.jpg' },
      { name: 'Remada serrote', description: 'Corrige desequilíbrios e trabalha cada lado individualmente.', localVideo: '/videos/ser.mp4', image: '/images/unilateral.jpg' },
      { name: 'Remada baixa na polia', description: 'Foco na parte inferior da dorsal e trapézio.', localVideo: '/videos/re.mp4', image: '/images/remada.jpg' },
      { type: 'subheading', text: 'BÍCEPS' },
      { name: 'Rosca direta com barra', description: 'O principal construtor de massa para o bíceps.', localVideo: '/videos/ro.mp4', image: '/images/rosca.jpg' },
      { name: 'Rosca alternada com halteres', description: 'Trabalha cada braço individualmente, focando na supinação.', localVideo: '/videos/rosca.mp4', image: '/images/alternada.jpg' },
      { name: 'Rosca martelo', description: 'Trabalha o braquial e o antebraço, dando espessura ao braço.', localVideo: '/videos/mar.mp4', image: '/images/martelo.jpg' },
    ] 
  },
  'ombro-completo': { 
    title: 'Ombros Completo', 
    exercises: [
      { name: 'Desenvolvimento com halteres', description: 'Trabalha todas as cabeças do deltoide.', localVideo: '/videos/desen.mp4', image: '/images/desenvolvimento-card.jpg' },
      { name: 'Elevação lateral', description: 'O melhor exercício para criar o aspecto de ombros largos.', localVideo: '/videos/lat.mp4', image: '/images/elevacao-card.jpg' },
      { name: 'Elevação frontal', description: 'Isola a parte frontal do deltoide.', localVideo: '/videos/front.mp4', image: '/images/frontal-card.jpg' },
      { name: 'Crucifixo invertido', description: 'Movimento completo que aumenta o tempo sob tensão.', localVideo: '/videos/inv.mp4', image: '/images/inv.jpg' },
    ] 
  },
  'pernas-completo': { 
    title: 'Pernas Completo', 
    exercises: [
      { type: 'subheading', text: 'QUADRÍCEPS' },
      { name: 'Agachamento livre', description: 'O rei dos exercícios de perna.', localVideo: '/videos/agachamento-livre.mp4', image: '/images/agachamento-livre-card.jpg' },
      { name: 'Leg press', description: 'Permite mover cargas altas com segurança.', localVideo: '/videos/leg-press.mp4', image: '/images/leg-press-card.jpg' },
      { type: 'subheading', text: 'POSTERIOR & GLÚTEOS' },
      { name: 'Stiff com barra', description: 'Excelente para alongar e fortalecer o posterior.', localVideo: '/videos/stiff-com-barra.mp4', image: '/images/stiff-com-barra-card.jpg' },
      { name: 'Elevação de quadril (hip thrust)', description: 'O melhor exercício para ativação dos glúteos.', localVideo: '/videos/elevacao-de-quadril.mp4', image: '/images/elevacao-de-quadril-card.jpg' },
    ] 
  },

  // --- GRUPOS INDIVIDUAIS (Para a Biblioteca) ---
  'trapezio': {
    title: 'Trapézio',
    exercises: [
      { name: 'Encolhimento com halteres', description: 'Exercício fundamental para a parte superior do trapézio.', localVideo: '/videos/en.mp4', image: '/images/encolhimento.jpg' },
      { name: 'Encolhimento com barra', description: 'Permite maior sobrecarga de peso para o trapézio.', localVideo: '/videos/e.mp4', image: '/images/iii.jpg' },
      { name: 'Remada alta', description: 'Trabalha o trapézio em conjunto com os deltoides.', localVideo: '/videos/alta.mp4', image: '/images/alta-card.jpg' },
    ]
  },
  'antebraco': {
    title: 'Antebraço',
    exercises: [
      { name: 'Rosca inversa', description: 'Fortalece os extensores do punho e o braquiorradial.', localVideo: '/videos/ros.mp4', image: '/images/invertida.jpg' },
      { name: 'Rosca de punho', description: 'Isolamento para os flexores do punho (parte interna).', localVideo: '/videos/ante.mp4', image: '/images/rosca-card.jpg' },
    ]
  },
  'quadriceps': {
    title: 'Quadríceps',
    exercises: [
      { name: 'Agachamento invertido', description: 'Permite mover cargas altas com segurança..', localVideo: '/videos/invergacho.mp4', image: '/images/againv.jpg' },
      { name: 'Cadeira extensora', description: 'Isolamento máximo para o quadríceps.', localVideo: '/videos/cadeira-extensora.mp4', image: '/images/cadeira-card.jpg' },
      { name: 'Agachamento búlgaro', description: 'Excelente para equilíbrio e trabalho unilateral.', localVideo: '/videos/agachamento-bulgaro.mp4', image: '/images/bulgaro-card.jpg' },
      { name: 'Leg press sumô', description: 'Permite mover cargas altas com segurança..', localVideo: '/videos/leg-sumoxd.mp4', image: '/images/legsumo.jpg' },
      { name: 'Agachamento smith', description: 'Permite uma execução mais controlada', localVideo: '/videos/controlada.mp4', image: '/images/smitiaga.jpg' },
    ]
  },
  'posterior-coxa': {
    title: 'Posterior de Coxa',
    exercises: [
      { name: 'Mesa flexora', description: 'Isolamento para os isquiotibiais (posteriores).', localVideo: '/videos/mes.mp4', image: '/images/mesa-flexora-card.jpg' },
      { name: 'Stiff com barra', description: 'Excelente para alongar e fortalecer o posterior e glúteos.', localVideo: '/videos/stiff-com-barra.mp4', image: '/images/stiff-card.jpg' },
      { name: 'Cadeira flexora', description: 'Ótimo isolamento para posteriores', localVideo: '/videos/posteripos.mp4', image: '/images/cadpost.jpg' },
      { name: 'Levantamento terra romeno', description: 'Variação do Stiff com foco na contração.', localVideo: '/videos/levantamento-terra-romeno.mp4', image: '/images/terra-romeno-card.jpg' },
      { name: '"Good morning"', description: 'Exige mais elasticidade. Ótima ativação', localVideo: '/videos/xaaxa.mp4', image: '/images/goodmorning.jpg' },
    ]
  },
  'gluteos': {
    title: 'Glúteos',
    exercises: [
      { name: 'Elevação pélvica (hip thrust)', description: 'Ativação máxima e construção de volume.', localVideo: '/videos/elevacao-de-quadril.mp4', image: '/images/quadril-card.jpg' },
      { name: 'Agachamento sumô', description: 'Foco nos glúteos e na parte interna da coxa.', localVideo: '/videos/sumo.mp4', image: '/images/sumo-card.jpg' },
      { name: 'Coice no cabo', description: 'Isolamento que permite um pico de contração no glúteo.', localVideo: '/videos/coice-no-cabo.mp4', image: '/images/coice-card.jpg' },
      { name: 'Passada lateral', description: 'Boa ativação de glúteos', localVideo: '/videos/xixixixix.mp4', image: '/images/passadaa.jpg' },
    ] 
  },
  'panturrilhas': {
    title: 'Panturrilhas',
    exercises: [
      { name: 'Panturrilha em pé', description: 'Trabalha o gastrocnêmio, a parte maior da panturrilha.', localVideo: '/videos/panturrilha-em-pe.mp4', image: '/images/pantu.jpg' },
      { name: 'Elevação de panturrilha sentado', description: 'Foco no sóleo, músculo que dá espessura à panturrilha.', localVideo: '/videos/panturrilha-sentado.mp4', image: '/images/sentado-car.jpg' },
      { name: 'Panturrilha no leg press', description: 'Permite usar altas cargas de forma estável.', localVideo: '/videos/panturrilha-no-leg-press.mp4', image: '/images/pantu-leg.jpg' },
    ]
  },
  'adutores-abdutores': {
    title: 'Adutores & Abdutores',
    exercises: [
      { name: 'Cadeira adutora', description: 'Foco na parte interna da coxa.', localVideo: '/videos/adutora.mp4', image: '/images/adutora-card.jpg' },
      { name: 'Cadeira abdutora', description: 'Trabalha o glúteo médio, na parte externa do quadril.', localVideo: '/videos/abdutora.mp4', image: '/images/abdutora-card.jpg' },
    ]
  },
  'abdomen': {
    title: 'Abdômen',
    exercises: [
      { name: 'Encolhimento', description: 'Foco na parte inferior do abdômen.', localVideo: '/videos/eabc.mp4', image: '/images/ombreta-card.jpg' },
      { name: 'Prancha isométrica', description: 'Fortalece o core como um todo.', localVideo: '/videos/0725.mp4', image: '/images/prancha-card.jpg' },
    ]
  },
  
  // --- TREINOS PRONTOS (Usados no Gerador de Rotinas) ---
  'upper-body': {
    title: 'Membros Superiores',
    exercises: [
      { type: 'subheading', text: 'FOCO EM PEITO & TRÍCEPS' },
      { name: 'Supino reto com barra', description: '3x10', localVideo: '/videos/supino-reto-com-barra.mp4', image: '/images/supino-reto-com-barra-card.jpg' },
      { name: 'Crossover na polia alta', description: '3x12', localVideo: '/videos/crossover-na-polia-alta.mp4', image: '/images/crossover-na-polia-alta-card.jpg' },
      { name: 'Tríceps na polia (corda)', description: '3x12', localVideo: '/videos/triceps-na-polia-corda.mp4', image: '/images/triceps-na-polia-corda-card.jpg' },
      { type: 'subheading', text: 'FOCO EM COSTAS & BÍCEPS' },
      { name: 'Puxada na frente (pulldown)', description: '3x10', localVideo: '/videos/puxada-na-frente.mp4', image: '/images/puxada-na-frente-card.jpg' },
      { name: 'Rosca martelo', description: '3x12', localVideo: '/videos/rosca-martelo.mp4', image: '/images/rosca-martelo-card.jpg' },
    ]
  },
  'lower-body': {
    title: 'Membros Inferiores',
    exercises: [
      { type: 'subheading', text: 'FOCO EM QUADRÍCEPS & GLÚTEOS' },
      { name: 'Agachamento livre', description: '3x10', localVideo: '/videos/agachamento-livre.mp4', image: '/images/agachamento-livre-card.jpg' },
      { name: 'Leg press', description: '3x12', localVideo: '/videos/leg-press.mp4', image: '/images/leg-press-card.jpg' },
      { name: 'Cadeira abdutora', description: '3x15', localVideo: '/videos/cadeira-abdutora.mp4', image: '/images/cadeira-abdutora-card.jpg' },
      { type: 'subheading', text: 'FOCO EM POSTERIOR & PANTURRILHA' },
      { name: 'Stiff com barra', description: '3x12', localVideo: '/videos/stiff-com-barra.mp4', image: '/images/stiff-com-barra-card.jpg' },
      { name: 'Elevação de panturrilha em pé', description: '4x20', localVideo: '/videos/elevacao-de-panturrilha-em-pe.mp4', image: '/images/elevacao-de-panturrilha-em-pe-card.jpg' },
    ]
  },
  'full-body-male': {
    title: 'Full Body (Foco Superior)',
    exercises: [
      { name: 'Supino reto com barra', description: '3x10 - Peito', localVideo: '/videos/supino-reto-com-barra.mp4', image: '/images/supino-reto-com-barra-card.jpg' },
      { name: 'Puxada na frente (pulldown)', description: '3x10 - Costas', localVideo: '/videos/puxada-na-frente.mp4', image: '/images/puxada-na-frente-card.jpg' },
      { name: 'Agachamento livre', description: '3x12 - Pernas', localVideo: '/videos/agachamento-livre.mp4', image: '/images/agachamento-livre-card.jpg' },
      { name: 'Elevação lateral', description: '3x15 - Ombros', localVideo: '/videos/elevacao-lateral.mp4', image: '/images/elevacao-lateral-card.jpg' },
      { name: 'Rosca direta com barra', description: '3x12 - Bíceps', localVideo: '/videos/rosca-direta-com-barra.mp4', image: '/images/rosca-direta-com-barra-card.jpg' },
    ]
  },
  'full-body-female': {
    title: 'Full Body (Foco Inferior)',
    exercises: [
      { name: 'Agachamento livre', description: '3x12 - Pernas', localVideo: '/videos/agachamento-livre.mp4', image: '/images/agachamento-livre-card.jpg' },
      { name: 'Elevação de quadril (hip thrust)', description: '3x15 - Glúteos', localVideo: '/videos/elevacao-de-quadril.mp4', image: '/images/elevacao-de-quadril-card.jpg' },
      { name: 'Puxada na frente (pulldown)', description: '3x10 - Costas', localVideo: '/videos/puxada-na-frente.mp4', image: '/images/puxada-na-frente-card.jpg' },
      { name: 'Elevação lateral', description: '3x15 - Ombros', localVideo: '/videos/elevacao-lateral.mp4', image: '/images/elevacao-lateral-card.jpg' },
      { name: 'Tríceps na polia (corda)', description: '3x12 - Tríceps', localVideo: '/videos/triceps-na-polia-corda.mp4', image: '/images/triceps-na-polia-corda-card.jpg' },
    ]
  }
};