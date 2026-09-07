// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json'; // Dicionário em português
import en from './locales/en.json'; // Dicionário em inglês

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      pt: {
        translation: pt
      }
    },
    lng: navigator.language || navigator.userLanguage, // Detecta o idioma do navegador
    fallbackLng: 'pt', // Se não achar o idioma, usa português
    interpolation: {
      escapeValue: false // React já protege contra XSS
    }
  });

export default i18n;