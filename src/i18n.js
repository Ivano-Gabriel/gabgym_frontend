import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const supported=['pt','en','es','fr'];
const browserLanguage=typeof navigator!=='undefined'
  ?String(navigator.language||'pt').slice(0,2).toLowerCase():'pt';
let storedLanguage='';
try{storedLanguage=localStorage.getItem('gabgym:interface-language')||'';}catch{}
const initial=process.env.NODE_ENV==='test'?'pt':
  supported.includes(storedLanguage)?storedLanguage:
  supported.includes(browserLanguage)?browserLanguage:'pt';

i18n.use(initReactI18next).init({
  resources:{pt:{translation:pt},en:{translation:en},es:{translation:es},fr:{translation:fr}},
  lng:initial,
  fallbackLng:'pt',
  supportedLngs:supported,
  interpolation:{escapeValue:false},
  react:{useSuspense:false}
});

export default i18n;
