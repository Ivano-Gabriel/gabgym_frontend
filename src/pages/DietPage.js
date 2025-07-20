// src/pages/DietPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// A gente não vai mais importar os cálculos daqui, eles estarão na própria página
// import { calculateBMR, calculateTDEE, calculateMacros, calculateWaterIntake } from '../utils/MetabolismCalculator';


function DietPage() {
  const { t } = useTranslation();
  const [userGoals, setUserGoals] = useState(null);
  const [maintenanceCalories, setMaintenanceCalories] = useState(0);
  const [userName, setUserName] = useState('');
  const [waterGoal, setWaterGoal] = useState(0);

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/dieta.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('gabgymUserData'));

    if (storedUserData && storedUserData.weight && storedUserData.height && storedUserData.age) {
      const { gender, weight, height, age, objective } = storedUserData;

const weightNum = parseFloat(weight) || 0;
const heightNum = parseFloat(height) || 0;
const ageNum = parseFloat(age) || 0;

if (!weightNum || !heightNum || !ageNum) {
  console.warn("⚠️ Dados inválidos detectados:");
  console.log("Peso:", weight, "→", weightNum);
  console.log("Altura:", height, "→", heightNum);
  console.log("Idade:", age, "→", ageNum);
  return;
}
      // --- CÁLCULO "À PROVA DE FANTASMAS" ---

      // 1. CALCULA O GASTO EM REPOUSO (BMR)
      let bmr_calculado = 0;
      if (gender === 'male') {
        bmr_calculado = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
      } else {
        bmr_calculado = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
      }

      // 2. CALCULA O GASTO TOTAL DO DIA (TDEE)
      const GASTO_TOTAL_DIARIO = bmr_calculado * 1.55;

      // 3. VAMOS VER NO CONSOLE O QUE ELE CALCULOU
      console.log("BMR (Repouso):", Math.round(bmr_calculado));
      console.log("GASTO TOTAL COM ATIVIDADE (BMR * 1.55):", Math.round(GASTO_TOTAL_DIARIO));

      // 4. ATUALIZA O CARD DE "CALORIAS DE MANUTENÇÃO" COM O GASTO TOTAL
      setMaintenanceCalories(Math.round(GASTO_TOTAL_DIARIO));

      // 5. CALCULA A META FINAL BASEADA NO GASTO TOTAL
      let meta_final_calorias = GASTO_TOTAL_DIARIO;
      if (objective === 'gain-muscle') {
        meta_final_calorias += 300;
      } else if (objective === 'lose-fat') {
        meta_final_calorias -= 400;
      }

      const proteinas = Math.round((meta_final_calorias * 0.35) / 4);
      const carboidratos = Math.round((meta_final_calorias * 0.40) / 4);
      const gorduras = Math.round((meta_final_calorias * 0.25) / 9);

      setUserGoals({
        calories: Math.round(meta_final_calorias),
        protein: proteinas,
        carbs: carboidratos,
        fat: gorduras,
        objective: objective,
      });

      setUserName(storedUserData.name);
      setWaterGoal(Math.round(weightNum * 35));
    }
  }, []);

  if (!userGoals) {
    return (
      <div className="content-page" style={pageStyle}>
        <h2 className="workout-page-title">{t('metas.titulo')}</h2>
        <p className="content-description">Por favor, preencha seu perfil para podermos calcular suas metas.</p>
        <Link to="/profile-form" className="cta-button">Preencher Perfil</Link>
      </div>
    );
  }

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">{t('metas.titulo')}</h2>
      
      <p className="goals-intro" dangerouslySetInnerHTML={{ __html: t('metas.saudacao', { name: `<strong>${userName}</strong>`, objective: t(`metas.objetivos.${userGoals.objective}`) }) }} />

      <div className="goals-container">
        <div className="calorie-goals-grid">
          <div className="macro-card calorie-maintenance">
            <span className="macro-value">{maintenanceCalories}</span>
            <span className="macro-label">{t('metas.manutencao_label')}</span>
            <p className="macro-description">{t('metas.manutencao_desc')}</p>
          </div>
          <div className="macro-card calories-target">
            <span className="macro-value">{userGoals.calories}</span>
            <span className="macro-label">{t('metas.meta_diaria_label')}</span>
            <p className="macro-description" dangerouslySetInnerHTML={{ __html: t('metas.meta_diaria_desc', { objective: `<strong>${t(`metas.objetivos.${userGoals.objective}`)}</strong>` }) }} />
          </div>
        </div>

        <div className="macros-grid">
          <div className="macro-card">
            <span className="macro-value">{userGoals.protein}g</span>
            <span className="macro-label">{t('metas.proteinas')}</span>
            <p className="macro-cals">({userGoals.protein * 4} kcal)</p>
          </div>
          <div className="macro-card">
            <span className="macro-value">{userGoals.carbs}g</span>
            <span className="macro-label">{t('metas.carboidratos')}</span>
            <p className="macro-cals">({userGoals.carbs * 4} kcal)</p>
          </div>
          <div className="macro-card">
            <span className="macro-value">{userGoals.fat}g</span>
            <span className="macro-label">{t('metas.gorduras')}</span>
            <p className="macro-cals">({userGoals.fat * 9} kcal)</p>
          </div>
          <div className="macro-card water">
            <span className="macro-value">{waterGoal}<span style={{fontSize: '0.5em', marginLeft: '5px'}}>ml</span></span>
            <span className="macro-label">{t('metas.agua')}</span>
            <p className="macro-description">Sua meta de hidratação diária recomendada.</p>
          </div>
        </div>

        <div className="diet-page-actions">
        <Link to="/diario-alimentar" className="cta-button">{t('metas.botao_registrar')}</Link>
        </div>
        <Link to="/perfil" className="back-button-general" style={{ marginTop: '30px' }}>{t('metas.botao_voltar_hub')}</Link>
      </div>
    </div>
  );
}

export default DietPage;