// src/data/articles.js
export const articles = [
  // --- ARTIGOS DE SUPLEMENTAÇÃO ---
  {
    id: 'creatina',
    category: 'suplementacao',
    title: 'Creatina descomplicada',
    content: [
      { type: 'paragraph', text: 'A mais falada e a mais famosa...hoje você aprende sobre a creatina e muito mais, rola pra baixo e aprende' },
      { type: 'image', src: '/images/articles/crea.jpeg', alt: 'crea' },
      { type: 'heading', text: 'O que é a Creatina?' },
      { type: 'paragraph', text: 'Pense na creatina como a "bateria reserva" de alta performance do seu músculo. É um composto natural que seu corpo produz para fornecer energia explosiva para movimentos rápidos, como levantar um peso pesado.' },
      { type: 'image', src: '/images/articles/crea2.jpeg', alt: 'crea2' },
      { type: 'heading', text: 'Principais Benefícios' },
      { type: 'list', items: ['<strong>Aumento de Força e Potência:</strong> O benefício mais estudado.', '<strong>Melhora da Recuperação:</strong> Ajuda a reduzir a inflamação pós-treino.', '<strong>Aumento do Volume Muscular:</strong> Leva água para dentro do músculo, dando uma aparência mais "cheia".'] },
      { type: 'image', src: '/images/articles/gramas.jpeg', alt: 'gramas' },
      { type: 'heading', text: 'Faz diferença mesmo?' },
      { type: 'paragraph', text: 'Então jogador(a), para consumir o mesmo que um scoop de creatina naturalmente você precisaria consumir aproximadamente 1kg de carne bovina de uma só vez. Normalmente ingerimos e geramos creatina sem nem mesmo ter ideia; mas suplementar é o gás que você precisa.' },
      { type: 'image', src: '/images/articles/carne.jpeg', alt: 'carne' },
      { type: 'heading', text: 'Como tomar creatina?' },
      { type: 'paragraph', text: 'Seguinte, passou dos 75kg toma 5g, antes disso vai de 3g. Você pode tomar na hora que for melhor pra sua rotina e com o que você quiser, porém tome todos os dias, seu musculo precisa saturar a creatina e só surtem efeitos notaveis após a terceira semana de uso continuo.' },
      { type: 'image', src: '/images/articles/creatinaplus.jpeg', alt: 'creaplus' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: 'fe96v9WlnMU', title: 'Aprenda tudo sobre como tomar creatina em apenas 5 minutos - Leandro twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'zeOZ4U3rjsc', title: 'CREATINA - Vale o hype? É seguro usar? - Rodrigo Goes' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'Este artigo teve como base as diretrizes da Sociedade Internacional de Nutrição Esportiva (ISSN). Você pode ler o posicionamento oficial (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-021-00412-w" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'whey-protein',
    category: 'suplementacao',
    title: 'Whey Protein além do hype',
    content: [
      { type: 'image', src: '/images/articles/whey.jpeg', alt: 'whey' },
      { type: 'heading', text: 'O que é o famoso Whey?' },
      { type: 'paragraph', text: 'De forma simples, Whey Protein é a proteína do soro do leite. A indústria aprendeu a filtrar e secar esse soro, transformando-o no pó que a gente conhece. É, basicamente, aquela porção de frango ou bife que comemos feito em pó, o que o torna uma ferramenta de praticidade incrível.' },
      { type: 'image', src: '/images/articles/whey2.jpeg', alt: 'whey2' },
      { type: 'heading', text: 'Principais Benefícios' },
      { type: 'list', items: ['<strong>Reconstrução Muscular:</strong> A proteína é feita de aminoácidos, que são os "tijolos" que seu corpo usa para reparar as fibras musculares que você "quebrou" durante o treino.', '<strong>Ajuda na Saciedade:</strong>Usar Whey para complementar e até substituir uma refeição como um lanche pode te ajudar a controlar a fome, sendo um grande aliado em dietas de emagrecimento.', '<strong> Praticidade:</strong> É muito mais fácil e rápido tomar um shake de Whey do que preparar e comer um filé de frango, especialmente na correria.'] },
      { type: 'image', src: '/images/articles/whey3.jpeg', alt: 'whey3' },
      { type: 'heading', text: 'Qual seu  tipo de whey?' },
      { type: 'paragraph', text: 'Você vai ver três nomes principais nos potes. A diferença é basicamente o nível de filtragem:.' },
      { type: 'image', src: '/images/articles/whey4.jpeg', alt: 'whey4' },
      { type: 'list', items: ['<strong>Concentrado (WPC):</strong>Ótimo pra 90% das pessoas; ele é o mais comum e o melhor custo beneficio. Tem um pouco de carboidrato e gordura junto mas em quantidades insignificantes.', '<strong>Isolado (WPI):</strong> Basicamente o whey de quem tem intolerância à lactose, muito mais filtrado.', '<strong> Hidrolisado (WPH):</strong> É um whey "pré-digerido", absorção mais rápida, mas no geral...se você não for atleta ou rico, não compensa. Vai de concentrado!.'] },
      { type: 'heading', text: 'Como tomar whey protein?' },
      { type: 'paragraph', text: 'Você vai tomar como um "shake" ou "vitamina" e pode misturar com o que você quiser.( dependendo da sua dieta, claro)' },
      { type: 'image', src: '/images/articles/whey5.jpeg', alt: 'whey5' },
      { type: 'list', items: ['<strong>Dieta pra ganho de massa:</strong> Se sua dieta é para ganho de massa muscular, aconselho que tome com algumas frutas junto nos horários intervalados das refeições principais (leite, frutas, aveia, mel e o que tu imaginar).'] },
      { type: 'image', src: '/images/articles/whey6.jpeg', alt: 'whey6' },
      { type: 'list', items: ['<strong>Dieta pra emagrecimento:</strong> Se sua dieta aponta pro lado de emagrecimento, faz mais sentido você usar o whey com menos coisas juntos ( só água ou uma quantidade de leite considerável) pra te gerar saciedade com poucas calorias e bater suas metas de proteina ao mesmo tempos .'] },
      { type: 'image', src: '/images/articles/whey7.jpeg', alt: 'whey7' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: 'KeSFEemVJ9Q', title: 'Para que serve whey protein? - Leandro Twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: '--6YPh4AhBc', title: 'TUDO O QUE VOCÊ PRECISA SABER SOBRE WHEY PROTEIN - Renato Cariani' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'As informações sobre a importância da proteína são baseadas no posicionamento oficial da Sociedade Internacional de Nutrição Esportiva (ISSN). Para quem quer mergulhar na ciência, o estudo completo está disponível <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'cafeina',
    category: 'suplementacao',
    title: 'Cafeína: O Combustível do Treino',
    content: [
      { type: 'image', src: '/images/articles/cafeina.jpeg', alt: 'cafeina' },
      { type: 'heading', text: 'O que é a cafeína?' },
      { type: 'paragraph', text: 'A cafeína é um estimulante natural do sistema nervoso central, conhecido por aumentar o estado de alerta e reduzir a fadiga significativamente. Presente na pequena xícara de café que você toma pela tarde e em alguns estimulantes como refrigerantes e energéticos.' },
      { type: 'image', src: '/images/articles/cafeina2.jpeg', alt: 'cafeina2' },
      { type: 'heading', text: 'Principais Benefícios' },
      { type: 'list', items: ['<strong>Melhora do desempenho físico:</strong> Pode aumentar a força, resistência e potência muscular em exercícios de alta intensidade e longa duração.', '<strong>Queima de gordura:</strong>A cafeína pode acelerar o metabolismo e auxiliar na queima de gordura, especialmente em combinação com exercícios físicos.', '<strong> Aumento da energia e alerta:</strong> A cafeína age como um estimulante do sistema nervoso central, combatendo a fadiga e aumentando o estado de alerta. '] },
      { type: 'image', src: '/images/articles/cafeina3.jpeg', alt: 'cafeina3' },
      { type: 'heading', text: 'Possíveis malefícios' },
      { type: 'list', items: ['<strong>Efeitos colaterais:</strong> O consumo excessivo de cafeína pode causar insônia, ansiedade, nervosismo, taquicardia, desconforto gastrointestinal e dores de cabeça.', '<strong>Sensibilidade:</strong>Pessoas com sensibilidade à cafeína devem começar com doses menores e monitorar a reação do corpo. ', '<strong>Contraindicações:</strong> Pessoas com problemas cardíacos, pressão alta, ansiedade, insônia e úlcera devem ter cautela ao consumir cafeína - ela pode interagir com muitos remédios. ', '<strong>Imunidade:</strong> Com o uso exagerado, seu corpo se tornará cada vez mais resistente aos efeitos, fazendo você consumir mais e mais. Tudo isso pode te levar a um ciclo irrefreável.'] },
      { type: 'image', src: '/images/articles/cafeina4.jpeg', alt: 'cafeina4' },
      { type: 'heading', text: 'Como tomar cafeína?' },
      { type: 'paragraph', text: 'Bom, você ja toma! Quando toma um cafézinho pós expediente ou aquele refri em familia; mas num contexto de exercício físico e consumindo pílulas o papo é outro' },
      { type: 'image', src: '/images/articles/cafeina5.jpeg', alt: 'cafeina5' },
      { type: 'list', items: ['<strong>Antes do treino:</strong> A cafeína é mais eficaz quando tomada cerca de 30 a 60 minutos antes do exercício. A dose recomendada varia entre 3 a 6 mg por kg de peso corporal, dependendo da tolerância individual.', '<strong>Evite o uso excessivo:</strong> O uso excessivo pode levar a efeitos colaterais indesejados, tente seguir as normas ( 1 pílula como pré-treino) e alternar para dias que você vai precisar de um gás a mais. Nem sempre usar todos os dias é a solução.'] },
      { type: 'image', src: '/images/articles/cafeina6.jpeg', alt: 'cafeina6' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: 'ndT5-k3za3o', title: 'USE DE FORMA CORRETA A CAFEÍNA - Renato Cariani' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'ayuCIH31-cs', title: 'Café e cápsula de cafeína são iguais? - Leandro Twin' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'As informações deste artigo são baseadas no posicionamento oficial da Sociedade Internacional de Nutrição Esportiva (ISSN) sobre Cafeína e Performance. Você pode ler o estudo completo (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-020-00383-4" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'hipercalorico',
    category: 'suplementacao',
    title: 'Hipercalórico: O aliado para ganhar massa',
    content: [
      { type: 'image', src: '/images/articles/calorico.jpeg', alt: 'calorico' },
      { type: 'heading', text: 'O que é o hipercalórico??' },
      { type: 'paragraph', text: 'Hipercalóricos são suplementos que fornecem uma alta quantidade de calorias em uma única porção.' },
      { type: 'image', src: '/images/articles/calorico2.jpeg', alt: 'calorico2' },
      { type: 'heading', text: 'Principais Benefícios' },
      { type: 'list', items: ['<strong>Aumento de peso e massa muscular:</strong> A principal função dos hipercalóricos é auxiliar no ganho de peso e massa muscular, fornecendo calorias extras para o corpo. ', '<strong>Recuperação muscular:</strong> Pode ajudar na recuperação muscular após exercícios intensos, fornecendo os nutrientes necessários para a reconstrução dos tecidos.', '<strong>Energia para treinos:</strong> Hipercalóricos podem fornecer energia adicional para treinos,  melhorando o desempenho e a disposição.'] },
      { type: 'image', src: '/images/articles/calorico3.jpeg', alt: 'calorico3' },
      { type: 'heading', text: 'Faz diferença mesmo?' },
      { type: 'paragraph', text: 'Se você é um cara magro, sempre foi magrinho desde criança, é considerado "ectomorfo" por muitos analistas de plantão, não só faz diferença, como é sua VANTAGEM; pessoas com o metabolismo acelerado precisam consumir muitas calorias em poucas quantidades de comida, resumindo: hipercalórico.' },
      { type: 'image', src: '/images/articles/calorico4.jpeg', alt: 'calorico4' },
      { type: 'heading', text: 'Devo tomar hipercalórico?' },
      { type: 'paragraph', text: 'Vamo lá, guerreiro(a), para tomar hipercalórico você tem que ser uma pessoa com intenções claras de ganho de massa, se você ja tiver tendências ao ganho de massa e gordura poderá engordar ou não ter os resultados que espera. Normalmente usado para pessoas muito magras ou atletas com acompanhamento.' },
      { type: 'image', src: '/images/articles/calorico5.jpeg', alt: 'calorico5' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: '2GPeiMlwS6c', title: 'QUANDO UTILIZAR O HIPERCALÓRICO ? - Paulo Muzy' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'q1duJHJ-X0M', title: 'Tudo sobre hipercalorico *engorda?* - Leandro Twin' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A eficácia de um suplemento hipercalórico está diretamente ligada aos princípios de superávit energético e da ingestão combinada de carboidratos e proteínas para otimizar a recuperação e o crescimento muscular. A Sociedade Internacional de Nutrição Esportiva (ISSN) possui um posicionamento oficial detalhado sobre o tema de "Nutrient Timing". Você pode ler o estudo completo (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-4" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'pre-treino',
    category: 'suplementacao',
    title: 'Pré-treino: O Gás Extra',
    content: [
      { type: 'image', src: '/images/articles/pre10.jpeg', alt: 'pre10' },
      { type: 'heading', text: 'O que é o Pré-treino?' },
      { type: 'paragraph', text: 'Pré-treino é um suplemento projetado para ser tomado antes do exercício, com o objetivo de aumentar a energia, foco e resistência durante o treino.' },
      { type: 'image', src: '/images/articles/pre20.jpeg', alt: 'pre20' },
      { type: 'heading', text: 'Principais Benefícios' },
      { type: 'list', items: ['<strong>Aumento da energia:</strong> Pré-treinos podem fornecer um impulso de energia para enfrentar treinos mais intensos. ', '<strong>Melhora da força::</strong>Alguns pré-treinos podem conter ingredientes que auxiliam no aumento da força muscula', '<strong> Vasodilatação:</strong> A arginina presente em alguns pré-treinos pode promover a vasodilatação, aumentando o fluxo sanguíneo para os músculos e melhorando o transporte de nutrientes.  '] },
      { type: 'image', src: '/images/articles/pre30.jpeg', alt: 'pre30' },
      { type: 'heading', text: 'Possíveis malefícios' },
      { type: 'list', items: ['<strong>Consulte um profissional::</strong> O consumo excessivo de pré treino pode te causar algumas complicações cardíacas se você for sensível. Ansiedade, nervosismo, taquicardia, desconforto gastrointestinal e dores de cabeça.', '<strong>Siga as instruções do fabricante:</strong>Respeite as dosagens recomendadas e as instruções de uso do produto para evitar efeitos colaterais indesejados.  ', '<strong>Contraindicações:</strong> Pessoas com problemas cardíacos, pressão alta, ansiedade, insônia e úlcera devem ter cautela ao consumir cafeína - ela pode interagir com muitos remédios. ', '<strong>Efeitos colaterais:</strong> Se você sentir algum efeito colateral, interrompa o uso e consulte um profissional de saúde. '] },
      { type: 'image', src: '/images/articles/pre40.jpeg', alt: 'pre40' },
      { type: 'heading', text: 'Como tomar pré-treino?' },
      { type: 'paragraph', text: 'Não tem segredo nenhum, 30/60 minutos antes de ter seu exercício físico você pode tomar seu scoop de pré-trein. Quando você estiver aquecendo na sua academia, corrida, futebol ou crossfit, sentirá os efeitos rapidamente.' },
      { type: 'image', src: '/images/articles/pre50.jpeg', alt: 'pre50' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: 'hRm9hNCuNGc', title: 'Tudo sobre pre treino *melhor suplemento* - Leandro Twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'rdIXLPZHESw', title: 'COMO O PRÉ TREINO ATUA NO NOSSO CORPO? - Renato Cariani' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A análise dos pré-treinos é baseada no posicionamento oficial da Sociedade Internacional de Nutrição Esportiva (ISSN) sobre os suplementos multi-ingredientes (MIPS). Este estudo é a revisão mais completa sobre a segurança e eficácia desses produtos. Você pode ler o artigo completo (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-018-0247-6" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
 
  // --- ARTIGOS DE TREINAMENTO ---
  {
    id: 'cardio',
    category: 'treinamento',
    title: 'Cardio: o que é?',
    content: [
      { type: 'paragraph', text: 'Cardio, ou exercício cardiovascular, refere-se a qualquer atividade física que eleva a frequência cardíaca e respiratória, fortalecendo o coração e os pulmões.' },
      { type: 'image', src: '/images/articles/x.jpeg', alt: 'x' },
      { type: 'heading', text: 'Qual cardio praticar?' },
      { type: 'image', src: '/images/articles/x1.jpeg', alt: 'x1' },
      { type: 'paragraph', text: 'Maiores exemplos:' },
      { type: 'list', items: ['<strong>Caminhada:</strong>Uma atividade acessível e eficaz para iniciantes.', '<strong>Corrida:</strong> Ótima para quem busca alta intensidade e queima calórica.', '<strong>Ciclismo:</strong>Pode ser praticado em ambientes abertos ou em bicicletas ergométricas. ', '<strong>Natação:</strong> Um exercício de baixo impacto que trabalha todo o corpo.', '<strong>HIIT (Treino Intervalado de Alta Intensidade):</strong> Combina exercícios intensos com períodos curtos de descanso, ideal para quem tem pouco tempo.'] },
      { type: 'image', src: '/images/articles/x2.jpeg', alt: 'x2' },
      { type: 'heading', text: 'Qual o melhor cardio?' },
      { type: 'paragraph', text: 'A resposta vem na sua cara. O melhor cardio é o que você consegue fazer todos os dias. Constância vence intensidade curta, então, se você consegue fazer um tipo de cardio constantemente, esse é o melhor para você ' },
      { type: 'image', src: '/images/articles/x3.jpeg', alt: 'x3' },
      { type: 'heading', text: 'Antes ou depois da musculação?' },
      { type: 'paragraph', text: 'A resposta é: DEPOIS. Se você souber que vai ter um futebolzinho ou uma corrida com os amigos, tente ao máximo fazer seu treino de musculação a parte ( Antes ou muito tempo depois).' },
      { type: 'image', src: '/images/articles/x44.jpeg', alt: 'x4' },
      { type: 'heading', text: 'Faz diferença?' },
      { type: 'paragraph', text: 'Sim, jogador(a), o cárdio é uma ferramenta fundamental para sua saúde e não pode ser evitada como muitos fazem.' },
      { type: 'list', items: ['<strong>Cardiovascular</strong> Desenvolve seu sistema cardiovascular e respiratório cada vez mais ao longo do tempo'] },
      { type: 'list', items: ['<strong>Queima de calorias</strong> Auxilia na queima de calorias que, em sua grande parte vai te ajudar a perca de peso, pois subtrairá uma quantidade de calorias no seu calculo final, te levando ao deficit calórico'] },
      { type: 'list', items: ['<strong>Psicológico</strong> fazer cardio, assim como a musculação tem efeitos quimicos direto nas sensações e percepções do seu corpo, te deixando ao longo prazo mais calmo, com um sono mais proveitoso e com uma memória melhor.  '] },
      { type: 'image', src: '/images/articles/x55.jpeg', alt: 'x55' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: '-PNPLr7_6NI', title: 'Fazer cardio todos os dias cataboliza? - Leandro Twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'nqfgqqON3p8', title: 'O ÚNICO VÍDEO QUE VOCÊ PRECISA ASSISTIR SOBRE CARDIO - Laércio Refundini' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'Os benefícios do exercício cardiovascular para a saúde e composição corporal são amplamente documentados e formam a base das diretrizes de atividade física para adultos em todo o mundo. Essas recomendações são publicadas por grandes autoridades de saúde, como o American College of Sports Medicine (ACSM). Você pode consultar as diretrizes oficiais <a href="https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'sono',
    category: 'treinamento',
    title: 'Sono perfeito?',
    content: [
      { type: 'paragraph', text: ' Existe sono perfeito? Você sabe a importância de dormir bem? Isso pode estar estragando seus resultados.' },
      { type: 'image', src: '/images/articles/s.jpeg', alt: 's' },
      { type: 'heading', text: 'Benefícios de dormir bem' },
      { type: 'paragraph', text: 'Saiba as mudanças que dormir 8 horas por dia podem te trazer' },
      { type: 'image', src: '/images/articles/s1.jpeg', alt: 's1' },
      { type: 'paragraph', text: 'Exemplos:' },
      { type: 'list', items: ['<strong> Redução do estresse:</strong> Durante o sono, o corpo diminui a produção de cortisol e adrenalina, hormônios associados ao estresse. ', '<strongFortalecimento do sistema imunológico:</strong> O sono é essencial para a produção de proteínas que fortalecem o sistema imunológico. ', '<strong> Mais energia e disposição:</strong> Uma noite de sono restauradora repõe as energias e prepara o corpo para as atividades do dia seguinte.'] },
      { type: 'image', src: '/images/articles/s2.jpeg', alt: 's2' },
      { type: 'heading', text: 'Dormir pouco faz mal?' },
      { type: 'paragraph', text: 'Veja o porquê dormir pouco está tirando seus ganhos e acabando com seu bem-estar' },
      { type: 'image', src: '/images/articles/s3.jpeg', alt: 's3' },
      { type: 'list', items: ['<strong> Problemas de concentração e memória:</strong> A privação do sono afeta a capacidade de concentração, tomada de decisões e memória. ', '<strong> Impacto na saúde mental:</strong> O sono inadequado pode levar a quadros de ansiedade e depressão. ', '<strong> Redução da produtividade:</strong> A falta de sono afeta o desempenho no trabalho ou escola, diminuindo a produtividade e criatividade. '] },
      { type: 'heading', text: 'Sono e musculação' },
      { type: 'paragraph', text: 'Veja a relação do sono com a musculação.' },
      { type: 'image', src: '/images/articles/s4.jpeg', alt: 's4' },
      { type: 'list', items: ['<strong> Recuperação muscular:</strong> Durante o sono, especialmente nas fases profundas, o corpo realiza a reparação e reconstrução dos tecidos musculares danificados durante o treino. ', '<strong>Síntese de proteínas:</strong>O sono é crucial para a síntese de proteínas, um processo essencial para a construção e reparação muscular. ', '<strong>Redução do risco de lesões::</strong>O sono adequado melhora a coordenação motora e a capacidade de tomada de decisões, diminuindo o risco de lesões.  ', '<strong>Regulação hormonal:</strong>O sono influencia a produção de hormônios como o GH (hormônio do crescimento) e a testosterona, ambos importantes para o crescimento muscular. ,  '] },
      { type: 'heading', text: 'Faz diferença mesmo?' },
      { type: 'paragraph', text: 'Sim, jogador(a), o sono é uma NECESSIDADE do seu corpo. Assim como beber água e se alimentar direito, dormir bem, te trará qualidade de vida e benefícios muito presentes na sua vida cotidiana.' },
      { type: 'image', src: '/images/articles/s5.jpeg', alt: 's5' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'paragraph', text: 'Veja o que alguns dos maiores criadores de conteúdo falam sobre o tema:' },
      { type: 'youtube', videoId: 'pfD69v9sBPE', title: '5 Coisas Que Ninguém Te Conta Sobre SONO - Laercio Refundini' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'G9TVJbrPUtQ', title: 'O QUE FAZER PARA MELHORAR O SONO? - Renato Cariani' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'O papel crítico do sono na recuperação muscular, regulação hormonal (como testosterona e cortisol) e na performance atlética geral é extensivamente documentado pela ciência. As revisões da literatura científica consistentemente apontam o sono como um dos pilares fundamentais para atletas. Você pode ler uma dessas revisões importantes sobre o tema (em inglês) <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5703049/" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'falha-muscular',
    category: 'treinamento',
    title: 'Falha Muscular: O Limite é o Começo?',
    content: [
      { type: 'paragraph', text: 'Você ja treinou ate sentir que o musculo simplesmente não consegue mais? a sensação de que que seu bíceps desligou acompanhado da sensação de queimação? Você ja falhou treinando!' },
      { type: 'image', src: '/images/articles/falha.jpeg', alt: 'Pessoa treinando até a falha' },
      { type: 'heading', text: 'O que é a Falha Muscular?' },
      { type: 'paragraph', text: 'Chegar na "falha" é o ponto, durante uma série, em que você não consegue mais completar nenhuma repetição com a forma correta. Seu músculo literalmente "falha" em produzir a força necessária. Não é sobre gritar ou jogar o peso, é sobre atingir o limite técnico da sua força naquele momento.' },
      { type: 'image', src: '/images/articles/falha1.jpeg', alt: 'Close up em um músculo contraído' },
      { type: 'heading', text: 'É Necessário Treinar Sempre Até a Falha?' },
      { type: 'paragraph', text: 'Aqui mora o debate. A ciência mostra que o mais importante para a hipertrofia é o volume total de treino e a sobrecarga progressiva. Chegar na falha é uma ferramenta para garantir que você deu um estímulo intenso, mas não é a única e nem sempre a melhor.' },
      { type: 'list', items: [
          '<strong>Prós:</strong> Garante máxima intensidade e recrutamento de fibras musculares. É um ótimo sinalizador de que o esforço foi alto.',
          '<strong>Contras:</strong> Gera um estresse muito grande no sistema nervoso central, o que exige mais tempo de recuperação. Aumenta o risco de lesões, especialmente em exercícios compostos como agachamento e supino.'
      ]},
      { type: 'image', src: '/images/articles/falha2.jpeg', alt: 'Atleta descansando entre as séries' },
      { type: 'heading', text: 'Como Usar a Falha de Forma Inteligente?' },
      { type: 'paragraph', text: 'Use a falha como uma ferramenta estratégica, não como uma regra. É mais seguro e produtivo atingir a falha em exercícios de isolamento (ex: rosca bíceps, cadeira extensora) e nas últimas séries do exercício, do que em exercícios básicos e pesados.' },
      { type: 'image', src: '/images/articles/falha3.jpeg', alt: 'Atleta descansando entre as séries' },
      { type: 'heading', text: 'O cuidado necessário' }, 
      { type: 'paragraph', text: 'Muitas das vezes sua mente quer mais do que seu corpo pode aguentar...e é aí que as lesões por excesso de esforço entram.' },
      { type: 'image', src: '/images/articles/falha4.jpeg', alt: 'Atleta descansando entre as séries' },
      { type: 'paragraph', text: 'Veja as lesões mais comuns por excesso de esforço' },
      { type: 'list', items: [
          '<strong>Estiramento muscular:</strong> Ocorre quando as fibras musculares são alongadas além do seu limite, causando dor e restrição de movimento. ',
          '<strong>Contusão muscular:</strong> Resulta de um impacto direto no músculo, causando dor, inchaço e hematoma. '
      ]},

      { type: 'heading', text: 'Para Aprofundar' },
      { type: 'youtube', videoId: 'CqD7uLNDM6U', title: 'Como é treinar até a falha *macetes e detalhes* - Leandro Twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'KUau8cBOTTo', title: 'Será que Precisa Mesmo Treinar Até a Falha? Entenda... - Laércio Refundini' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A discussão sobre treinar até a falha é um tópico comum na ciência do esporte. As revisões analisam o impacto da falha vs. não-falha na hipertrofia e força. Você pode ler uma meta-análise sobre o tema (em inglês) <a href="https://journals.lww.com/nsca-jscr/fulltext/2024/01000/training_to_momentary_failure_and_its_effect_on.33.aspx" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'treino-diario',
    category: 'treinamento',
    title: 'Treinar Todo Dia: Herói ou Vilão?',
    content: [
      { type: 'paragraph', text: 'Quanto mais eu treinar, mais rápido ficarei no "shape" ? Você provavelmente ja se perguntou isso e pensou que só entraria em forma se treinasse 7 vezes por semana...mas isso é realmente a forma correta?' },
      { type: 'image', src: '/images/articles/dia.jpeg', alt: 'Página de calendário com todos os dias marcados' },
      { type: 'heading', text: 'Afinal, pode treinar musculação todos os dias?' },
      { type: 'paragraph', text: 'A resposta curta é: **sim, mas provavelmente não como você está pensando**. Treinar o mesmo grupo muscular todos os dias sem descanso é a receita para o desastre (overtraining e lesões). No entanto, treinar todos os dias com uma divisão de treino inteligente é totalmente possível e pode trazer ótimos resultados.' },
      { type: 'image', src: '/images/articles/dia1.jpeg', alt: 'Corpo humano dividido em grupos musculares' },
      { type: 'heading', text: 'O Segredo: Volume e Recuperação' },
        
      { type: 'list', items: [
          '<strong>Divisão Inteligente:</strong> Se você vai treinar 7 dias na semana, sua divisão precisa ser muito bem pensada (ex: ABCDE + 2 dias de grupos musculares pequenos ou cardio), garantindo que cada músculo descanse por pelo menos 48-72 horas.',
          '<strong>Overtraining:</strong> Treinar em excesso pode levar à queda de performance, cansaço crônico, dores persistentes e até problemas de sono. É o famoso "dar um passo para frente e dois para trás".',
          '<strong>Escute seu Corpo:</strong> O melhor treinador do mundo é o seu próprio corpo. Se você se sentir excessivamente cansado, com dores nas articulações ou sem motivação, talvez seja um sinal para tirar um dia de descanso.'
      ]},
      { type: 'image', src: '/images/articles/dia2.jpeg', alt: 'Pessoa dormindo tranquilamente' },
      { type: 'heading', text: 'Então, qual a frequência ideal?' },
      { type: 'paragraph', text: 'Para a maioria das pessoas que buscam hipertrofia, treinar de 4 a 6 vezes por semana com uma boa divisão (como ABC, ABCD, ABCDE) é mais do que suficiente para dar os estímulos necessários e permitir a recuperação adequada.' },
      { type: 'image', src: '/images/articles/dia3.jpeg', alt: 'Corpo humano dividido em grupos musculares' },
      { type: 'paragraph', text: 'Veja alguns exemplos' },
      { type: 'list', items: [
          '<strong>6x por semana:</strong> ABC (Treina cada grupo muscular 2x por semana, com um dia extra para o descanso ativo ou cardio)',
          '<strong>5x por semana:</strong> ABCDE (Treina cada grupo muscular 1x por semana, com um dia extra para foco em pernas ou costas)',
          '<strong>4x por semana:</strong> Uper & lower (Treina cada grupo muscular 2x por semana, treino para a parte superior do corpo (upper) e treino para a parte inferior do corpo (lower))',
          '<strong>3x por semana:</strong> Full body (Treina cada grupo muscular 3x por semana, (o corpo inteiro) tendo uma divisão de treino que inclui exercícios para todos os grupos musculares em uma quantidade equilibrada)',
      ]},
      { type: 'image', src: '/images/articles/dia4.jpeg', alt: 'Pessoa treinando' },




      { type: 'heading', text: 'Para Aprofundar' },
      { type: 'youtube', videoId: '2dA1mpPB370', title: 'Treinar todos os dias faz perder resultados - Leandro Twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: '402xYq37DdA', title: 'TREINAR TODOS OS DIAS PODE CAUSAR... - Fabricio Pacholok' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A relação entre frequência de treino, volume e hipertrofia é um dos pilares da periodização esportiva. Você pode ler uma meta-análise que compara os efeitos de treinar um grupo muscular 1, 2 ou 3+ vezes por semana (em inglês) <a href="https://pubmed.ncbi.nlm.nih.gov/27102172/" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'genetica',
    category: 'treinamento',
    title: 'Genética: Desculpa ou Realidade?',
    content: [
      { type: 'image', src: '/images/articles/gen.jpeg', alt: 'Estrutura de DNA' },
      { type: 'heading', text: 'O Peso da Genética nos Seus Resultados' },
      { type: 'paragraph', text: 'Vamos ser diretos: a genética importa, e muito. Ela define seu tipo físico básico, sua facilidade em ganhar massa muscular ou perder gordura, o formato dos seus músculos e seu "potencial máximo". Algumas pessoas simplesmente nasceram com uma "loteria genética" mais favorável para a musculação.' },
      { type: 'image', src: '/images/articles/gen1.jpeg', alt: 'Três biotipos lado a lado' },
      { type: 'heading', text: 'Genética é uma Sentença?' },
      { type: 'paragraph', text: '**Absolutamente não.** A genética é o ponto de partida, não o destino final. Ela pode definir a velocidade e o teto do seu progresso, mas ela não anula o poder da consistência, do treino duro, da dieta correta e do descanso.' },
      { type: 'image', src: '/images/articles/gen2.jpeg', alt: 'Pessoa se olhando no espelho com orgulho' },
      { type: 'list', items: [
          '<strong>Não se compare:</strong> Seu principal adversário no espelho é você mesmo. Comparar seu progresso com o de um atleta profissional com genética de elite é a receita para a frustração.',
          '<strong>Foque no Controlável:</strong> Você não controla seus genes, mas controla o que come, a intensidade do seu treino, suas horas de sono e sua disciplina. Foque 100% nisso.',
          '<strong>Supere seu "Eu" de ontem:</strong> O verdadeiro sucesso na musculação é estar melhor hoje do que você estava há 6 meses. Esse progresso ninguém pode tirar de você, não importa a genética.'
      ]},
      
      { type: 'heading', text: 'Conclusão: Jogue com as Cartas que Você Tem' },
      { type: 'paragraph', text: 'Não use a genética como uma desculpa para não dar o seu melhor. Use-a para entender seu corpo e ajustar suas expectativas. Um "ruim" com disciplina e consistência sempre irá mais longe do que um "bom" preguiçoso. Sempre.' },
      { type: 'image', src: '/images/articles/gen5.jpeg', alt: 'Pessoa se olhando no espelho com orgulho' },
      { type: 'heading', text: 'Não corra nade contra a maré' },
      { type: 'paragraph', text: 'Use a velocidade da água na direção que está ao seu favor' },
      { type: 'image', src: '/images/articles/gen3.jpeg', alt: 'Pessoa se olhando no espelho com orgulho' },
      { type: 'paragraph', text: 'Se você é gordinho, não se move muito, não busca se alimentar nas medidas certas e quer ter resultados satisfatórios na academia ou em cima de uma balança você está tentando quebrar uma parede no soco. Ao mesmo tempo um magrinho que joga futebol e corre todos os dias não joga o jogo certo no quesito ganho de massa na musculação. É tudo questão de perspectiva, analise o que você quer para sua vida e jogue o jogo certo.' },

      { type: 'image', src: '/images/articles/gen44.jpeg', alt: 'Pessoa se olhando no espelho com orgulho' },
      { type: 'heading', text: 'Para aprofundar' },
      { type: 'youtube', videoId: 'XKuO0h7jJa4', title: 'As piores genéticas do TikTok! - Rodrigo Goes' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'ua62_kFhsdI', title: 'Sua GENÉTICA É BOA para construir MÚSCULO ou ela te LIMITA? - Laercio Refundini' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A influência dos fatores genéticos na performance atlética e na resposta ao treinamento de força é um campo de estudo robusto. Você pode ler um artigo de revisão sobre o tema (em inglês) <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3993147/" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  }

,{
    id: 'dieta',
    category: 'alimentacao',
    title: 'Dieta: Mais que Apenas "Fechar a Boca"',
    content: [
      { type: 'paragraph', text: 'Ja ouviu alguém falando que está de dieta e por isso não vai comer praticamente nada o dia inteiro? Isso é um mito que precisa ser desmistificado. Dieta não é sobre passar fome, é sobre comer de forma inteligente e estratégica.' },
      { type: 'image', src: '/images/articles/di.jpeg', alt: 'Prato de comida saudável' },
      { type: 'heading', text: 'O que Realmente Significa "Fazer Dieta"?' },
      { type: 'paragraph', text: 'Dieta não é sinônimo de passar fome ou comer só salada. Uma dieta é, na verdade, um **plano alimentar**. É a organização do que você come para atingir um objetivo específico, seja ele ganhar massa muscular, perder gordura ou simplesmente ter mais saúde. É sobre comer de forma inteligente, não necessariamente menos.' },
      { type: 'image', src: '/images/articles/di2.jpeg', alt: 'Calculadora mostrando o metabolismo basal' },
      { type: 'heading', text: 'O Ponto de Partida: Superávit vs. Déficit' },
      { type: 'paragraph', text: 'Tudo começa com o balanço de calorias. Seu corpo gasta uma quantidade de energia só para se manter vivo (Metabolismo Basal). A partir daí:' },
      { type: 'list', items: [
        '<strong>Superávit Calórico (Bulking):</strong> Se você quer ganhar peso e massa muscular, precisa consumir **mais** calorias do que seu corpo gasta. É como fornecer mais tijolos do que a obra precisa, para que ela possa se expandir.',
        '<strong>Déficit Calórico (Cutting):</strong> Se o objetivo é perder gordura, você precisa consumir **menos** calorias do que seu corpo gasta, forçando-o a usar suas reservas de gordura como energia.'
      ]},
      { type: 'image', src: '/images/articles/di3.jpeg', alt: 'Gráfico de macronutrientes: Proteínas, Carboidratos, Gorduras' },
      { type: 'heading', text: 'Os Três Pilares: Macronutrientes' },
      { type: 'paragraph', text: 'Não adianta só contar calorias. A qualidade delas importa. Sua dieta precisa ser equilibrada entre os três macronutrientes, que vamos detalhar nos próximos artigos.' },
      { type: 'image', src: '/images/articles/di4.jpeg', alt: 'Pessoa planejando suas refeições da semana' },
      { type: 'heading', text: 'Para Aprofundar' },
      { type: 'youtube', videoId: 'wJBof_K85YY', title: 'COMO MONTAR UMA DIETA DO ZERO! - PASSO A PASSO | Renato Cariani' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'uMo4XbjDot4', title: 'Como fazer a DIETA LOW CARB do jeito certo para emagrecer - Tua Saúde' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'Os conceitos de balanço energético são a base da nutrição para controle de peso. A ISSN tem um posicionamento sobre dietas e composição corporal que aborda esses temas. Você pode ler (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0174-y" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  { 
    id: 'proteina',
    category: 'alimentacao',
    title: 'Proteína: Os Tijolos do Seu Corpo',
    content: [
      { type: 'paragraph', text: 'As proteínas podem ser encontradas em alimentos de origem animal e vegetal, e sua ingestão adequada é fundamental para a saúde e o bem-estar. ' },
      { type: 'image', src: '/images/articles/pro.jpeg', alt: 'Pedaços de carne, frango, ovos e whey' },
      { type: 'heading', text: 'Por que a Proteína é Tão Importante?' },
      { type: 'paragraph', text: 'Se o seu corpo fosse uma construção, as proteínas seriam os tijolos. Elas são fundamentais para reparar os tecidos musculares que você microlesiona durante o treino, permitindo que eles cresçam mais fortes. Sem proteína suficiente, seu esforço na academia é praticamente em vão.' },
      { type: 'image', src: '/images/articles/pro2.jpeg', alt: 'Balança pesando um filé de frango' },
      { type: 'heading', text: 'Quanto de Proteína Devo Consumir?' },
      { type: 'paragraph', text: 'Essa é a pergunta de um milhão de dólares. A ciência é bem clara sobre isso:' },
      { type: 'list', items: [
        '<strong>Para Hipertrofia:</strong> A recomendação geral para quem treina pesado fica entre **1.6 a 2.2 gramas de proteína por quilo de peso corporal**. Por exemplo, uma pessoa de 80kg deveria consumir entre 128g e 176g de proteína por dia.',
        '<strong>Não adianta exagerar:</strong> Consumir muito mais do que isso não demonstrou trazer benefícios extras para o ganho de massa muscular. O corpo simplesmente não consegue usar o excesso.'
      ]},
      { type: 'image', src: '/images/articles/pro3.jpeg', alt: 'Fontes de proteína animal e vegetal' },
      { type: 'heading', text: 'Melhores Fontes de Proteína' },
      { type: 'paragraph', text: 'Busque por fontes de alto valor biológico, que são facilmente absorvidas pelo corpo:' },
      { type: 'image', src: '/images/articles/pro4.jpeg', alt: 'Pessoa bebendo um shake de proteína pós-treino' },
      { type: 'list', items: [
          '<strong>Fontes Animais:</strong> Frango, carne vermelha, peixes, ovos e laticínios (leite, queijos, iogurtes).',
          '<strong>Fontes Vegetais:</strong> Soja, tofu, lentilha, grão de bico, feijão. É importante combinar diferentes fontes vegetais para obter todos os aminoácidos essenciais.',
          '<strong>Suplementos:</strong> Whey Protein, Caseína e Albumina são formas práticas e eficientes de complementar sua ingestão diária.'
      ]},
      
      { type: 'heading', text: 'Para Aprofundar' },
      { type: 'youtube', videoId: 'X7eW6tcDAYw', title: '13 Melhores Alimentos Para Ganhar MASSA MUSCULAR | Ricos em Proteína - Laércio Refundini' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: 'dT1zxM5fJAY', title: 'Os SINAIS de que VOCÊ ESTÁ COMENDO POUCA PROTEÍNA - Olá, Ciência!' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A ingestão de proteína para indivíduos fisicamente ativos é um dos tópicos mais estudados na nutrição esportiva. O posicionamento da ISSN é uma das referências mais sólidas sobre o assunto. Você pode ler o artigo (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'carboidrato',
    category: 'alimentacao',
    title: 'Carboidrato: O Combustível para a Força',
    content: [
       { type: 'paragraph', text: 'Carboidratos, também conhecidos como glicídios ou açúcares. Eles são a principal fonte de energia para o organismo, fornecendo cerca de 50% das calorias diárias' },
      { type: 'image', src: '/images/articles/car.jpeg', alt: 'Arroz, batata doce, pão e macarrão' },
      { type: 'heading', text: 'Carboidrato: Amigo ou Inimigo?' },
      { type: 'paragraph', text: 'Por muito tempo, o carboidrato foi demonizado, mas a verdade é uma só: ele é a **principal fonte de energia** do seu corpo. É a "gasolina" de alta octanagem que abastece seus treinos e suas funções cerebrais. Cortar carboidratos drasticamente pode sabotar sua performance e seu humor.' },
      { type: 'image', src: '/images/articles/car2.jpeg', alt: 'Maçã e pão branco lado a lado' },
      { type: 'heading', text: 'Simples vs. Complexos' },
      { type: 'paragraph', text: 'A grande diferença está na velocidade com que eles viram açúcar no seu sangue.' },
      { type: 'image', src: '/images/articles/car3.jpeg', alt: 'Pessoa comendo uma banana antes do treino' },
      { type: 'list', items: [
        '<strong>Carboidratos Complexos (Energia Lenta):</strong> São digeridos lentamente, fornecendo energia de forma gradual e constante. São ideais para a maior parte do dia. Ex: batata doce, arroz integral, aveia, pão integral.',
        '<strong>Carboidratos Simples (Energia Rápida):</strong> São digeridos rapidamente, dando um pico de energia. São úteis estrategicamente, como logo após o treino para repor suas energias. Ex: frutas, mel, pão branco, dextrose.'
      ]},
     
      { type: 'heading', text: 'Quando Comer Carboidratos?' },
      { type: 'paragraph', text: 'O timing pode otimizar seus resultados:' },
      { type: 'image', src: '/images/articles/car4.jpeg', alt: 'Prato colorido com arroz, frango e vegetais' },
      { type: 'list', items: [
        '<strong>Pré-Treino:</strong> Consumir carboidratos complexos 1-2 horas antes do treino garante que seus "tanques de energia" (glicogênio muscular) estejam cheios.',
        '<strong>Pós-Treino:</strong> Combinar carboidratos simples com proteína logo após o treino acelera a recuperação e a reposição de energia.'
      ]},
      
      { type: 'heading', text: 'Para Aprofundar' },
      { type: 'youtube', videoId: 'Vwo24w29Jpw', title: 'A quantidade ideal de carboidratos para cada um - Leandro Twin' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: '6y3KfIw6pYQ', title: 'Carboidratos e Emagrecimento - Renato Cariani' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'A ingestão de carboidratos é crucial para a performance atlética e a recuperação. A Sociedade Internacional de Nutrição Esportiva (ISSN) aborda isso em detalhes. Você pode ler o posicionamento oficial sobre "Nutrient Timing" (em inglês) <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-4" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  },
  {
    id: 'gordura',
    category: 'alimentacao',
    title: 'Gordura: O Macro Injustiçado',
    content: [
      { type: 'paragraph', text: 'Você provavelmente pensa que gordura é uma coisa ruim e está relacionada a uma pessoa gorda, né? Rola pra baixo e aprende.' },
      { type: 'image', src: '/images/articles/gor.jpeg', alt: 'Abacate, azeite, castanhas e salmão' },
      { type: 'heading', text: 'Por que Você Precisa de Gordura?' },
      
      { type: 'paragraph', text: 'Contrário ao que muitos pensam, a gordura não é sua inimiga. Ela é essencial! As gorduras são fundamentais para a produção de hormônios importantes, como a testosterona, além de serem vitais para a absorção de vitaminas (A, D, E, K) e para a saúde das células.' },
      { type: 'image', src: '/images/articles/gor2.jpeg', alt: 'Pote de manteiga de amendoim e um abacate' },
      { type: 'heading', text: 'As "Boas" e as "Ruins"' },
      { type: 'paragraph', text: 'O segredo é escolher as fontes certas de gordura.' },
      { type: 'image', src: '/images/articles/gor3.jpeg', alt: 'Cérebro e hormônios sendo ilustrados' },
      { type: 'list', items: [
        '<strong>Gorduras Boas (Insaturadas):</strong> São anti-inflamatórias e ótimas para a saúde do coração. Encontradas em abacates, azeite de oliva, castanhas, nozes, amêndoas e peixes gordos como o salmão.',
        '<strong>Gorduras a Evitar (Trans):</strong> São as piores, geralmente encontradas em produtos ultraprocessados, frituras, bolachas recheadas e margarinas. Devem ser evitadas ao máximo.',
        '<strong>Gorduras Saturadas:</strong> Presentes em carnes vermelhas e laticínios integrais. Não são vilãs como as gorduras trans, mas devem ser consumidas com moderação, dentro de uma dieta equilibrada.'
      ]},
      
      { type: 'heading', text: 'Gordura e Desempenho' },

      { type: 'paragraph', text: 'Manter um consumo adequado de gorduras boas é crucial para quem treina. Uma dieta muito baixa em gordura pode levar à queda na produção de testosterona, o que afeta diretamente seu ganho de massa muscular, sua força e sua libido.' },
      { type: 'image', src: '/images/articles/gor4.jpeg', alt: 'Mão cheia de castanhas' },
      { type: 'heading', text: 'Para Aprofundar' },
      { type: 'youtube', videoId: 'k7TjTPFa08E', title: 'GORDURAS QUE VÃO TE AJUDAR A SECAR - Renato Cariani' },
      { type: 'paragraph', text: 'Veja também:' },
      { type: 'youtube', videoId: '7qODQwoSc_A', title: 'Você Consegue Desinchar a Barriga em 7 Dias? - Laércio Refundini' },
      { type: 'heading', text: 'Referência Científica' },
      { type: 'paragraph', text: 'As diretrizes dietéticas modernas enfatizam a qualidade das gorduras em vez da quantidade total. Estudos investigam a relação entre diferentes tipos de gorduras e marcadores de saúde. Um bom ponto de partida é a revisão sobre gorduras dietéticas da Escola de Saúde Pública de Harvard, que você pode ler (em inglês) <a href="https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/fats-and-cholesterol/" target="_blank" rel="noopener noreferrer">clicando aqui</a>.' }
    ]
  }
];