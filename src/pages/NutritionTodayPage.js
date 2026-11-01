import React, { useEffect, useMemo, useRef, useState } from 'react';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDroplet, FiMinus, FiPlus, FiSearch, FiTrash2, FiEdit3, FiSliders, FiImage, FiChevronDown, FiCheckCircle } from 'react-icons/fi';
import { getCurrentUser, getFoods, getDiaryLogs, addDiaryLog, deleteDiaryLog } from '../services/apiService';
import { dayKey, summarizeDay, scaleFood, isValidServingCount, parseReferenceGrams, scaleFoodGrams, calorieProgress, estimateRestingEnergy } from '../utils/nutrition';
import {suggestDailyGoals,goalOrEstimate} from '../utils/nutritionGoals';
import './NutritionTodayPage.css';

const todayLabel = () => new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
const formatGram = amount => Number(amount).toLocaleString('pt-BR', { maximumFractionDigits: 1 });

export default function NutritionTodayPage() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState('1');
  const [quantityMode, setQuantityMode] = useState('servings');
  const [grams, setGrams] = useState('100');
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState({ name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' });
  const [dailyGoal, setDailyGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('');
  const [macroGoals,setMacroGoals]=useState({protein:'',carbs:'',fat:''});
  const [editGoals, setEditGoals] = useState(false);
  const portionPanelRef = useRef(null);
  const foodSectionRef = useRef(null);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [me, catalog] = await Promise.all([getCurrentUser(), getFoods()]);
        if (!mounted) return;
        const person = me.data;
        if (!person?.id) throw new Error('Perfil indisponível');
        const records = await getDiaryLogs(person.id, dayKey());
        if (!mounted) return;
        setUser(person);
        // Preferencias locais temporarias do piloto (por conta, neste dispositivo).
        // Nao se confunde com uma meta clinica nem com metabolismo basal.
        setDailyGoal(localStorage.getItem('gabgym:daily-goal:' + person.id) || '');
        setWaterGoal(localStorage.getItem('gabgym:water-goal:' + person.id) || '');
        setMacroGoals(Object.fromEntries(['protein','carbs','fat'].map(k=>[k,localStorage.getItem('gabgym:macro-goal:'+person.id+':'+k)||''])));
        setFoods(Array.isArray(catalog.data) ? catalog.data : []);
        setLogs(Array.isArray(records.data) ? records.data : []);
      } catch {
        if (mounted) setError('Não foi possível sincronizar seu diário. Confira a conexão e tente novamente.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const totals = useMemo(() => summarizeDay(logs), [logs]);
  const categories = useMemo(() => [...new Set(foods.map(food => food.category?.name).filter(Boolean))].sort(), [foods]);
  const results = useMemo(() => foods.filter(food => {
    const matchesName = food.name?.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'));
    return matchesName && (!category || food.category?.name === category);
  }).slice(0, 18), [foods, category, query]);
  const referenceGrams = selectedFood ? parseReferenceGrams(selectedFood) : null;
  const estimate = selectedFood
    ? quantityMode === 'grams' && referenceGrams
      ? (Number(grams) >= 1 && Number(grams) <= 3000 ? scaleFoodGrams(selectedFood, grams) : null)
      : quantityMode === 'servings' && isValidServingCount(servings) ? scaleFood(selectedFood, servings) : null
    : null;
  const profileEstimate=suggestDailyGoals(user);
  const target=goalOrEstimate(dailyGoal,profileEstimate?.calories,1200,7000);
  const displayTarget=target;
  const displayProgress=target?calorieProgress(totals.calories,target):null;
  const hydrationTarget=goalOrEstimate(waterGoal,profileEstimate?.water,250,10000);
  const hydrationProgress=hydrationTarget?calorieProgress(totals.water,hydrationTarget):null;
  const macroTargets=Object.fromEntries(['protein','carbs','fat'].map(k=>[k,goalOrEstimate(macroGoals[k],profileEstimate?.[k],1,1000)]));
  const restingEnergy = estimateRestingEnergy(user);
  useEffect(() => {
    if (!selectedFood || !portionPanelRef.current || typeof portionPanelRef.current.scrollIntoView !== 'function') return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    portionPanelRef.current.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }, [selectedFood]);

  const chooseFood = food => {
    setSelectedFood(food);
    setQuantityMode('servings');
    setServings('1');
    setGrams(String(parseReferenceGrams(food) || 100));
    setMessage('');
  };
  const saveGoals = () => {
    if (!user) return;
    const caloriesValid = dailyGoal === '' || (Number.isFinite(Number(dailyGoal)) && Number(dailyGoal) >= 1200 && Number(dailyGoal) <= 7000);
    const waterValid = waterGoal === '' || (Number.isFinite(Number(waterGoal)) && Number(waterGoal) >= 250 && Number(waterGoal) <= 10000);
    const macrosValid=Object.values(macroGoals).every(v=>v===''||(Number.isFinite(Number(v))&&Number(v)>=1&&Number(v)<=1000));
    if (!caloriesValid || !waterValid || !macrosValid) { setError('Confira as referências: consumo de 1.200 a 7.000 kcal e água de 250 a 10.000 ml. Não são recomendações individualizadas.'); return; }
    localStorage.setItem('gabgym:daily-goal:' + user.id, dailyGoal);
    localStorage.setItem('gabgym:water-goal:' + user.id, waterGoal);
    for(const k of ['protein','carbs','fat'])localStorage.setItem('gabgym:macro-goal:'+user.id+':'+k,macroGoals[k]);
    setEditGoals(false);
    setError('');
    setMessage('Referências salvas neste dispositivo. Você pode ajustá-las quando quiser.');
  };
  const foodImage = food => {
    const path = food?.imagePath;
    return typeof path === 'string' && /^\/imagens_comidas\/[A-Za-z0-9_.-]+\.(?:png|jpe?g|webp)$/i.test(path)
      ? path : null;
  };
  const water = logs.filter(item => item.type === 'water');
  const foodLogs = logs.filter(item => item.type === 'food');

  const perform = async (action, success, kind='record') => {
    if (!user || busy) return;
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await action();
      try {
        const response = await getDiaryLogs(user.id, dayKey());
        setLogs(Array.isArray(response.data) ? response.data : []);
        const title=kind==='food'?'REFEIÇÃO REGISTRADA':kind==='water'?'HIDRATAÇÃO FEITA':'DIÁRIO ATUALIZADO';
        toast.success(<div className="gg-toast-copy"><strong>{title}</strong><span>{success}</span></div>,{className:'gg-toast gg-toast-success',icon:<FiCheckCircle aria-hidden="true"/>,autoClose:2800});
      } catch {
        setMessage('Registro salvo no servidor. Atualize a página para conferir o total; não precisa registrar novamente.');
      }
      return true;
    } catch {
      setError('Não conseguimos salvar essa alteração. Confira sua conexão antes de tentar novamente.');
      toast.error('Não foi possível salvar. Confira sua conexão.',{className:'gg-toast gg-toast-error',autoClose:4200});
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addFood = async () => {
    if (!selectedFood || !estimate || busy) return;
    const quantity = quantityMode === 'grams' ? Number(grams) : Number(servings);
    const item = {
      type: 'food', userId: user.id,
      name: selectedFood.name + ' (' + quantity.toLocaleString('pt-BR') + ' ' + (
        quantityMode === 'grams' ? 'g' : quantity !== 1 ? 'porções' : 'porção') + ')',
      ...estimate, volume: 0, logDate: dayKey(), timestamp: Date.now(),
    };
    const saved = await perform(() => addDiaryLog(item), 'Um passo a mais no seu dia.', 'food');
    if (saved) { setSelectedFood(null); setServings('1'); setQuantityMode('servings'); }
  };
  const addCustom = async event => {
    event.preventDefault();
    const calories = Number(custom.calories);
    const name = custom.name.trim();
    const mass = custom.grams === '' ? null : Number(custom.grams);
    if (name.length < 2 || name.length > 65 || !Number.isInteger(calories) || calories < 0 || calories > 5000 ||
      (mass !== null && (!Number.isFinite(mass) || mass <= 0 || mass > 3000))) {
      setError('Informe um nome, calorias entre 0 e 5.000 e, se desejar, até 3.000 g.');
      return;
    }
    const macros = {};
    for (const key of ['protein', 'carbs', 'fat']) {
      const value = custom[key] === '' ? 0 : Number(custom[key]);
      if (!Number.isFinite(value) || value < 0 || value > 1000) {
        setError('Confira os macronutrientes informados.');
        return;
      }
      macros[key] = value;
    }
    const entry = { type: 'food', userId: user.id,
      name: name + (mass ? ' (' + mass.toLocaleString('pt-BR') + ' g — manual)' : ' (manual)'),
      calories, ...macros, volume: 0, logDate: dayKey(), timestamp: Date.now() };
    const saved = await perform(() => addDiaryLog(entry), 'Seu alimento entrou no diário.', 'food');
    if (saved) { setCustom({ name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' }); setShowCustom(false); }
  };
  const addWater = milliliters => perform(
    () => addDiaryLog({ userId: user.id, type: 'water', name: 'Água', volume: milliliters,
      calories: 0, protein: 0, carbs: 0, fat: 0, logDate: dayKey(), timestamp: Date.now() }),
    '+' + milliliters + ' ml registrados. Continue se hidratando.', 'water'
  );
  const removeLog = id => perform(() => deleteDiaryLog(id), 'Registro excluído do diário.');

  return (
    <main className="gg-daily">
      <div className="gg-daily-wrap">
        <div className="gg-daily-eyebrow"><span className="gg-daily-dot" /> CONSTÂNCIA / TODOS OS DIAS</div>
        <header className="gg-daily-title">
          <div><h1>ALIMENTAÇÃO<span>.</span></h1><p>Continue de onde parou. O que conta é aparecer todos os dias.</p></div>
          <span className="gg-daily-date">{todayLabel()}</span>
        </header>

        {loading && <div className="gg-daily-state" role="status">Carregando seu diário de hoje…</div>}
        {error && <div className="gg-daily-error" role="alert">{error}</div>}
        {message && <div className="gg-daily-success" role="status">{message}</div>}

        {!loading && user && (
          <>
            <section className="gg-consumption" aria-label="Resumo do dia">
              <header className="gg-consumption-header">
                <div><span>SEU DIA / ALIMENTAÇÃO</span><h2>CALORIAS DE HOJE</h2></div>
                <button type="button" className="gg-consumption-config"
                  onClick={() => setEditGoals(true)} aria-label="DEFINIR META CALÓRICA">
                  <FiEdit3 aria-hidden="true" /> {target ? 'AJUSTAR META' : 'DEFINIR META'}
                </button>
              </header>
              <div className="gg-consumption-total">
                <strong>{totals.calories.toLocaleString('pt-BR')}</strong>
                <span>KCAL CONSUMIDAS <b>/ {displayTarget?displayTarget.toLocaleString('pt-BR'):'—'} KCAL</b></span>
              </div>
              {displayProgress?<><div className="gg-consumption-track" role="progressbar" aria-label="Calorias consumidas"
                  aria-valuenow={Math.min(totals.calories,displayTarget)} aria-valuemin="0" aria-valuemax={displayTarget}>
                  <span className="gg-consumption-fill" style={{width:displayProgress.percent+'%'}}/>
                </div><div className="gg-consumption-scale"><span>0 KCAL</span><span>{displayProgress.percent}% PREENCHIDO</span><strong>{displayTarget.toLocaleString('pt-BR')} KCAL</strong></div></>:
                <p className="gg-consumption-example">Configure seu perfil ou defina sua meta. Nada de 2.300 kcal iguais para todos.</p>}
              {profileEstimate&&!dailyGoal&&<p className="gg-consumption-example">ESTIMATIVA PELO PERFIL · AJUSTÁVEL, NÃO É PRESCRIÇÃO NUTRICIONAL.</p>}
              {target && <p className={'gg-consumption-feedback ' + (displayProgress.stage === 'over' ? 'is-over' : '')} aria-live="polite">
                {displayProgress.stage === 'over'
                  ? 'Acima da sua referência em ' + Math.abs(displayProgress.remaining).toLocaleString('pt-BR') + ' kcal. Continue registrando normalmente.'
                  : displayProgress.stage === 'near'
                  ? 'Perto da referência: ' + displayProgress.remaining.toLocaleString('pt-BR') + ' kcal restantes.'
                  : displayProgress.stage === 'half'
                  ? 'Você já passou da metade da sua referência. Continue registrando.'
                  : 'Um registro de cada vez. ' + displayProgress.remaining.toLocaleString('pt-BR') + ' kcal até sua referência.'}
              </p>}
              <div className="gg-consumption-divider" />
              <div className="gg-consumption-macros" aria-label="Totais nutricionais de hoje">
                <div><span>PROTEÍNAS</span><strong>{formatGram(totals.protein)} <small>g</small></strong></div>
                <div><span>CARBOIDRATOS</span><strong>{formatGram(totals.carbs)} <small>g</small></strong></div>
                <div><span>GORDURAS</span><strong>{formatGram(totals.fat)} <small>g</small></strong></div>
                <div><span>ÁGUA</span><strong>{totals.water.toLocaleString('pt-BR')} <small>ml</small></strong></div>
              </div>
              <div className="gg27-macros" aria-label="Barras nutricionais">
                {[[ 'protein','Proteína','g'],['carbs','Carboidratos','g'],['fat','Gorduras','g']].map(([key,label,unit])=><div className="gg27-macro" key={key}>
                  <div><strong>{label}</strong><small>{formatGram(totals[key])} / {macroTargets[key]?formatGram(macroTargets[key]):'—'} {unit}</small></div>
                  {macroTargets[key]&&<div className="gg27-macro-track" role="progressbar" aria-label={label} aria-valuenow={Math.min(totals[key],macroTargets[key])} aria-valuemin={0} aria-valuemax={macroTargets[key]}><span style={{width:Math.min(100,100*totals[key]/macroTargets[key])+'%'}}/></div>}
                </div>)}
                <div className="gg27-macro"><div><strong>Água</strong><small>{totals.water} / {hydrationTarget||'—'} ml</small></div>{hydrationProgress&&<div className="gg27-macro-track" role="progressbar" aria-label="Água diária" aria-valuenow={Math.min(totals.water,hydrationTarget)} aria-valuemin={0} aria-valuemax={hydrationTarget}><span style={{width:hydrationProgress.percent+'%'}}/></div>}</div>
              </div>
              <footer className="gg-consumption-foot">
                <span>{totals.meals} alimento{totals.meals !== 1 ? 's' : ''} registrado{totals.meals !== 1 ? 's' : ''} hoje</span>
                <span>Treino e cardio separados do consumo</span>
              </footer>
            </section>
            {logs.some(item => item.type === 'food' && item.name?.includes('manual') &&
              Number(item.protein) === 0 && Number(item.carbs) === 0 && Number(item.fat) === 0) &&
              <p className="gg-daily-disclaimer">Atenção: existem alimentos manuais sem macronutrientes informados. Os totais de proteínas, carboidratos e gorduras podem estar incompletos.</p>}

            <section className="gg-daily-goal-settings" aria-labelledby="gg-goals-title">
              <div className="gg-daily-goal-heading">
                <div>
                  <span>REFERÊNCIAS DO DIA</span>
                  <h2 id="gg-goals-title">SEU RITMO, SUA META.</h2>
                  <p>Seu basal estimado: <strong>{restingEnergy ? restingEnergy.toLocaleString('pt-BR') + ' kcal/dia' : 'preencha seu perfil'}</strong>.
                    Basal é gasto em repouso, <strong>não é uma meta alimentar</strong>.</p>
                </div>
                <button type="button" onClick={() => setEditGoals(!editGoals)} aria-expanded={editGoals} aria-controls="gg-daily-goal-editor">
                  <FiEdit3 aria-hidden="true" /> AJUSTAR
                </button>
              </div>
              {editGoals && <div className="gg-daily-goal-editor" id="gg-daily-goal-editor">
                <label>REFERÊNCIA ALIMENTAR (KCAL/DIA)
                  <input type="number" min="1200" max="7000" inputMode="numeric" value={dailyGoal} placeholder="Opcional"
                    onChange={event => setDailyGoal(event.target.value)} />
                </label>
                <label>REFERÊNCIA DE ÁGUA (ML/DIA)
                  <input type="number" min="250" max="10000" step="50" inputMode="numeric" value={waterGoal} placeholder="Opcional"
                    onChange={event => setWaterGoal(event.target.value)} />
                </label>
                {[['protein','PROTEÍNA'],['carbs','CARBOIDRATO'],['fat','GORDURA']].map(([key,label])=><label key={key}>META DE {label} (G/DIA)
                  <input type="number" min="1" max="1000" value={macroGoals[key]} placeholder={profileEstimate?String(profileEstimate[key]):'Opcional'} onChange={e=>setMacroGoals(v=>({...v,[key]:e.target.value}))}/>
                </label>)}
                <p>Estimativas pelo perfil ou referências manuais. Valores não substituem orientação individualizada. Salvas neste dispositivo.</p>
                <button className="gg-daily-cta" type="button" onClick={saveGoals}>SALVAR REFERÊNCIAS <FiArrowRight aria-hidden="true" /></button>
              </div>}
            </section>

            <section className="gg-daily-section" ref={foodSectionRef} aria-labelledby="gg-foods-heading">
              <div className="gg-daily-heading">
                <div><span>01 / DIÁRIO ALIMENTAR</span><h2 id="gg-foods-heading">REGISTRE O QUE COMEU.</h2></div>
                <span className="gg-daily-hint">Sem culpa. Com consciência.</span>
              </div>

              <button type="button" className="gg-catalog-trigger"
                aria-controls="gg-catalog-content" aria-expanded={catalogOpen}
                aria-label={catalogOpen ? 'FECHAR CATÁLOGO DE ALIMENTOS' : 'ABRIR CATÁLOGO DE ALIMENTOS'}
                onClick={() => { setCatalogOpen(open => !open); setSelectedFood(null); }}>
                <span className="gg-catalog-trigger-icon"><FiPlus aria-hidden="true" /></span>
                <span className="gg-catalog-trigger-text">
                  <strong>{catalogOpen ? 'FECHAR CATÁLOGO' : 'ADICIONAR ALIMENTO'}</strong>
                  <small>{catalogOpen ? 'Toque para recolher a lista' : 'Toque para escolher um alimento ou registrar manualmente'}</small>
                </span>
                <FiChevronDown className={catalogOpen ? 'is-open' : ''} aria-hidden="true" />
              </button>
              {catalogOpen && <div id="gg-catalog-content" className="gg-catalog-content">
              <label className="gg-daily-search">
                <FiSearch aria-hidden="true" />
                <span className="sr-only">Buscar alimento</span>
                <input type="search" value={query} onChange={event => setQuery(event.target.value)}
                  placeholder="Buscar arroz, ovo, frango..." aria-label="Buscar alimento" />
              </label>
              <div className="gg-daily-categories" aria-label="Filtrar por categoria">
                <button type="button" className={!category ? 'active' : ''} onClick={() => setCategory('')}>TODOS</button>
                {categories.map(name => <button type="button" key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}
              </div>

              <div className="gg-daily-food-list">
                {results.map(food => (
                  <button key={food.id} type="button" className={'gg-daily-food' + (selectedFood?.id === food.id ? ' selected' : '')}
                    onClick={() => chooseFood(food)} aria-pressed={selectedFood?.id === food.id}>
                    {foodImage(food) && !brokenImages[food.id]
                      ? <img className="gg-daily-food-photo" src={foodImage(food)} alt="" loading="lazy" onError={() => setBrokenImages(prev => ({ ...prev, [food.id]: true }))} />
                      : <span className="gg-daily-food-icon" aria-hidden="true"><FiImage /></span>}
                    <span className="gg-daily-food-name"><strong>{food.name}</strong><small>{food.servingDesc || food.unit || 'Porção do catálogo'} · {Math.round(food.calories)} kcal</small></span>
                    <FiArrowRight aria-hidden="true" />
                  </button>
                ))}
                {results.length === 0 && <p className="gg-daily-empty">Nenhum alimento encontrado. Tente outra busca.</p>}
              </div>

              {selectedFood && <div className="gg-daily-portion" ref={portionPanelRef} aria-live="polite">
                <div className="gg-daily-portion-top">
                  <div><span>PORÇÃO SELECIONADA</span><h3>{selectedFood.name}</h3><p>Referência: {selectedFood.servingDesc || selectedFood.unit || '1 porção do catálogo'}</p></div>
                  <button className="gg-daily-close" type="button" aria-label="Fechar seleção de alimento" onClick={() => setSelectedFood(null)}>×</button>
                </div>
                <div className="gg-daily-unit-modes" role="group" aria-label="Modo de quantidade">
                  <button type="button" className={quantityMode === 'servings' ? 'active' : ''} onClick={() => setQuantityMode('servings')}>PORÇÕES</button>
                  <button type="button" className={quantityMode === 'grams' ? 'active' : ''} disabled={!referenceGrams}
                    onClick={() => setQuantityMode('grams')}><FiSliders aria-hidden="true" /> BALANÇA / GRAMAS</button>
                </div>
                {quantityMode === 'grams' && referenceGrams ? <div className="gg-daily-gram-input">
                  <label>QUANTIDADE EXATA NA BALANÇA (G)
                    <input type="number" inputMode="numeric" min="1" max="3000" step="1" value={grams}
                      aria-label="Peso em gramas" onChange={event => setGrams(event.target.value)} />
                  </label>
                  <p>Base do catálogo: {referenceGrams} g. Calorias aproximadas ajustadas proporcionalmente.</p>
                </div> : <div className="gg-daily-portion-actions">
                  <button type="button" aria-label="Diminuir porções" disabled={Number(servings) <= 0.25}
                    onClick={() => setServings(String(Math.max(0.25, (Number(servings) || 1) - 0.25)))}><FiMinus /></button>
                  <label>PORÇÕES<input aria-label="Quantidade de porções" type="number" min="0.25" max="20" step="0.25"
                    inputMode="decimal" value={servings} onChange={event => setServings(event.target.value)} /></label>
                  <button type="button" aria-label="Aumentar porções" disabled={Number(servings) >= 20}
                    onClick={() => setServings(String(Math.min(20, (Number(servings) || 0) + 0.25)))}><FiPlus /></button>
                </div>}
                {!referenceGrams && <p className="gg-daily-gram-hint">Este alimento não possui referência em gramas confiável no catálogo. Use porções ou registre manualmente.</p>}
                <p className="gg-daily-portion-estimate">{estimate ? estimate.calories + ' kcal · ' + formatGram(estimate.protein) + ' g de proteína' : 'Insira entre 0,25 e 20 porções.'}</p>
                {estimate && target && <p className="gg-daily-prediction">
                  {totals.calories + estimate.calories > target
                    ? 'Com este registro, o consumo ficará ' + (totals.calories + estimate.calories - target) + ' kcal acima da referência diária.'
                    : 'Após registrar, faltarão aproximadamente ' + (target - totals.calories - estimate.calories) + ' kcal para sua referência.'}
                </p>}
                <button type="button" className="gg-daily-cta" onClick={addFood} disabled={!estimate || busy}>
                  {busy ? 'SALVANDO…' : 'REGISTRAR NO DIÁRIO'} <FiPlus />
                </button>
              </div>}
              <button type="button" className="gg-daily-manual-toggle" aria-expanded={showCustom} onClick={() => { setShowCustom(!showCustom); setError(''); }}>
                <FiPlus aria-hidden="true" /> NÃO ACHOU? REGISTRAR ALIMENTO MANUALMENTE
              </button>
              {showCustom && <form className="gg-daily-manual" onSubmit={addCustom}>
                <h3>ADICIONAR SEU ALIMENTO</h3>
                <p>Nome e calorias são informados por você; não inventamos a informação nutricional.</p>
                <label>NOME DO ALIMENTO
                  <input required maxLength="65" value={custom.name} onChange={event => setCustom(prev => ({...prev, name: event.target.value}))} placeholder="Ex.: caviar" />
                </label>
                <div className="gg-daily-manual-fields">
                  <label>QUANTIDADE (G, OPCIONAL)
                    <input type="number" min="1" max="3000" inputMode="numeric" value={custom.grams} onChange={event => setCustom(prev => ({...prev, grams: event.target.value}))} placeholder="150" />
                  </label>
                  <label>CALORIAS (KCAL)
                    <input type="number" required min="0" max="5000" inputMode="numeric" value={custom.calories} onChange={event => setCustom(prev => ({...prev, calories: event.target.value}))} placeholder="400" />
                  </label>
                </div>
                <details className="gg-daily-manual-macros">
                  <summary>MACROS (SE SOUBER)</summary>
                  <div className="gg-daily-manual-fields gg-daily-three-cols">
                    {[['protein','PROTEÍNA (G)'],['carbs','CARBOIDRATOS (G)'],['fat','GORDURA (G)']].map(([key,label]) =>
                      <label key={key}>{label}
                        <input type="number" min="0" max="1000" step="0.1" inputMode="decimal" value={custom[key]} onChange={event => setCustom(prev => ({...prev, [key]: event.target.value}))} placeholder="Não informado" />
                      </label>
                    )}
                  </div>
                </details>
                <button type="submit" className="gg-daily-cta" disabled={busy}>{busy ? 'SALVANDO…' : 'ADICIONAR AO DIÁRIO'} <FiPlus aria-hidden="true" /></button>
              </form>}
              <p className="gg-daily-disclaimer">Referências aproximadas do catálogo. Em modo balança, o cálculo só aparece quando existe equivalência em gramas. Registros manuais não recebem macros inventados.</p>
              </div>}

            </section>

            <section className="gg-daily-section" aria-labelledby="gg-water-heading">
              <div className="gg-daily-heading">
                <div><span>02 / HIDRATAÇÃO</span><h2 id="gg-water-heading">ÁGUA, TODO DIA.</h2></div>
              </div>
              <div className="gg-daily-water">
                <div><FiDroplet /><strong>{totals.water.toLocaleString('pt-BR')} ml</strong><span>registrados hoje</span>
                  {hydrationProgress && <div className="gg-daily-water-meter">
                    <div className="gg-daily-water-meter-track" role="progressbar" aria-label="Água em relação à referência" aria-valuenow={Math.min(totals.water, hydrationTarget)} aria-valuemin="0" aria-valuemax={hydrationTarget}>
                      <div style={{width: hydrationProgress.percent + '%'}} />
                    </div>
                    <small>{totals.water.toLocaleString('pt-BR')} / {hydrationTarget.toLocaleString('pt-BR')} ml · {hydrationProgress.percent}%</small>
                  </div>}
                </div>
                <div className="gg-daily-water-actions">
                  <button type="button" disabled={busy} onClick={() => addWater(250)}>+ 250 ML</button>
                  <button type="button" disabled={busy} onClick={() => addWater(500)}>+ 500 ML</button>
                </div>
              </div>
            </section>

            <section className="gg-daily-section gg-daily-history" aria-labelledby="gg-history-heading">
              <div className="gg-daily-heading">
                <div><span>03 / SEUS REGISTROS</span><h2 id="gg-history-heading">O QUE VOCÊ FEZ HOJE.</h2></div>
              </div>
              {foodLogs.length + water.length === 0 && <p className="gg-daily-empty">Seu diário está vazio. Comece com um alimento ou um copo d’água.</p>}
              {[...logs].filter(item => item.type === 'food' || item.type === 'water').reverse().map(item =>
                <div className="gg-daily-history-item" key={item.id}>
                  <span><strong>{item.name}</strong><small>{item.type === 'water' ? item.volume + ' ml' : item.calories + ' kcal'}</small></span>
                  <button type="button" title="Excluir registro" aria-label={'Excluir ' + item.name} disabled={busy} onClick={() => removeLog(item.id)}><FiTrash2 /></button>
                </div>
              )}
              <div className="gg-daily-next">
                <Link to="/profile-form">Atualizar perfil</Link>
                <Link to="/historico">Ver histórico <FiArrowRight /></Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
