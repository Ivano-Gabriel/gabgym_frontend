import React from 'react';
import {FiChevronDown,FiHelpCircle,FiArrowUpRight,FiMessageCircle,FiMail} from 'react-icons/fi';
import {FaWhatsapp,FaInstagram} from 'react-icons/fa';
import './MeAjudePage.css';

const questions=[
  {question:'Onde ficam meus registros?',answer:'Alimentos, água, treinos e atividades registrados no diário ficam associados à sua conta no servidor. Referências pessoais de calorias e água, medidas extras e foto de perfil ainda ficam somente neste navegador durante o piloto.'},
  {question:'Por que o login demora às vezes?',answer:'O servidor do piloto pode entrar em repouso quando fica sem acessos. Quando isso acontece, a primeira tentativa pode demorar mais para carregar.'},
  {question:'Como acompanhar minha evolução?',answer:'Abra Hoje para o resumo diário, Histórico para os últimos sete dias e Registros para conferir e corrigir lançamentos do dia.'},
  {question:'Posso usar o GABGYM gratuitamente?',answer:'O GABGYM está em fase piloto. As funcionalidades disponíveis atualmente podem ser testadas sem cobrança.'},
];
const contacts=[
  {label:'WhatsApp',href:'https://wa.me/5582996230505',Icon:FaWhatsapp},
  {label:'Instagram',href:'https://instagram.com/i.gabriel13_',Icon:FaInstagram},
  {label:'E-mail',href:'mailto:gabrimelo90@gmail.com',Icon:FiMail}
];
export default function MeAjudePage(){
  return <main className="gg-help">
    <div className="gg-help-inner">
      <header className="gg-help-header">
        <span><FiHelpCircle aria-hidden="true"/> SUPORTE / GABGYM</span>
        <h1>PRECISA DE AJUDA<span>.</span></h1>
        <p>Dúvidas rápidas e contato direto, sem complicação.</p>
      </header>
      <section aria-labelledby="gg-help-faq">
        <div className="gg-help-title"><span>01 / RESPOSTAS</span><h2 id="gg-help-faq">DÚVIDAS FREQUENTES.</h2></div>
        <div className="gg-help-faq">
          {questions.map(({question,answer})=><details key={question}>
            <summary>{question}<FiChevronDown aria-hidden="true"/></summary>
            <p>{answer}</p>
          </details>)}
        </div>
      </section>
      <section aria-labelledby="gg-help-contact">
        <div className="gg-help-title"><span>02 / CONTATO</span><h2 id="gg-help-contact">FALE COMIGO.</h2></div>
        <div className="gg-help-contacts">
          {contacts.map(({label,href,Icon})=><a href={href} target={href.startsWith('http')?'_blank':undefined}
            rel={href.startsWith('http')?'noopener noreferrer':undefined} key={label}>
            <Icon aria-hidden="true"/><strong>{label}</strong><FiArrowUpRight aria-hidden="true"/>
          </a>)}
        </div>
      </section>
      <p className="gg-help-footer"><FiMessageCircle aria-hidden="true"/> A GENTE MELHORA UM DIA DE CADA VEZ.</p>
    </div>
  </main>;
}
