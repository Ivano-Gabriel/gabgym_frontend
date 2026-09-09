import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WATER_OPTIONS } from '../data/WaterOptions';
import { EXERCISE_LIST } from '../data/ExerciseList';
import { calculateBMR, calculateTDEE, calculateMacros, calculateWaterIntake, calculateSleepDuration } from '../utils/MetabolismCalculator';
import TodaysLogSidebar from '../components/TodaysLogSidebar';
import { getUser, getDiaryLogs, addDiaryLog, deleteDiaryLog } from '../services/apiService';
import { FiPlusCircle, FiActivity, FiDroplet, FiMoon, FiList } from 'react-icons/fi';
import './DiarioAlimentarPage.css';

const calculateLogTotals = (log) => {
  let cals = 0, prot = 0, carb = 0, fat = 0;
  log.forEach(item => {
    if (item.calories) cals += item.calories;
    if (item.type === 'food' && item.calories > 0) {
      if(item.protein) prot += item.protein;
      if(item.carbs) carb += item.carbs;
      if(item.fat) fat += item.fat;
    }
  });
  return { calories: Math.round(cals), protein: Math.round(prot), carbs: Math.round(carb), fat: Math.round(fat) };
};

const calculateBurnedCalories = (log) => {
  let burned = 0;
  log.forEach(item => {
    if (item.type === 'exercise' && item.calories < 0) {
      burned += Math.abs(item.calories);
    }
  });
  return burned;
};

const calculateWaterTotal = (log) => {
  let water = 0;
  log.forEach(item => {
    if (item.type === 'water' && item.volume > 0) {
      water += item.volume;
    }
  });
  return water;
};

