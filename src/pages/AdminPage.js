import React, { useEffect, useState } from 'react';
import { getStudents, getStudent, logoutUser } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

export default function AdminPage() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStudents()
      .then(response => setStudents(response.data))
      .catch(() => setError('Não foi possível carregar os alunos.'))
      .finally(() => setLoading(false));
  }, []);

  const selectStudent = async id => {
    setError('');
    try {
      setSelected((await getStudent(id)).data);
    } catch {
      setError('Não foi possível consultar o perfil.');
    }
  };

  const logout = async () => {
    try { await logoutUser(); } catch { /* Tokens locais são apagados mesmo offline. */ }
    navigate('/login', { replace: true });
  };

  return (
    <section className="gabgym-admin">
      <header className="gabgym-admin-heading">
        <div>
          <small>ACESSO RESTRITO</small>
          <h1>Painel GABGYM</h1>
          <p>Alunos cadastrados e acompanhamento de perfis.</p>
        </div>
        <button onClick={logout}>Sair com segurança</button>
      </header>
      {error && <p role="alert" className="gabgym-admin-error">{error}</p>}
      {loading ? <p>Carregando alunos...</p> : (
        <div className="gabgym-admin-layout">
          <div className="gabgym-admin-list">
            <h2>Alunos ({students.length})</h2>
            {students.length === 0 && <p>Não há alunos cadastrados.</p>}
            {students.map(student => (
              <button type="button" key={student.id} onClick={() => selectStudent(student.id)}
                aria-pressed={selected?.id === student.id}>
                <span>
                  <strong>{student.name || student.username}</strong>
                  <small>@{student.username}</small>
                </span>
                <span>{student.profileComplete ? 'Perfil completo' : 'Perfil incompleto'}</span>
              </button>
            ))}
          </div>
          <aside className="gabgym-admin-details">
            <h2>Perfil do aluno</h2>
            {selected ? (
              <dl>
                <dt>Nome</dt><dd>{selected.name || 'Não informado'}</dd>
                <dt>Usuário</dt><dd>{selected.username}</dd>
                <dt>Idade</dt><dd>{selected.age ?? '—'}</dd>
                <dt>Peso</dt><dd>{selected.weight != null ? `${selected.weight} kg` : '—'}</dd>
                <dt>Altura</dt><dd>{selected.height != null ? `${selected.height} cm` : '—'}</dd>
                <dt>Objetivo</dt><dd>{selected.objective || '—'}</dd>
                <dt>Atividade</dt><dd>{selected.activityLevel || '—'}</dd>
              </dl>
            ) : <p>Selecione um aluno para visualizar o perfil.</p>}
          </aside>
        </div>
      )}
    </section>
  );
}
