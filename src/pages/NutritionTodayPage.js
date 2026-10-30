import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDroplet, FiMinus, FiPlus, FiSearch, FiTrash2, FiEdit3, FiScale, FiImage } from 'react-icons/fi';
import { getCurrentUser, getFoods, getDiaryLogs, addDiaryLog, deleteDiaryLog } from '../services/apiService';
import { dayKey, summarizeDay, scaleFood, isValidServingCount, parseReferenceGrams, scaleFoodGrams, calorieProgress, estimateRestingEnergy } from '../utils/nutrition';
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
  const [category, setCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState('1');
  const [quantityMode, setQuantityMode] = useState('servings');
  const [grams, setGrams] = useState('100');
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState({ name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' });
  const [dailyGoal, setDailyGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('');
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
  const target = Number(dailyGoal) >= 500 && Number(dailyGoal) <= 7000 ? Number(dailyGoal) : null;
  const progress = target ? calorieProgress(totals.calories, target) : null;
  const hydrationTarget = Number(waterGoal) >= 250 && Number(waterGoal) <= 10000 ? Number(waterGoal) : null;
  const hydrationProgress = hydrationTarget ? calorieProgress(totals.water, hydrationTarget) : null;
  const restingEnergy = estimateRestingEnergy(user);
  useEffect(() => {
    if (!selectedFood || !portionPanelRef.current) return;
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
    const caloriesValid = dailyGoal === '' || (Number.isFinite(Number(dailyGoal)) && Number(dailyGoal) >= 500 && Number(dailyGoal) <= 7000);
    const waterValid = waterGoal === '' || (Number.isFinite(Number(waterGoal)) && Number(waterGoal) >= 250 && Number(waterGoal) <= 10000);
    if (!caloriesValid || !waterValid) { setError('Confira as referências diárias informadas.'); return; }
    localStorage.setItem('gabgym:daily-goal:' + user.id, dailyGoal);
    localStorage.setItem('gabgym:water-goal:' + user.id, waterGoal);
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

  const perform = async (action, success) => {
    if (!user || busy) return;
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await action();
      const response = await getDiaryLogs(user.id, dayKey());
      setLogs(Array.isArray(response.data) ? response.data : []);
      setMessage(success);
      return true;
    } catch {
      setError('Não conseguimos salvar essa alteração. Seus dados anteriores foram preservados.');
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
    const saved = await perform(() => addDiaryLog(item), 'Alimento registrado. Um dia de cada vez.');
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
    const saved = await perform(() => addDiaryLog(entry), 'Seu alimento foi registrado.');
    if (saved) { setCustom({ name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' }); setShowCustom(false); }
  };
  const addWater = milliliters => perform(
    () => addDiaryLog({ userId: user.id, type: 'water', name: 'Água', volume: milliliters,
      calories: 0, protein: 0, carbs: 0, fat: 0, logDate: dayKey(), timestamp: Date.now() }),
    '+' + milliliters + ' ml registrados. Continue se hidratando.'
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
            <section className="gg-daily-dashboard" aria-label="Resumo do dia">
              <div className="gg-daily-primary">
                <span>CONSUMO DE HOJE</span>
                <strong>{totals.calories.toLocaleString('pt-BR')} <small>KCAL</small></strong>
                <p>Somente o que você comeu. Gasto no treino fica separado.</p>
                {progress ? <>
                  <div className="gg-daily-progress-head"><span>{progress.percent}% DA REFERÊNCIA</span><span>{totals.calories.toLocaleString('pt-BR')} / {target.toLocaleString('pt-BR')} kcal</span></div>
                  <div className="gg-daily-progress" role="progressbar" aria-label="Consumo em relação à meta alimentar" aria-valuenow={Math.min(totals.calories, target)} aria-valuemin="0" aria-valuemax={target}>
                    <div style={{ width: progress.percent + '%' }} />
                  </div>
                  <p className="gg-daily-guidance" aria-live="polite">
                    {progress.stage === 'over' ? 'Você ultrapassou sua referência em ' + Math.abs(progress.remaining) + ' kcal. Continue registrando normalmente.'
                      : progress.stage === 'near' ? 'Perto da sua referência diária: faltam ' + progress.remaining + ' kcal.'
                      : progress.stage === 'half' ? 'Você chegou à metade da referência. Continue seu dia.'
                      : 'Um registro de cada vez. Faltam ' + progress.remaining + ' kcal para sua referência.'}
                  </p>
                </> : <p className="gg-daily-unset">Defina sua referência alimentar para acompanhar a barra de progresso.</p>}
                <div className="gg-daily-count">{totals.meals} alimento{totals.meals !== 1 ? 's' : ''} registrado{totals.meals !== 1 ? 's' : ''}</div>
              </div>
              <div className="gg-daily-metrics">
                <div><span>PROTEÍNAS</span><strong>{formatGram(totals.protein)} <small>g</small></strong></div>
                <div><span>CARBOIDRATOS</span><strong>{formatGram(totals.carbs)} <small>g</small></strong></div>
                <div><span>GORDURAS</span><strong>{formatGram(totals.fat)} <small>g</small></strong></div>
                <div><span>ÁGUA</span><strong>{totals.water.toLocaleString('pt-BR')} <small>ml</small></strong></div>
              </div>
            </section>

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
                  <input type="number" min="500" max="7000" inputMode="numeric" value={dailyGoal} placeholder="Opcional"
                    onChange={event => setDailyGoal(event.target.value)} />
                </label>
                <label>REFERÊNCIA DE ÁGUA (ML/DIA)
                  <input type="number" min="250" max="10000" step="50" inputMode="numeric" value={waterGoal} placeholder="Opcional"
                    onChange={event => setWaterGoal(event.target.value)} />
                </label>
                <p>Informe metas adequadas às suas necessidades, preferencialmente orientadas por profissional. Salvas apenas neste dispositivo durante o piloto.</p>
                <button className="gg-daily-cta" type="button" onClick={saveGoals}>SALVAR REFERÊNCIAS <FiArrowRight aria-hidden="true" /></button>
              </div>}
            </section>

            <section className="gg-daily-section" ref={foodSectionRef} aria-labelledby="gg-foods-heading">
              <div className="gg-daily-heading">
                <div><span>01 / DIÁRIO ALIMENTAR</span><h2 id="gg-foods-heading">REGISTRE O QUE COMEU.</h2></div>
                <span className="gg-daily-hint">Sem culpa. Com consciência.</span>
              </div>

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
                    onClick={() => setQuantityMode('grams')}><FiScale aria-hidden="true" /> BALANÇA / GRAMAS</button>
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
                </div>
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