function DiarioAlimentarPage() {
  const [todaysLog, setTodaysLog] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [userGoals, setUserGoals] = useState(null);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [waterGoal, setWaterGoal] = useState(3000);
  const [manualCalories, setManualCalories] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepDuration, setSleepDuration] = useState(null);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const burnedCaloriesGoal = 600;
  const [todaysWater, setTodaysWater] = useState(0);
  const [activeSection, setActiveSection] = useState('food');

  const getTodayDateString = () => new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const today = getTodayDateString();

    if (userId) {
      // 1. Busca os dados físicos do usuário para montar as metas
      getUser(userId).then(response => {
        const userData = response.data;
        setUserName(userData.name);
        
        if (userData.age && userData.weight && userData.height && userData.gender && userData.objective) {
          const weightNum = parseFloat(userData.weight);
          const ageNum = parseFloat(userData.age);
          const heightNum = parseFloat(userData.height);
          const bmr = calculateBMR(userData.gender, weightNum, heightNum, ageNum);
          const activityLevel = userData.activityLevel || 'sedentary'; 
          const tdee = calculateTDEE(bmr, activityLevel);
          
          setUserGoals(calculateMacros(tdee, userData.objective, weightNum));
          setWaterGoal(calculateWaterIntake(weightNum));
        }
      }).catch(err => console.error("Erro ao buscar usuário:", err));

      // 2. Busca o histórico de refeições do banco Java para o dia de hoje
      getDiaryLogs(userId, today).then(response => {
        const logs = response.data;
        setTodaysLog(logs);
        setTotals(calculateLogTotals(logs));
        setBurnedCalories(calculateBurnedCalories(logs));
        setTodaysWater(calculateWaterTotal(logs));
      }).catch(err => console.error("Erro ao buscar logs do diário:", err));
    }
    
    // O sono ainda fica no localStorage temporariamente até migrarmos para a nova feature
    const savedSleep = JSON.parse(localStorage.getItem('gabgymTodaysSleep') || 'null');
    if(savedSleep && savedSleep.sleep && savedSleep.wake) {
        setSleepTime(savedSleep.sleep);
        setWakeTime(savedSleep.wake);
        setSleepDuration(calculateSleepDuration(savedSleep.sleep, savedSleep.wake));
    }
  }, []);

  // Função centralizada para salvar no banco Java e atualizar a tela
  const saveItemToDatabase = async (itemData, successMessage) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const payload = {
      userId: parseInt(userId, 10),
      type: itemData.type,
      name: itemData.name,
      calories: itemData.calories || 0,
      protein: itemData.protein || 0,
      carbs: itemData.carbs || 0,
      fat: itemData.fat || 0,
      volume: itemData.volume || 0,
      logDate: getTodayDateString(),
      timestamp: Date.now()
    };

    try {
      const response = await addDiaryLog(payload);
      const newLog = [...todaysLog, response.data];
      setTodaysLog(newLog);
      setTotals(calculateLogTotals(newLog));
      setBurnedCalories(calculateBurnedCalories(newLog));
      setTodaysWater(calculateWaterTotal(newLog));
      
      if (successMessage) toast.success(successMessage);
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
      toast.error("Erro ao sincronizar com a nuvem.");
    }
  };
  
  const handleAddFood = (food) => {
    saveItemToDatabase({ ...food, type: 'food' }, `${food.name} adicionado ao seu diário!`);
  };
  
  const handleAddExercise = (exercise) => {
    saveItemToDatabase({ ...exercise, type: 'exercise' }, `${Math.abs(exercise.calories)} kcal gastas com ${exercise.name}!`);
  };

  const handleAddWater = (option) => {
    saveItemToDatabase({ name: `Água (${option.name})`, volume: option.volume, type: 'water' });
    toast.info(`+${option.volume}ml de água adicionados!`);
  };

  const handleRemoveItem = async (identifier) => {
    // Tenta encontrar o item pelo ID do banco de dados ou pelo timestamp do front
    const itemToDelete = todaysLog.find(item => item.id === identifier || item.timestamp === identifier);
    
    if (!itemToDelete || !itemToDelete.id) {
      toast.error("Erro: ID do registro não encontrado.");
      return;
    }

    try {
      await deleteDiaryLog(itemToDelete.id);
      const newLog = todaysLog.filter(item => item.id !== itemToDelete.id);
      setTodaysLog(newLog);
      setTotals(calculateLogTotals(newLog));
      setBurnedCalories(calculateBurnedCalories(newLog));
      setTodaysWater(calculateWaterTotal(newLog));
    } catch (error) {
      console.error("Erro ao deletar do banco:", error);
      toast.error("Falha ao excluir item.");
    }
  };
  
  const handleClearLog = () => {
    // Aqui limparemos apenas a UI. A exclusão em massa no banco pode ser feita no futuro.
    setTodaysLog([]);
    setTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    setBurnedCalories(0);
    setTodaysWater(0);
    setSleepDuration(null);
    setSleepTime('');
    setWakeTime('');
    localStorage.removeItem('gabgymTodaysSleep');
    toast.info('Diário visual limpo! (Itens permanecem no histórico da nuvem)');
  };

  const toggleSection = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
  };
  
  const handleManualCalorieSubmit = (e) => {
    e.preventDefault();
    const calories = parseInt(manualCalories, 10);
    if (isNaN(calories) || calories <= 0) {
      toast.warn('Por favor, insira um número de calorias válido.');
      return;
    }
    handleAddExercise({ id: `manual-${Date.now()}`, name: 'Atividade Manual', calories: -calories });
    setManualCalories('');
  };

  const handleLogSleep = () => {
    const duration = calculateSleepDuration(sleepTime, wakeTime);
    if (duration) {
      setSleepDuration(duration);
      localStorage.setItem('gabgymTodaysSleep', JSON.stringify({ sleep: sleepTime, wake: wakeTime }));
      toast.success(`Sono de ${duration.formatted} registrado!`);
    } else {
      toast.error('Por favor, preencha os dois horários para registrar o sono.');
    }
  };

  const getSleepClass = () => {
    if (!sleepDuration) return '';
    const { totalMinutes } = sleepDuration;
    if (totalMinutes < 360) return 'bad';
    if (totalMinutes > 510) return 'too-much';
    return 'good';
  };

  const renderStatBar = (label, consumed, goal, unit = 'g', icon = null) => {
    const percentage = goal > 0 ? (consumed / goal) * 100 : 0;

    let barClass = 'status-empty';
    if (percentage > 110 && (label === 'Proteínas' || label === 'Carboidratos' || label === 'Gorduras')) {
      barClass = 'status-over';
    } else if (percentage >= 90) {
      barClass = 'status-good';
    } else if (percentage > 0) {
      barClass = 'status-mid';
    }

    const formatMinutesToHours = (minutes) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;
    const goalText = label === 'Sono' ? formatMinutesToHours(goal) : `${goal}${unit}`;
    const consumedText = label === 'Sono' ? (sleepDuration ? sleepDuration.formatted : '0h 00min') : Math.round(consumed);

    return (
      <div className="stat-bar" key={label}>
        <div className="stat-bar-top">
          <span className="stat-bar-label">{icon}{label}</span>
          <span className="stat-bar-value">{consumedText} <small>/ {goalText}</small></span>
        </div>
        <div className="stat-bar-track">
          <div className={`stat-bar-fill ${barClass}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
      </div>
    );
  };

  const caloriePercentage = userGoals && userGoals.calories > 0
    ? Math.min((totals.calories / userGoals.calories) * 100, 100)
    : 0;
  const calorieRingCircumference = 2 * Math.PI * 70;
  const calorieOverGoal = userGoals && totals.calories > userGoals.calories;
  const sleepGoalInMinutes = 8 * 60;
  
  return (
    <div className="diary-page-container">
      <div className="diary-card">

        <div className="diary-top">
          <h1 className="diary-title">Diário de Hoje</h1>
          {userName && <p className="diary-subtitle">Monitorando o dia de <strong>{userName}</strong></p>}
        </div>

        {userGoals ? (
          <>
            {/* Anel grande de calorias — o dado mais importante do dia */}
            <div className="calorie-hero">
              <svg viewBox="0 0 160 160" className="calorie-ring-svg">
                <circle cx="80" cy="80" r="70" className="calorie-ring-track" />
                <circle
                  cx="80" cy="80" r="70"
                  className={`calorie-ring-progress ${calorieOverGoal ? 'over' : ''}`}
                  style={{
                    strokeDasharray: calorieRingCircumference,
                    strokeDashoffset: calorieRingCircumference - (caloriePercentage / 100) * calorieRingCircumference,
                  }}
                />
              </svg>
              <div className="calorie-hero-content">
                <strong>{Math.round(totals.calories)}</strong>
                <span>de {userGoals.calories} kcal</span>
              </div>
            </div>

            {/* Macros principais */}
            <div className="macro-bars">
              {renderStatBar('Proteínas', totals.protein, userGoals.protein)}
              {renderStatBar('Carboidratos', totals.carbs, userGoals.carbs)}
              {renderStatBar('Gorduras', totals.fat, userGoals.fat)}
            </div>

            {/* Métricas secundárias, compactas */}
            <div className="secondary-stats">
              {renderStatBar('Água', todaysWater, waterGoal, 'ml')}
              {renderStatBar('Sono', sleepDuration ? sleepDuration.totalMinutes : 0, sleepGoalInMinutes, 'min')}
              {renderStatBar('Gasto Calórico', burnedCalories, burnedCaloriesGoal, 'kcal')}
            </div>
          </>
        ) : (
          <p className="diary-empty-state">Preencha seu perfil para vermos suas metas aqui!</p>
        )}

        {/* Seletor de seção — só uma aberta por vez, sem scroll infinito de acordeões */}
        <div className="add-section-tabs">
          <button className={`add-tab ${activeSection === 'food' ? 'active' : ''}`} onClick={() => toggleSection('food')}>
            <FiPlusCircle /> Alimentos
          </button>
          <button className={`add-tab ${activeSection === 'exercise' ? 'active' : ''}`} onClick={() => toggleSection('exercise')}>
            <FiActivity /> Exercício
          </button>
          <button className={`add-tab ${activeSection === 'water' ? 'active' : ''}`} onClick={() => toggleSection('water')}>
            <FiDroplet /> Água
          </button>
          <button className={`add-tab ${activeSection === 'sleep' ? 'active' : ''}`} onClick={() => toggleSection('sleep')}>
            <FiMoon /> Sono
          </button>
        </div>

        <div className="add-panel">
          {activeSection === 'food' && (
            <div className="add-panel-content fade-in">
              <p className="panel-hint">Adicione alimentos ao seu diário de hoje.</p>
              <Link to="/biblioteca-alimentos" className="panel-cta">
                Consultar Biblioteca de Alimentos
              </Link>
            </div>
          )}

          {activeSection === 'exercise' && (
            <div className="add-panel-content fade-in">
              <p className="panel-hint">Adicione os exercícios que você fez para abater as calorias.</p>
              <div className="chip-grid">
                {EXERCISE_LIST.map(exercise => (
                  <button key={exercise.id} className="chip-button" onClick={() => handleAddExercise(exercise)}>
                    <span className="chip-name">{exercise.name}</span>
                    <span className="chip-value">{exercise.calories} kcal</span>
                  </button>
                ))}
              </div>
              <form className="manual-form" onSubmit={handleManualCalorieSubmit}>
                <input type="number" className="manual-input" value={manualCalories} onChange={(e) => setManualCalories(e.target.value)} placeholder="Kcal manual" min="1" />
                <button type="submit" className="manual-submit">Adicionar</button>
              </form>
            </div>
          )}

          {activeSection === 'water' && (
            <div className="add-panel-content fade-in">
              <p className="panel-hint">Adicione a água que você consumiu hoje.</p>
              <div className="chip-grid">
                {WATER_OPTIONS.map(option => (
                  <button key={option.name} className="chip-button water" onClick={() => handleAddWater(option)}>
                    <span className="chip-name">{option.name}</span>
                    <span className="chip-value">{option.volume} ml</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'sleep' && (
            <div className="add-panel-content fade-in">
              <p className="panel-hint">Registre suas horas de sono para uma melhor recuperação.</p>
              <div className="sleep-inputs-row">
                <div className="sleep-input-group">
                  <label htmlFor="sleepTime">Dormi às</label>
                  <input type="time" id="sleepTime" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
                </div>
                <div className="sleep-input-group">
                  <label htmlFor="wakeTime">Acordei às</label>
                  <input type="time" id="wakeTime" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
                </div>
              </div>
              <button onClick={handleLogSleep} className="panel-cta">Registrar Sono</button>
              {sleepDuration && (
                <div className={`sleep-result ${getSleepClass()}`}>
                  Duração do sono: {sleepDuration.formatted}
                </div>
              )}
            </div>
          )}
        </div>

        <button className="log-fab" onClick={() => setIsSidebarOpen(true)}>
          <FiList /> Ver Resumo de Hoje ({todaysLog.length})
        </button>

        {isSidebarOpen && (
          <TodaysLogSidebar
            log={todaysLog}
            onClose={() => setIsSidebarOpen(false)}
            onClear={handleClearLog}
            onRemove={handleRemoveItem}
          />
        )}

        <Link to="/dietas" className="diary-back-link">← Voltar para Metas</Link>

      </div>
    </div>
  );
}

export default DiarioAlimentarPage;