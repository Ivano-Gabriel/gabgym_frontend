// src/pages/ProfileForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/MetabolismCalculator';
import './ProfileForm.css';

function ProfileForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '', // Em CM
    gender: 'male',
    objective: 'maintain-weight',
  });
  const [calculatedGoals, setCalculatedGoals] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('gabgymUserData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, age, weight, height, gender, objective } = formData;
    if (!name || !age || !weight || !height || !gender || !objective) {
      toast.error(t('profile_form.erro_campos'));
      return;
    }

    const bmr = calculateBMR(gender, parseFloat(weight), parseFloat(height), parseFloat(age));
    const tdee = calculateTDEE(bmr);
    const goals = calculateMacros(tdee, objective);
    setCalculatedGoals(goals);
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    localStorage.setItem('gabgymUserData', JSON.stringify(formData));
    toast.success(t('profile_form.sucesso_salvo'));
    setIsModalOpen(false);
    navigate('/perfil');
  };

  return (
    <div className="profile-form-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>{t('profile_form.titulo')}</h2>
        <p>{t('profile_form.descricao')}</p>

        <div className="form-group">
          <label htmlFor="name">{t('profile_form.nome_label')}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">{t('profile_form.idade_label')}</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="weight">{t('profile_form.peso_label')}</label>
            <input type="number" step="0.1" id="weight" name="weight" value={formData.weight} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="height">{t('profile_form.altura_label')}</label>
            <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} placeholder="Ex: 180" required />
          </div>
        </div>

        <div className="form-group">
          <label>{t('profile_form.genero_label')}</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> {t('profile_form.genero_masculino')}</label>
            <label><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> {t('profile_form.genero_feminino')}</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="objective">{t('profile_form.objetivo_label')}</label>
          <select id="objective" name="objective" value={formData.objective} onChange={handleChange}>
            <option value="lose-fat">{t('profile_form.objetivo_perder')}</option>
            <option value="maintain-weight">{t('profile_form.objetivo_manter')}</option>
            <option value="gain-muscle">{t('profile_form.objetivo_ganhar')}</option>
          </select>
        </div>

        <button type="submit" className="save-button">{t('profile_form.botao_salvar')}</button>
      </form>

      {isModalOpen && calculatedGoals && (
        <ConfirmationModal
          title={t('profile_form.modal_titulo')}
          message={t('profile_form.modal_texto')}
          onConfirm={handleConfirmSave}
          onCancel={() => setIsModalOpen(false)}
        >
          <div className="goals-recap">
            <h4>{t('profile_form.modal_subtitulo')}</h4>
            <ul>
              <li>{t('profile_form.modal_calorias')}: <strong>{calculatedGoals.calories} kcal</strong></li>
              <li>{t('profile_form.modal_proteinas')}: <strong>{calculatedGoals.protein}g</strong></li>
              <li>{t('profile_form.modal_carboidratos')}: <strong>{calculatedGoals.carbs}g</strong></li>
              <li>{t('profile_form.modal_gorduras')}: <strong>{calculatedGoals.fat}g</strong></li>
            </ul>
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
}

export default ProfileForm;