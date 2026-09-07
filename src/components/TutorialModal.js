// src/components/TutorialModal.js
import React from 'react';
import './TutorialModal.css';

// SEU CONTEÚDO ORIGINAL, 100% PRESERVADO
const tutorialSteps = [
  {
    title:"Criando seu perfil",
    description: "Informe seus dados para que possamos calcular suas metas de calorias, macros e montar seu plano personalizado.",
    imageSrc: "/images/tutorial/tutorial-perfil.png"
  },
  {
    title: "Perfil-Hub do gabgym",
    description: "Aqui é onde você visualiza os dados que cadastrou na aba anterior e acessa todas as funcionalidades, troca o idioma, edita perfil, troca de perfil e adiciona sua identidade. Sua área principal para todas as abas do app.",
    imageSrc: "/images/tutorial/hub.png"
  },
  {
    title: "ABA 1 - Dieta",
    description: "Aqui é sua central de controle quando se trata de dieta. Registre suas refeições, água, sono e gasto calórico. Acompanhe seu progresso em tempo real e veja se bateu as metas. (Ao finalizar o dia, sua refeição será zerada automaticamente e adicionada ao histórico de refeições da aba 'Metas')",
    imageSrc: "/images/tutorial/dieta.png"
  },
  {
    title: "ABA 2 - Treinos",
    description: "Aqui você pode acessar videos de variações de treinos a hora que quiser. Veja a execução e faça junto com a gente na sua academia. O sinônimo de eficiência se chama gabgym!",
    imageSrc: "/images/tutorial/tutorial-treinos.png"
  },
  {
    title: "ABA 3 - Cárdio",
    description: "Nessa aba você sai pra correr com a gente no bolso. Faça seu cárdio e contabilize tudo em tempo real com o gabgym. Bora fazer cárdio, jogador!!",
    imageSrc: "/images/tutorial/cardio1.png"
  },
  {
    title: "ABA 4 - Curiosidades",
    description: "Nessa aba você fica por dentro dos maiores tópicos ja discutidos na maromba; Vai me dizer que você nunca se perguntou: 'Qual alimento é proteína?', 'Cárdio é antes ou depois do treino?', 'Pra emagrecer é só fechar a boca?'",
    imageSrc: "/images/tutorial/curi.png"
  },
  {
    title: "ABA 5 - Metas ",
    description: "Nessa aba você pode registrar suas metas mais importantes e se manter motivado(Sua dieta ficará registrada ao fim do dia e seus cardios são enviados automaticamente após o término). Atualizar suas fotos a cada período de tempo é uma ótima forma de se manter no jogo e ver o quanto você evoluiu.",
    imageSrc: "/images/tutorial/regis.png"
  },
  {
    title: "ABA 6 - Ajude-me",
    description: "Nessa aba você pode enviar suas reclamações sobre o funcionamento do app direto pro progamador ( sim, eu mesmo 🤫 ) Vai me dizer que você não se incomodou com nada?? Caso sim, sem problemas, fico muito grato.",
    imageSrc: "/images/tutorial/comigo.png"
  }
];

function TutorialModal({ onClose }) {
  // A NOSSA NOVA ESTRUTURA TÉCNICA
  return (
    <div className="tutorial-modal-overlay" onClick={onClose}>
      <div className="tutorial-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="tutorial-modal-close-button">×</button>
        <h2 className="tutorial-modal-title">Guia Rápido do GabGym</h2>
        
        {/* O SEU MAP DE CONTEÚDO, EXATAMENTE COMO VOCÊ FEZ */}
        <div className="tutorial-content">
          {tutorialSteps.map((step, index) => (
            <div key={index} className="tutorial-step">
              
              <div className="tutorial-text">
                <h3>{step.title}</h3>
              </div>

              <div className="tutorial-media">
                <img src={step.imageSrc} alt={step.title} />
              </div>

              <div className="tutorial-text">
                <p>{step.description}</p>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TutorialModal;