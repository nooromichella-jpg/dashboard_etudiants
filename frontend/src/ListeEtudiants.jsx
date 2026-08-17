import React, { useState } from 'react';
import GraphiqueMentions from './GraphiqueMentions';

export default function ListeEtudiants({ etudiants = [], onAdd, onVoirTout }) {
  const [formData, setFormData] = useState({ numero: '', nom: '', centre: '', note: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.numero || !formData.nom || !formData.centre || formData.note === '') return;
    onAdd({ ...formData, note: Number(formData.note) });
    setFormData({ numero: '', nom: '', centre: '', note: '' });
  };

  const moyenne = etudiants.length > 0 
    ? (etudiants.reduce((acc, e) => acc + Number(e.note), 0) / etudiants.length).toFixed(2) 
    : 0;

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      
      {/* 📊 CARTES DES STATISTIQUES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Total Étudiants</h3>
          <p style={numberStyle}>{etudiants.length}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Moyenne Générale</h3>
          <p style={numberStyle}>{moyenne} / 20</p>
        </div>
      </div>

      {/* 📝 FORMULAIRE & LE SEUL DIAGRAMME CIRCULAIRE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Formulaire d'ajout */}
        <form onSubmit={handleSubmit} style={cardStyle}>
          <h3 style={titleStyle}>Ajouter un Étudiant</h3>
          <input 
            placeholder="Matricule" 
            value={formData.numero} 
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })} 
            style={inputStyle} 
          />
          <input 
            placeholder="Nom" 
            value={formData.nom} 
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
            style={inputStyle} 
          />
          <input 
            placeholder="Centre" 
            value={formData.centre} 
            onChange={(e) => setFormData({ ...formData, centre: e.target.value })} 
            style={inputStyle} 
          />
          <input 
            type="number" 
            step="0.5" 
            placeholder="Note / 20" 
            value={formData.note} 
            onChange={(e) => setFormData({ ...formData, note: e.target.value })} 
            style={inputStyle} 
          />
          <button type="submit" style={{ ...btnStyle, width: '100%', marginTop: '5px' }}>Ajouter</button>
        </form>

        {/* Unique Diagramme Circulaire */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Répartition des Mentions</h3>
          <GraphiqueMentions etudiants={etudiants} />
        </div>
      </div>

      {/* 📋 TABLEAU DERNIERS ÉTUDIANTS */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={titleStyle}>Derniers Étudiants</h3>
          <button onClick={onVoirTout} style={btnStyle}>Voir tout ➔</button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
              <th style={thStyle}>Matricule</th>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Centre</th>
              <th style={thStyle}>Note</th>
            </tr>
          </thead>
          <tbody>
            {etudiants.length > 0 ? (
              etudiants.slice(0, 5).map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#475569' }}>{e.numero}</td>
                  <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{e.nom}</td>
                  <td style={{ ...tdStyle, color: '#334155' }}>{e.centre}</td>
                  <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{e.note} / 20</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#94a3b8' }}>
                  Aucun étudiant pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// STYLES
const cardStyle = { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const titleStyle = { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 15px 0' };
const numberStyle = { fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#2563eb' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { padding: '9px 15px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const thStyle = { padding: '10px 5px', color: '#64748b', fontSize: '13px', fontWeight: '700' };
const tdStyle = { padding: '10px 5px', fontSize: '14px' };