// src/pages/DietPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUser } from '../services/apiService';
import './DietPage.css';
// A gente não vai mais importar os cálculos daqui, eles estarão na própria página
// import { calculateBMR, calculateTDEE, calculateMacros, calculateWaterIntake } from '../utils/MetabolismCalculator';


function DietPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userGoals, setUserGoals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [maintenanceCalories, setMaintenanceCalories] = useState(0);
  const [userName, setUserName] = useState('');
  const [waterGoal, setWaterGoal] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    getUser(userId)
      .then(response => {
        const storedUserData = response.data;

        if (storedUserData && storedUserData.weight && storedUserData.height && storedUserData.age) {
          const { gender, weight, height, age, objective, activityLevel} = storedUserData;

const weightNum = parseFloat(weight) || 0;
const heightNum = parseFloat(height) || 0;
const ageNum = parseFloat(age) || 0;

if (!weightNum || !heightNum || !ageNum) {
  console.warn("⚠️ Dados inválidos detectados:");
  console.log("Peso:", weight, "→", weightNum);
  console.log("Altura:", height, "→", heightNum);
  console.log("Idade:", age, "→", ageNum);
  setIsLoading(false);
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
       const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725
  };
  const multiplier = activityMultipliers[activityLevel] || 1.55; // Usa 1.55 como padrão
  
  // 2. CALCULA O GASTO TOTAL DO DIA (TDEE) COM PRECISÃO
  const GASTO_TOTAL_DIARIO = bmr_calculado * multiplier;

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
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar perfil pra calcular metas:', err);
        setIsLoading(false);
      });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="gg-diet-container">
        <p className="gg-diet-status">Carregando suas metas...</p>
      </div>
    );
  }

  if (!userGoals) {
    return (
      <div className="gg-diet-container">
        <div className="gg-diet-empty">
          <p>Preencha seu perfil pra calcularmos suas metas.</p>
          <Link to="/profile-form" className="gg-diet-btn-primary">Preencher Perfil</Link>
        </div>
      </div>
    );
  }

  const ajusteMap = { 'gain-muscle': '+300', 'lose-fat': '-400', 'maintain-weight': '±0' };
  const ajuste = ajusteMap[userGoals.objective] || '±0';

  return (
    <div className="gg-diet-container">
      <div className="gg-diet-card">

        <div className="gg-diet-top">
          <h1 className="gg-diet-title">{t('metas.titulo')}</h1>
          <p className="gg-diet-subtitle" dangerouslySetInnerHTML={{ __html: t('metas.saudacao', { name: `<strong>${userName}</strong>`, objective: t(`metas.objetivos.${userGoals.objective}`) }) }} />
        </div>

        <div className="gg-diet-hero">
          <span className="gg-diet-hero-label">{t('metas.meta_diaria_label')}</span>
          <strong className="gg-diet-hero-value">{userGoals.calories}<small>kcal/dia</small></strong>
          <p className="gg-diet-hero-explain">
            Sua manutenção é <strong>{maintenanceCalories} kcal</strong> — ajustamos <strong>{ajuste} kcal</strong> pra sua meta de {t(`metas.objetivos.${userGoals.objective}`).toLowerCase()}.
          </p>
        </div>

        <div className="gg-diet-macros">
          <div className="gg-diet-macro-card">
            <div className="gg-diet-macro-top">
              <span>{t('metas.proteinas')}</span>
              <strong>{userGoals.protein}g</strong>
            </div>
            <p>{t('metas.protein_explicacao')} · {userGoals.protein * 4} kcal</p>
          </div>
          <div className="gg-diet-macro-card">
            <div className="gg-diet-macro-top">
              <span>{t('metas.carboidratos')}</span>
              <strong>{userGoals.carbs}g</strong>
            </div>
            <p>{t('metas.carbs_explicacao')} · {userGoals.carbs * 4} kcal</p>
          </div>
          <div className="gg-diet-macro-card">
            <div className="gg-diet-macro-top">
              <span>{t('metas.gorduras')}</span>
              <strong>{userGoals.fat}g</strong>
            </div>
            <p>{t('metas.fat_explicacao')} · {userGoals.fat * 9} kcal</p>
          </div>
          <div className="gg-diet-macro-card water">
            <div className="gg-diet-macro-top">
              <span>{t('metas.agua')}</span>
              <strong>{waterGoal}<small>ml</small></strong>
            </div>
            <p>{t('metas.agua_explicacao')}</p>
          </div>
        </div>

        <div className="gg-diet-actions">
          <Link to="/historico" className="gg-diet-btn-secondary">{t('metas.botao_historico')}</Link>
          <Link to="/diario-alimentar" className="gg-diet-btn-primary">{t('metas.botao_registrar')}</Link>
        </div>

        <Link to="/perfil" className="gg-diet-back-link">{t('metas.botao_voltar_hub')}</Link>
      </div>
    </div>
  );
}

export default DietPage;