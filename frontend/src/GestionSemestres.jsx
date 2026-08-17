import React, { useState, useEffect } from 'react';

export default function GestionSemestres() {
  const [semestres, setSemestres] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ code: '', annee: '', statut: 'En cours' });
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/semestres';

  const fetchSemestres = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSemestres(data);
    } catch (err) {
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemestres();
  }, []);

  const handleEdit = (sem) => {
    setEditingId(sem.id);
    setFormData({ code: sem.code, annee: sem.annee, statut: sem.statut });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ code: '', annee: '', statut: 'En cours' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.annee) return;

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) handleCancel();
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) setFormData({ code: '', annee: '', statut: 'En cours' });
      }
      fetchSemestres();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce semestre ?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchSemestres();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>
         Gestion des Semestres & Années
      </h2>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Code (ex: S1, S2)"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', backgroundColor: '#fff' }}
          required
        />
        <input
          type="text"
          placeholder="Année (ex: 2025-2026)"
          value={formData.annee}
          onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', backgroundColor: '#fff' }}
          required
        />
        <select
          value={formData.statut}
          onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', backgroundColor: '#fff' }}
        >
          <option value="En cours">En cours</option>
          <option value="Clôturé">Clôturé</option>
          <option value="À venir">À venir</option>
        </select>

        <button
          type="submit"
          style={{ padding: '8px 16px', backgroundColor: editingId ? '#eab308' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
          {editingId ? 'Mettre à jour' : '+ Ajouter'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            style={{ padding: '8px 16px', backgroundColor: '#94a3b8', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* TABLEAU DES SEMESTRES */}
      {loading ? (
        <p style={{ color: '#0f172a' }}>Chargement...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#1e293b', fontSize: '14px' }}>
              <th style={{ padding: '10px', color: '#1e293b' }}>Code</th>
              <th style={{ padding: '10px', color: '#1e293b' }}>Année Académique</th>
              <th style={{ padding: '10px', color: '#1e293b' }}>Statut</th>
              <th style={{ padding: '10px', textAlign: 'right', color: '#1e293b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {semestres.map((sem) => (
              <tr key={sem.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#0f172a' }}>{sem.code}</td>
                <td style={{ padding: '12px 10px', color: '#0f172a' }}>{sem.annee}</td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: sem.statut === 'En cours' ? '#dbeafe' : sem.statut === 'Clôturé' ? '#f1f5f9' : '#fef08a',
                    color: sem.statut === 'En cours' ? '#1e40af' : sem.statut === 'Clôturé' ? '#475569' : '#854d0e'
                  }}>
                    {sem.statut}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(sem)}
                    style={{ padding: '4px 8px', backgroundColor: '#fef08a', color: '#854d0e', border: 'none', borderRadius: '4px', marginRight: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                     Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(sem.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                     Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}