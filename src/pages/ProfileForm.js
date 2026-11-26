import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getCurrentUser, updateUser } from '../services/apiService';
import './ProfileForm.css';
import {dayKey} from '../utils/nutrition';
import {persistWeightMeasurement} from '../utils/weightProgress';
import {useExperience} from '../context/ExperienceContext';
import {useTranslation} from 'react-i18next';

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
  const {settings}=useExperience();
  const {t}=useTranslation();
  const simple=settings.mode==='simple';
  const mutationLock=useRef(false);
  const [user,setUser] = useState(null);
  const [form,setForm] = useState(initial);
  const [extras,setExtras] = useState(extrasInitial);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [weightTarget,setWeightTarget] = useState('');
  useEffect(()=>{
    let active=true;
    getCurrentUser().then(({data})=>{
      if(!active)return;
      setUser(data);
      setWeightTarget(localStorage.getItem('gabgym:weight-goal:'+data.id)||'');
      setForm({
        name:data.name || '', age:data.age ?? '', weight:data.weight ?? '',
        height:data.height ?? '', gender:data.gender || '', objective:data.objective || 'maintain-weight',
        activityLevel:data.activityLevel || 'light'
      });
      try {
        const saved=JSON.parse(localStorage.getItem('gabgym:body-measures:'+data.id)||'{}');
        if(saved && typeof saved==='object') setExtras({...extrasInitial,...Object.fromEntries(Object.keys(extrasInitial).map(k=>[k,saved[k]??'']))});
      }catch{}
    }).catch(()=>{if(active)setError('profileEditor.loadError');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false};
  },[]);
  const change = (key,value)=>setForm(prev=>({...prev,[key]:value}));
  const changeExtra = (key,value)=>setExtras(prev=>({...prev,[key]:value}));
  const save = async event=>{
    event.preventDefault();
    if(!user || mutationLock.current)return;
    const name=form.name.trim();
    if(name.length<2 || name.length>80 || !validNum(form.age,13,120) ||
      !validNum(form.weight,20,600) || !validNum(form.height,100,250) ||
      (!simple&&(!Object.values(extras).every(x=>validNum(x,10,300)) || !validNum(weightTarget,20,600)))){ 
      setError('profileEditor.invalid');return;
    }
    mutationLock.current=true;setSaving(true);setError('');
    const payload={ name, gender:form.gender || null, objective:form.objective, activityLevel:form.activityLevel };
    if(form.age !== '')payload.age=Number(form.age);
    if(form.weight !== '')payload.weight=Number(form.weight);
    if(form.height !== '')payload.height=Number(form.height);
    try{
      await updateUser(user.id,payload);
      try{
      const converted=Object.fromEntries(Object.entries(extras)
        .filter(([,value])=>value!=='')
        .map(([key,value])=>[key,Number(value)]));
      if(!simple)localStorage.setItem('gabgym:body-measures:'+user.id,JSON.stringify(converted));
      if(form.weight!==''&&Number(form.weight)>0) persistWeightMeasurement(user.id,Number(form.weight),dayKey());
      if(!simple){
        if(weightTarget!=='') localStorage.setItem('gabgym:weight-goal:'+user.id,weightTarget);
        else localStorage.removeItem('gabgym:weight-goal:'+user.id);
      }
      }catch{setError('profileEditor.localError');return;}
      toast.success(t('profileEditor.saved'));
      navigate('/perfil',{replace:true});
    }catch{setError('Não foi possível salvar no servidor. Seus dados ainda não foram alterados.');}
    finally{mutationLock.current=false;setSaving(false);}
  };
  return (
    <main className="gg-profile-editor">
      <div className="gg-profile-editor-wrap">
        <Link to="/perfil" className="gg-profile-editor-back"><FiArrowLeft/> {t('profileEditor.back')}</Link>
        <header className="gg-profile-editor-header">
          <div className="gg-profile-editor-kicker"><FiEdit3/> {t('profileEditor.kicker')}</div>
          <h1>{t('profileEditor.title')}<span>.</span></h1>
          <p>{t('profileEditor.subtitle')}</p>
        </header>
        {loading ? <p role="status">{t('profilePage.loading')}</p> :
        <form className="gg-profile-editor-form" onSubmit={save}>
          {error && <p role="alert" className="gg-profile-editor-error">{t(error)}</p>}
          <section className="gg-profile-editor-section">
            <div><span>{t('profileEditor.personal')}</span><h2>{t('profileEditor.essentials')}</h2></div>
            <label className="gg-profile-editor-field">{t('profileEditor.name')}
              <input required maxLength="80" autoComplete="name" value={form.name} onChange={e=>change('name',e.target.value)} placeholder={t('profileEditor.nameHint')} />
            </label>
            <div className="gg-profile-editor-grid">
              <label className="gg-profile-editor-field">{t('profileEditor.age')}
                <input type="number" min="13" max="120" inputMode="numeric" value={form.age} onChange={e=>change('age',e.target.value)} placeholder={t('profileEditor.years')} />
              </label>
              <label className="gg-profile-editor-field">{t('profileEditor.weight')}
                <input type="number" min="20" max="600" step=".1" inputMode="decimal" value={form.weight} onChange={e=>change('weight',e.target.value)} placeholder="Ex.: 80" />
              </label>
              <label className="gg-profile-editor-field">{t('profileEditor.height')}
                <input type="number" min="100" max="250" step=".1" inputMode="decimal" value={form.height} onChange={e=>change('height',e.target.value)} placeholder="Ex.: 180" />
              </label>
              <label className="gg-profile-editor-field">{t('profileEditor.objective')}
                <select value={form.objective} onChange={e=>change('objective',e.target.value)}>
                  <option value="maintain-weight">{t('profileEditor.maintain')}</option>
                  <option value="lose-fat">{t('profileEditor.lose')}</option>
                  <option value="gain-muscle">{t('profileEditor.gain')}</option>
                </select>
              </label>
            </div>
          </section>
          {!simple&&<><section className="gg-profile-editor-section">
            <div><span>{t('profileEditor.optionalSection')}</span><h2>{t('profilePage.measures')}</h2></div>
            <p>{t('profileEditor.measuresNote')}</p>
            <div className="gg-profile-editor-grid">
              {measurements.map(([key,label,unit])=>
                <label className="gg-profile-editor-field" key={key}>{t('profilePage.'+key,{defaultValue:label})} ({unit.toUpperCase()})
                  <input type="number" min="10" max="300" step=".1" inputMode="decimal"
                    value={extras[key]} onChange={e=>changeExtra(key,e.target.value)} placeholder={t('profileEditor.optional')} />
                </label>)}
            </div>
            <p className="gg-profile-editor-local">{t('profileEditor.localMeasures')}</p>
          </section>
          <section className="gg-profile-editor-section gg-profile-editor-goals">
            <div><span>{t('profileEditor.goalsSection')}</span><h2>{t('profileEditor.goals')}</h2></div>
            <p>{t('profileEditor.goalsNote')}</p>
            <label className="gg-profile-editor-field">{t('profileEditor.weightGoal')}
              <input type="number" min="20" max="600" step=".1" inputMode="decimal" value={weightTarget} onChange={e=>setWeightTarget(e.target.value)} placeholder="Ex.: 90"/>
            </label>
            <p>{t('profileEditor.goalNote')}</p>
            <Link to="/minhas-metas">{t('profileEditor.openGoals')} <FiArrowRight aria-hidden="true"/></Link>
          </section></>}
          <button className="gg-profile-editor-save" type="submit" disabled={saving||!user}>{saving?t('training.saving'):t('profileEditor.save')} <FiArrowRight/></button>
        </form>}
      </div>
    </main>
  );
}
