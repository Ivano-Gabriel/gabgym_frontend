// src/pages/AboutMePage.js
import React from 'react';
import Carousel from '../components/Carousel';
import { FaLinkedin, FaWhatsapp, FaInstagram, FaGithub } from 'react-icons/fa';

const socialLinks = [
  { id: 's1', title: 'LinkedIn', imageSrc: '/images/linkedin-card.jpg', link:'https://www.linkedin.com/in/ivano-gabriel-silva-melo-silva-melo-b0b543371/' },
  { id: 's2', title: 'WhatsApp', imageSrc: '/images/wpp-card.jpg', link: 'https://wa.me/5582996230505' },
  { id: 's3', title: 'Instagram', imageSrc: '/images/instagram-card.jpg', link: 'https://www.instagram.com/i.gabriel13_/' },
  { id: 's4', title: 'GitHub', imageSrc: '/images/github-card.jpg', link: 'https://github.com/Ivano-Gabriel' }
];

function AboutMePage() {
  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}> Sobre o Programador</h2>
      <img src="/images/krawk-profile.jpg" alt="Foto do Programador" style={styles.photo} />
      <p style={styles.description}>
        Oi, me chamo Ivano Gabriel, tenho 20 anos, sou um estudante de Ciências da Computação e é um prazer te conhecer! 
        Sou um desenvolvedor iniciante que quer mudar a visibilidade da tecnologia no Brasil. 
        Criei o GabGym como forma de unir minha paixão por musculação e tecnologia.
      </p>
      <h2 style={styles.title}> Atualmente</h2>
      <img src="/images/uninassau.jpg" alt="Foto do Programador" style={styles.photo} />
      <p style={styles.description}>
        Atualmente, estou estudando para me tornar um desenvolvedor full stack, com foco em React.js e Python/Django. Sou um estudante de Ciências da Computação na Universidade Maurício de Nassau e nesse momento (04/07/2025) estou dando inicio ao 2° período.
      </p>
      <h2 style={styles.title}> Comprove</h2>
      <img src="/images/git4.jpg" alt="Foto do Programador" style={styles.photo} />
      <p style={styles.description}>
        Acesse meu GitHub para ver meus projetos e meus códigos. Esse é meu terceiro projeto de muitos que estou desenvolvendo.
      </p>

      {/* ===== CARROSSEL ADICIONADO AQUI ===== */}
      <div style={{width: '100%', marginTop: '50px'}}>
        <Carousel 
          title="Minhas Redes" 
          items={socialLinks.map(item => ({...item, isExternal: true}))}
        />
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: '100vh', backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/images/transferir.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px', textAlign: 'center', },
  title: { fontSize: '2.8em', marginBottom: '25px', color: '#74E85D', fontWeight: 'bold', textShadow: '4px 4px 4px rgba(0, 0, 0, 0.5)', fontFamily: 'Arial, sans-serif', },
  photo: { width: '325px', height: '350px', borderRadius: '19%', objectFit: 'cover', marginBottom: '10px', border: '4px solid #74E85D', },
  description: { maxWidth: '650px', fontSize: '1.15em', marginBottom: '20px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)', },
  linksContainer: { display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap', justifyContent: 'center', },
  link: { color: '#74E85D', fontSize: '1.1em', textDecoration: 'none', border: '2px solid #74E85D', padding: '10px 20px', borderRadius: '8px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', },
  icon: { width: '20px', marginRight: '8px', },
};

export default AboutMePage;