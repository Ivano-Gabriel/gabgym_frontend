import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiDroplet, FiMinus, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { getCurrentUser, getFoods, getDiaryLogs, addDiaryLog, deleteDiaryLog } from '../services/apiService';
import { dayKey, summarizeDay, scaleFood, isValidServingCount } from '../utils/nutrition';
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
  const estimate = selectedFood && isValidServingCount(servings) ? scaleFood(selectedFood, servings) : null;
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
    } catch {
      setError('Não conseguimos salvar essa alteração. Seus dados anteriores foram preservados.');
    } finally {
      setBusy(false);
    }
  };

  const addFood = async () => {
    if (!selectedFood || !estimate || busy) return;
    const quantity = Number(servings);
    const item = {
      type: 'food', userId: user.id,
      name: selectedFood.name + ' (' + quantity.toLocaleString('pt-BR') + ' porção' + (quantity !== 1 ? 'ões' : '') + ')',
      ...estimate, volume: 0, logDate: dayKey(), timestamp: Date.now(),
    };
    await perform(() => addDiaryLog(item), 'Alimento registrado. Um dia de cada vez.');
    setSelectedFood(null);
    setServings('1');
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
                <p>Registro real do que você consumiu. Sem compensar refeições com exercícios.</p>
                <div className="gg-daily-count">{totals.meals} alimento{totals.meals !== 1 ? 's' : ''} registrado{totals.meals !== 1 ? 's' : ''}</div>
              </div>
              <div className="gg-daily-metrics">
                <div><span>PROTEÍNAS</span><strong>{formatGram(totals.protein)} <small>g</small></strong></div>
                <div><span>CARBOIDRATOS</span><strong>{formatGram(totals.carbs)} <small>g</small></strong></div>
                <div><span>GORDURAS</span><strong>{formatGram(totals.fat)} <small>g</small></strong></div>
                <div><span>ÁGUA</span><strong>{totals.water.toLocaleString('pt-BR')} <small>ml</small></strong></div>
              </div>
            </section>

            <section className="gg-daily-section" aria-labelledby="gg-foods-heading">
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
                    onClick={() => { setSelectedFood(food); setServings('1'); }} aria-pressed={selectedFood?.id === food.id}>
                    <span className="gg-daily-food-icon" aria-hidden="true">+</span>
                    <span className="gg-daily-food-name"><strong>{food.name}</strong><small>{food.servingDesc || food.unit || 'Porção do catálogo'} · {Math.round(food.calories)} kcal</small></span>
                    <FiArrowRight aria-hidden="true" />
                  </button>
                ))}
                {results.length === 0 && <p className="gg-daily-empty">Nenhum alimento encontrado. Tente outra busca.</p>}
              </div>

              {selectedFood && <div className="gg-daily-portion" aria-live="polite">
                <div className="gg-daily-portion-top">
                  <div><span>PORÇÃO SELECIONADA</span><h3>{selectedFood.name}</h3><p>Referência: {selectedFood.servingDesc || selectedFood.unit || '1 porção do catálogo'}</p></div>
                  <button className="gg-daily-close" type="button" aria-label="Fechar seleção de alimento" onClick={() => setSelectedFood(null)}>×</button>
                </div>
                <div className="gg-daily-portion-actions">
                  <button type="button" aria-label="Diminuir porções" disabled={Number(servings) <= 0.25}
                    onClick={() => setServings(String(Math.max(0.25, (Number(servings) || 1) - 0.25)))}><FiMinus /></button>
                  <label>PORÇÕES<input aria-label="Quantidade de porções" type="number" min="0.25" max="20" step="0.25"
                    inputMode="decimal" value={servings} onChange={event => setServings(event.target.value)} /></label>
                  <button type="button" aria-label="Aumentar porções" disabled={Number(servings) >= 20}
                    onClick={() => setServings(String(Math.min(20, (Number(servings) || 0) + 0.25)))}><FiPlus /></button>
                </div>
                <p className="gg-daily-portion-estimate">{estimate ? estimate.calories + ' kcal · ' + formatGram(estimate.protein) + ' g de proteína' : 'Insira entre 0,25 e 20 porções.'}</p>
                <button type="button" className="gg-daily-cta" onClick={addFood} disabled={!estimate || busy}>
                  {busy ? 'SALVANDO…' : 'REGISTRAR NO DIÁRIO'} <FiPlus />
                </button>
              </div>}
              <p className="gg-daily-disclaimer">Valores aproximados do catálogo, por porção indicada. A quantidade selecionada multiplica essa referência; não é automaticamente uma quantidade em gramas.</p>
            </section>

            <section className="gg-daily-section" aria-labelledby="gg-water-heading">
              <div className="gg-daily-heading">
                <div><span>02 / HIDRATAÇÃO</span><h2 id="gg-water-heading">ÁGUA, TODO DIA.</h2></div>
              </div>
              <div className="gg-daily-water">
                <div><FiDroplet /><strong>{totals.water.toLocaleString('pt-BR')} ml</strong><span>registrados hoje</span></div>
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
