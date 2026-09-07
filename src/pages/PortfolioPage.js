// src/pages/PortfolioPage.js
import React from 'react';
import Carousel from '../components/Carousel';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const projectLinks = [
  { id: 'p1', title: 'GitHub', imageSrc: '/images/github-card.jpg', link: 'https://github.com/Ivano-Gabriel' },
  { id: 'p2', title: 'LinkedIn', imageSrc: '/images/linkedin-card.jpg', link: 'https://www.linkedin.com/in/ivano-gabriel-silva-melo-silva-melo-b0b543371/' },
  { id: 'p3', title: 'WhatsApp', imageSrc: '/images/wpp-card.jpg', link: 'https://wa.me/5582996230505' }
];

function PortfolioPage() {
  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}> Projeto GabGym</h2>
      <div style={styles.imageGallery}>
        <img src="/images/sobre300.jpg" alt="Foto 3" style={styles.photo} />
      </div>
      <div style={styles.linksContainer}>
        <a href="https://github.com/Ivano-Gabriel" target="_blank" rel="noreferrer" style={styles.link}>
          Gabgym 100% no github
        </a>
      </div>
      <p style={styles.description}>
        O GabGym nasceu como um projeto para auxiliar iniciantes na jornada de musculação. Através de uma interface moderna, ele oferece orientação, modelos de treino e informações sobre a musculação.
      </p>
      <br />
      <div style={styles.imageGallery}>
        <img src="/images/sobre200.jpg" alt="Foto 3" style={styles.photo} />
      </div>
      <p style={styles.description}>
        Este projeto foi desenvolvido com <strong>React.js, python-Django, html, css, javascript, e banco de dados</strong>, é 100% responsivo e pensado para ser leve e intuitivo.
      </p>
      <br />
      <h2 style={styles.title}> Meus últimos projetos </h2>
      <br />
      <br />
      <div style={styles.imageGallery}>
        <img src="/images/adc1.jpg" alt="Foto 1" style={styles.photo} />
      </div>
      <p style={styles.description}>
        A barbearia foi meu primeiro projeto, desenvolvido com <strong>Python/Django, htmle e css.</strong> Muito básico, inicial e foi o começo das minhas ideias. Ainda incompleto, mas já tem uma interface funcional.
      </p>
      <div style={styles.linksContainer}>
        <a href="https://github.com/Ivano-Gabriel/BarbeariaDjango" target="_blank" rel="noreferrer" style={styles.link}>
          Barbearia 100% no Github
        </a>
      </div>
      <br />
      <br />
      <br />
      <div style={styles.imageGallery}>
        <img src="/images/abc2.jpg" alt="Foto 1" style={styles.photo} />
      </div>
      <p style={styles.description}>
        A lanchonete foi meu segundo projeto, desenvolvido com <strong>Python/Django, html, css e javascript puro.</strong> Foi um projeto levemente mais complexo, para testar meus conhecimentos e aprimorar minhas habilidades.
      </p>
      <div style={styles.linksContainer}>
        <a href="https://github.com/Ivano-Gabriel/Ivano-Gabriel-Lanchonete-Django" target="_blank" rel="noreferrer" style={styles.link}>
          Lanchonete 100% no Github </a>
      </div>

      {/* ===== CARROSSEL ADICIONADO AQUI ===== */}
      <div style={{width: '100%', marginTop: '50px'}}>
        <Carousel 
          title="Conecte-se e veja mais" 
          items={projectLinks.map(item => ({...item, isExternal: true}))} 
        />
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: '100vh', backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/images/transferir.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px', textAlign: 'center', },
  title: { fontSize: '2.5em', marginBottom: '1px', color: '#74E85D', },
  imageGallery: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '30px', width: '100%', maxWidth: '960px', },
  photo: { width: '350px', height: '280px', borderRadius: '19%', objectFit: 'cover', border: '4px solid #74E85D', },
  description: { maxWidth: '650px', fontSize: '1.15em', marginBottom: '20px', lineHeight: '1.6', },
  linksContainer: { display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap', justifyContent: 'center', },
  link: { color: '#74E85D', fontSize: '1.1em', textDecoration: 'none', border: '2px solid #74E85D', padding: '10px 20px', borderRadius: '8px', transition: 'all 0.3s ease', },
};

export default PortfolioPage;