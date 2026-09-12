// src/data/CardioList.js — fonte única de verdade pra atividades de cardio.
// gpsBased: true manda pro rastreador com mapa (CardioPage), false manda pro cronômetro simples (StartCardioPage)

export const CARDIO_LIST = [
  { id: 'corrida', name: 'Corrida', metValue: 9.8, gpsBased: true },
  { id: 'caminhada', name: 'Caminhada', metValue: 3.5, gpsBased: true },
  { id: 'bicicleta', name: 'Bicicleta', metValue: 7.5, gpsBased: true },
  { id: 'natacao', name: 'Natação', metValue: 7.0, gpsBased: false },
  { id: 'pularcorda', name: 'Pular Corda', metValue: 10.0, gpsBased: false },
];