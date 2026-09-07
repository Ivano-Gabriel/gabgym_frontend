import React from 'react';
import { Link } from 'react-router-dom'; // Para o botão de "Matricule-se"

// --- NOVA PALETA DE CORES DO GABGYM (COLE AQUI TAMBÉM!) ---
const colors = {
  primaryGreen: '#74E85D',
  darkGreen: '#21331D',
  mediumDarkGray: '#303E2E',
  lightGray: '#60695E',
  whiteText: '#f8f9fa',
  darkText: '#1a1a1a',
};
// --- FIM DA PALETA DE CORES ---

function EnrollSection() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Comece a Treinar <br/> Ainda Hoje</h2> {/* Título impactante */}

      {/* Campos de seleção (placeholders por enquanto) */}
      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="estado">Estado</label>
        <select id="estado" style={styles.select}>
          <option value="">Selecione seu estado</option>
          {/* Opções de estado aqui futuramente */}
          <option value="SP">São Paulo</option>
          <option value="RJ">Rio de Janeiro</option>
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="cidade">Cidade</label>
        <select id="cidade" style={styles.select}>
          <option value="">Selecione sua cidade</option>
          {/* Opções de cidade aqui futuramente */}
          <option value="SaoPaulo">São Paulo</option>
          <option value="Campinas">Campinas</option>
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label} htmlFor="unidade">Unidade</label>
        <select id="unidade" style={styles.select}>
          <option value="">Selecione a unidade</option>
          {/* Opções de unidade aqui futuramente */}
          <option value="Centro">Centro</option>
          <option value="Bairro">Bairro</option>
        </select>
      </div>

      {/* O Botão "Matricule-se" que leva ao Perfil */}
      <Link to="/profile-form" style={styles.button}>
        MATRICULE-SE AGORA
      </Link>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: colors.mediumDarkGray, // Fundo do bloco "Matricule-se"
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    width: '90%',
    maxWidth: '450px', // Largura máxima para centralizar bem
    margin: '20px', // Margem em volta do bloco
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centraliza itens
    textAlign: 'center',
  },
  title: {
    fontSize: '2em',
    color: colors.primaryGreen, // Cor do título
    marginBottom: '25px',
    lineHeight: '1.2',
  },
  inputGroup: {
    width: '100%',
    marginBottom: '15px',
    textAlign: 'left', // Alinha label e select à esquerda
  },
  label: {
    display: 'block',
    color: colors.whiteText,
    marginBottom: '8px',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '1em',
    borderRadius: '5px',
    border: `1px solid ${colors.lightGray}`,
    backgroundColor: colors.lightGray, // Cor de fundo dos selects
    color: colors.whiteText,
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${colors.whiteText.substring(1)}' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '16px',
    cursor: 'pointer',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: colors.darkText,
    backgroundColor: colors.primaryGreen,
    border: `2px solid ${colors.primaryGreen}`, // Borda mais fina que o da Home
    borderRadius: '50px', // Mais arredondado que o da Home
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textDecoration: 'none',
    display: 'inline-block',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '30px',
  },
};

export default EnrollSection;