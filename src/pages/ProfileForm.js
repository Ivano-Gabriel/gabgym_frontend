import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getCurrentUser, updateUser } from '../services/apiService';
import './ProfileForm.css';

const initial = { name:'', age:'', weight:'', height:'', gender:'', objective:'maintain-weight', activityLevel:'light' };
const extrasInitial = { waist:'', chest:'', thigh:'', biceps:'' };
const measurements = [
  ['waist','Cintura','cm'],
  ['chest','Peitoral','cm'],
  ['thigh','Coxa','cm'],
  ['biceps','Bíceps','cm']
];
const validNum = (value,min,max) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max);
export default function ProfileForm(){
  const navigate = useNavigate();
  const [user,setUser] = useState(null);
  const [form,setForm] = useState(initial);
  const [extras,setExtras] = useState(extrasInitial);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  useEffect(()=>{
    let active=true;
    getCurrentUser().then(({data})=>{
      if(!active)return;
      setUser(data);
      setForm({
        name:data.name || '', age:data.age ?? '', weight:data.weight ?? '',
        height:data.height ?? '', gender:data.gender || '', objective:data.objective || 'maintain-weight',
        activityLevel:data.activityLevel || 'light'
      });
      try {
        const saved=JSON.parse(localStorage.getItem('gabgym:body-measures:'+data.id)||'{}');
        if(saved && typeof saved==='object') setExtras({...extrasInitial,...Object.fromEntries(Object.keys(extrasInitial).map(k=>[k,saved[k]??'']))});
      }catch{ /* Dados locais legados inválidos não impedem editar o perfil. */ }
    }).catch(()=>{if(active)setError('Não foi possível carregar seus dados. Tente atualizar.');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false};
  },[]);
  const change = (key,value)=>setForm(prev=>({...prev,[key]:value}));
  const changeExtra = (key,value)=>setExtras(prev=>({...prev,[key]:value}));
  const save = async event=>{
    event.preventDefault();
    if(!user || saving)return;
    const name=form.name.trim();
    if(name.length<2 || name.length>80 || !validNum(form.age,13,120) ||
      !validNum(form.weight,20,600) || !validNum(form.height,100,250) ||
      !Object.values(extras).every(x=>validNum(x,10,300))){
      setError('Confira nome e medidas. Campos de medidas podem ficar vazios.');return;
    }
    setSaving(true);setError('');
    const payload={ name, gender:form.gender || null, objective:form.objective, activityLevel:form.activityLevel };
    if(form.age !== '')payload.age=Number(form.age);
    if(form.weight !== '')payload.weight=Number(form.weight);
    if(form.height !== '')payload.height=Number(form.height);
    try{
      await updateUser(user.id,payload);
      const converted=Object.fromEntries(Object.entries(extras)
        .filter(([,value])=>value!=='')
        .map(([key,value])=>[key,Number(value)]));
      localStorage.setItem('gabgym:body-measures:'+user.id,JSON.stringify(converted));
      toast.success('Perfil atualizado.');
      navigate('/',{replace:true});
    }catch{setError('Não foi possível salvar no servidor. Seus dados ainda não foram alterados.');}
    finally{setSaving(false);}
  };
  return (
    <main className="gg-profile-editor">
      <div className="gg-profile-editor-wrap">
        <Link to="/perfil" className="gg-profile-editor-back"><FiArrowLeft/> VOLTAR</Link>
        <header className="gg-profile-editor-header">
          <div className="gg-profile-editor-kicker"><FiEdit3/> SUA JORNADA / PASSO A PASSO</div>
          <h1>SEU PERFIL<span>.</span></h1>
          <p>Comece com o essencial. Atualize suas medidas quando quiser.</p>
        </header>
        {loading ? <p role="status">Carregando perfil…</p> :
        <form className="gg-profile-editor-form" onSubmit={save}>
          {error && <p role="alert" className="gg-profile-editor-error">{error}</p>}
          <section className="gg-profile-editor-section">
            <div><span>01 / DADOS PESSOAIS</span><h2>O ESSENCIAL.</h2></div>
            <label className="gg-profile-editor-field">NOME OU APELIDO
              <input required maxLength="80" autoComplete="name" value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Como podemos te chamar?" />
            </label>
            <div className="gg-profile-editor-grid">
              <label className="gg-profile-editor-field">IDADE
                <input type="number" min="13" max="120" inputMode="numeric" value={form.age} onChange={e=>change('age',e.target.value)} placeholder="Anos" />
              </label>
              <label className="gg-profile-editor-field">PESO (KG)
                <input type="number" min="20" max="600" step=".1" inputMode="decimal" value={form.weight} onChange={e=>change('weight',e.target.value)} placeholder="Ex.: 80" />
              </label>
              <label className="gg-profile-editor-field">ALTURA (CM)
                <input type="number" min="100" max="250" step=".1" inputMode="decimal" value={form.height} onChange={e=>change('height',e.target.value)} placeholder="Ex.: 180" />
              </label>
              <label className="gg-profile-editor-field">OBJETIVO
                <select value={form.objective} onChange={e=>change('objective',e.target.value)}>
                  <option value="maintain-weight">Manter</option>
                  <option value="lose-fat">Reduzir gordura</option>
                  <option value="gain-muscle">Ganhar músculo</option>
                </select>
              </label>
            </div>
          </section>
          <section className="gg-profile-editor-section">
            <div><span>02 / ACOMPANHAMENTO OPCIONAL</span><h2>SUAS MEDIDAS.</h2></div>
            <p>Você decide o que acompanhar. Todos os campos abaixo são opcionais.</p>
            <div className="gg-profile-editor-grid">
              {measurements.map(([key,label,unit])=>
                <label className="gg-profile-editor-field" key={key}>{label.toUpperCase()} ({unit.toUpperCase()})
                  <input type="number" min="10" max="300" step=".1" inputMode="decimal"
                    value={extras[key]} onChange={e=>changeExtra(key,e.target.value)} placeholder="Opcional" />
                </label>)}
            </div>
            <p className="gg-profile-editor-local">Nesta fase, cintura, peitoral, coxa e bíceps ficam salvos apenas neste navegador. Peso, altura e dados básicos são sincronizados na sua conta.</p>
          </section>
          <section className="gg-profile-editor-section gg-profile-editor-goals">
            <div><span>03 / CONSTÂNCIA</span><h2>ESCOLHA SUAS METAS.</h2></div>
            <p>Água, alimentação, cardio e hábitos. Configure suas referências no seu ritmo.</p>
            <Link to="/minhas-metas">IR PARA METAS <FiArrowRight aria-hidden="true"/></Link>
          </section>
          <button className="gg-profile-editor-save" type="submit" disabled={saving}>{saving?'SALVANDO…':'SALVAR PERFIL'} <FiArrowRight/></button>
        </form>}
      </div>
    </main>
  );
}
