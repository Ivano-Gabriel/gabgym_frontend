import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FOOD_DATABASE } from '../data/FoodLibrary';
import { WATER_OPTIONS } from '../data/WaterOptions';
import { EXERCISE_LIST } from '../data/ExerciseList';
import { calculateBMR, calculateTDEE, calculateMacros, calculateWaterIntake, calculateSleepDuration } from '../utils/MetabolismCalculator';
import TodaysLogSidebar from '../components/TodaysLogSidebar';

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
  return {
    calories: Math.round(cals), protein: Math.round(prot),
    carbs: Math.round(carb), fat: Math.round(fat)
  };
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
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [waterGoal, setWaterGoal] = useState(3000);
  const [manualCalories, setManualCalories] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepDuration, setSleepDuration] = useState(null);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const burnedCaloriesGoal = 600;
  const [todaysWater, setTodaysWater] = useState(0);
  const [openSections, setOpenSections] = useState({ food: true, exercise: false, water: false, sleep: false, });

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/dieta.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  useEffect(() => {
    const storedUserDataString = localStorage.getItem('gabgymUserData');
    if (storedUserDataString) {
      const userData = JSON.parse(storedUserDataString);
      setUserName(userData.name);
      
      if (userData.age && userData.weight && userData.height && userData.gender && userData.objective) {
        const weightNum = parseFloat(userData.weight);
        const ageNum = parseFloat(userData.age);
        const heightNum = parseFloat(userData.height);
        
        const bmr = calculateBMR(userData.gender, weightNum, heightNum, ageNum);
        const tdee = calculateTDEE(bmr);
        const goals = calculateMacros(tdee, userData.objective, weightNum);
        setUserGoals(goals);

        const water = calculateWaterIntake(weightNum);
        setWaterGoal(water);
      }
    }
    
    const savedLog = JSON.parse(localStorage.getItem('gabgymTodaysLog') || '[]');
    setTodaysLog(savedLog);
    setTotals(calculateLogTotals(savedLog));
    setBurnedCalories(calculateBurnedCalories(savedLog));
    setTodaysWater(calculateWaterTotal(savedLog));
    
    const savedSleep = JSON.parse(localStorage.getItem('gabgymTodaysSleep') || 'null');
    if(savedSleep && savedSleep.sleep && savedSleep.wake) {
        setSleepTime(savedSleep.sleep);
        setWakeTime(savedSleep.wake);
        setSleepDuration(calculateSleepDuration(savedSleep.sleep, savedSleep.wake));
    }
  }, []);

  const updateLog = (newItem) => {
    const newLog = [...todaysLog, newItem];
    setTodaysLog(newLog);
    setTotals(calculateLogTotals(newLog));
    setBurnedCalories(calculateBurnedCalories(newLog));
    setTodaysWater(calculateWaterTotal(newLog));
    localStorage.setItem('gabgymTodaysLog', JSON.stringify(newLog));
  };
  
  const handleAddFood = (food) => {
    const newLogEntry = { ...food, timestamp: Date.now(), type: 'food' };
    updateLog(newLogEntry);
    toast.success(`${food.name} adicionado ao seu diário!`);
  };
  
  const handleAddExercise = (exercise) => {
    const newLogEntry = { ...exercise, timestamp: Date.now(), type: 'exercise' };
    updateLog(newLogEntry);
    toast.error(`${Math.abs(exercise.calories)} kcal gastas com ${exercise.name}!`);
  };

  const handleAddWater = (option) => {
    const newLogEntry = { name: `Água (${option.name})`, volume: option.volume, timestamp: Date.now(), type: 'water' };
    updateLog(newLogEntry);
    toast.info(`+${option.volume}ml de água adicionados!`);
  };

  const handleRemoveItem = (timestamp) => {
    const newLog = todaysLog.filter(item => item.timestamp !== timestamp);
    setTodaysLog(newLog);
    setTotals(calculateLogTotals(newLog));
    setBurnedCalories(calculateBurnedCalories(newLog));
    setTodaysWater(calculateWaterTotal(newLog));
    localStorage.setItem('gabgymTodaysLog', JSON.stringify(newLog));
  };
  
  const handleClearLog = () => {
    setTodaysLog([]);
    setTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    setBurnedCalories(0);
    setTodaysWater(0);
    localStorage.setItem('gabgymTodaysLog', '[]');
    setSleepDuration(null);
    setSleepTime('');
    setWakeTime('');
    localStorage.removeItem('gabgymTodaysSleep');
    toast.info('Diário limpo com sucesso!');
  };

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const handleManualCalorieSubmit = (e) => {
    e.preventDefault();
    const calories = parseInt(manualCalories, 10);
    if (isNaN(calories) || calories <= 0) {
      toast.warn('Por favor, insira um número de calorias válido.');
      return;
    }
    const newExercise = { id: `manual-${Date.now()}`, name: 'Atividade Manual', calories: -calories };
    handleAddExercise(newExercise);
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

  const renderGoalSummary = (label, consumed, goal, unit = 'g') => {
    const percentage = goal > 0 ? (consumed / goal) * 100 : 0;
    
    let barClass = '';
    if (percentage > 110 && (label === 'Proteínas' || label === 'Carboidratos' || label === 'Gorduras')) {
        barClass = 'status-over';
    } else if (percentage >= 90) {
        barClass = 'status-good';
    } else if (percentage > 0) {
        barClass = 'status-mid';
    } else {
        barClass = 'status-empty';
    }
    
    const isGeneral = label === 'Calorias';
    const containerClass = isGeneral ? 'general-progress-container' : 'summary-item';
    const barContainerClass = isGeneral ? 'general-progress-bar-container' : 'progress-bar-container';

    const formatMinutesToHours = (minutes) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}min`;
    const goalText = label === 'Sono' ? formatMinutesToHours(goal) : `${goal}${unit}`;
    const consumedText = label === 'Sono' ? (sleepDuration ? sleepDuration.formatted : '0h 00min') : Math.round(consumed);

    return (
      <div className={containerClass}>
        <div className="summary-labels">
          <span>{label}</span>
          <span>{consumedText} / {goalText}</span>
        </div>
        <div className={barContainerClass}>
          <div className={`progress-bar ${barClass}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
      </div>
    );
  };
  
  const filteredFoodDatabase = Object.keys(FOOD_DATABASE).reduce((acc, category) => {
    const filteredFoods = FOOD_DATABASE[category].filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredFoods.length > 0) {
      acc[category] = filteredFoods;
    }
    return acc;
  }, {});

  const sleepGoalInMinutes = 8 * 60;

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Meu Diário</h2>
      
      {userName && userGoals ? (
        <>
          <h3 className="user-context-subtitle">
            Monitorando o dia de <strong>{userName}</strong>
          </h3>
          {renderGoalSummary('Calorias', totals.calories, userGoals.calories, 'kcal')}
          <div className="goal-summary-container">
            {renderGoalSummary('Proteínas', totals.protein, userGoals.protein)}
            {renderGoalSummary('Carboidratos', totals.carbs, userGoals.carbs)}
            {renderGoalSummary('Gorduras', totals.fat, userGoals.fat)}
            {renderGoalSummary('Água', todaysWater, waterGoal, 'ml')}
            {renderGoalSummary('Sono', sleepDuration ? sleepDuration.totalMinutes : 0, sleepGoalInMinutes, 'min')}
            {renderGoalSummary('Gasto Calórico', burnedCalories, burnedCaloriesGoal, 'kcal')}
          </div>
        </>
      ) : (
        <p>Preencha seu perfil para vermos suas metas aqui!</p>
      )}

      <div className="food-library-section">
        <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('food')}>
                <span>Adicionar Alimentos</span>
                <span className='accordion-icon'>{openSections.food ? '−' : '+'}</span>
            </button>
            {openSections.food && (
                <div className="accordion-content">
                    <div className="search-bar-container">
                    <input type="text" placeholder="Pesquisar alimento..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="accordion-container">
                    {Object.keys(filteredFoodDatabase).map(category => (
                        <div key={category} className="accordion-item">
                        <button className="accordion-header" onClick={() => toggleCategory(category)}>
                            <span>{category}</span>
                            <span className='accordion-icon'>{openCategories[category] ? '−' : '+'}</span>
                        </button>
                        {(openCategories[category] || searchTerm.length > 0) && (
                            <div className="accordion-content">
                            <div className="food-list">
                                {filteredFoodDatabase[category].map(food => (
                                <div key={food.id} className="food-item-card">
                                    <img src={food.image} alt={food.name} className="food-item-image" />
                                    <div className="food-item-info">
                                    <h4>{food.name}</h4>
                                    <p>{food.unit} - {food.calories} kcal</p>
                                    <p className="food-serving-desc">{food.serving_desc}</p>
                                    </div>
                                    <button onClick={() => handleAddFood(food)} className="add-food-button">+</button>
                                </div>
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <div className="food-library-section">
        <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('exercise')}>
                <span>Gasto Calórico</span>
                <span className='accordion-icon'>{openSections.exercise ? '−' : '+'}</span>
            </button>
            {openSections.exercise && (
                <div className="accordion-content">
                    <p className="content-description">Adicione os exercícios que você fez para abater as calorias.</p>
                    <div className="exercise-options-grid">
                        {EXERCISE_LIST.map(exercise => (
                            <button key={exercise.id} className="exercise-option-button" onClick={() => handleAddExercise(exercise)}>
                              <span className="exercise-name">{exercise.name}</span>
                              <span className="exercise-calories">{exercise.calories} kcal</span>
                            </button>
                        ))}
                    </div>
                    <form className="manual-calorie-form" onSubmit={handleManualCalorieSubmit}>
                        <input type="number" className="manual-calorie-input" value={manualCalories} onChange={(e) => setManualCalories(e.target.value)} placeholder="Kcal" min="1"/>
                        <button type="submit" className="manual-calorie-button">Adicionar</button>
                    </form>
                </div>
            )}
        </div>
      </div>
      
      <div className="food-library-section">
         <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('water')}>
                <span>Hidratação</span>
                <span className='accordion-icon'>{openSections.water ? '−' : '+'}</span>
            </button>
            {openSections.water && (
                <div className="accordion-content">
                    <p className="content-description">Adicione a água que você consumiu hoje.</p>
                    <div className="water-options-grid">
                        {WATER_OPTIONS.map(option => (
                            <button key={option.name} className="water-option-button" onClick={() => handleAddWater(option)}>
                                <span className="water-name">{option.name}</span>
                                <span className="water-volume">{option.volume} ml</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="food-library-section">
        <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('sleep')}>
                <span>Controle de Sono</span>
                <span className='accordion-icon'>{openSections.sleep ? '−' : '+'}</span>
            </button>
            {openSections.sleep && (
                <div className="accordion-content">
                    <p className="content-description">Registre suas horas de sono para uma melhor recuperação.</p>
                    <div className="sleep-tracker-section">
                        <div className="sleep-inputs">
                            <label htmlFor="sleepTime">Dormi às:</label>
                            <input type="time" id="sleepTime" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
                            <label htmlFor="wakeTime">Acordei às:</label>
                            <input type="time" id="wakeTime" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
                        </div>
                        <button onClick={handleLogSleep} className="log-sleep-button">Registrar Sono</button>
                        {sleepDuration && (
                            <div className={`sleep-duration-display ${getSleepClass()}`}>
                            Duração do Sono: {sleepDuration.formatted}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>

      <button className="log-trigger-button" onClick={() => setIsSidebarOpen(true)}>
        Ver Resumo de Hoje ({todaysLog.length})
      </button>

      {isSidebarOpen && (
        <TodaysLogSidebar 
          log={todaysLog}
          onClose={() => setIsSidebarOpen(false)}
          onClear={handleClearLog}
          onRemove={handleRemoveItem}
        />
      )}
      
      <Link to="/dietas" className="back-button-general" style={{ marginTop: '40px' }}>
        Voltar para Metas
      </Link>
    </div>
  );
}

export default DiarioAlimentarPage;