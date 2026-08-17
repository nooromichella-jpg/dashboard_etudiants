import React, { useState } from 'react';

const getMentionStyle = (note) => {
  const val = Number(note);
  if (val >= 16) return { label: 'Très Bien', bg: '#dcfce7', text: '#15803d' };
  if (val >= 14) return { label: 'Bien', bg: '#dbeafe', text: '#1d4ed8' };
  if (val >= 12) return { label: 'Assez Bien', bg: '#fef9c3', text: '#a16207' };
  if (val >= 10) return { label: 'Passable', bg: '#ffedd5', text: '#c2410c' };
  return { label: 'Ajourné', bg: '#fee2e2', text: '#b91c1c' };
};

export default function PageTouteLaListe({ etudiants = [], onDelete, onUpdate, onRetour }) {
  const [editionId, setEditionId] = useState(null);
  const [formData, setFormData] = useState({ numero: '', nom: '', centre: '', note: '' });
  const [search, setSearch] = useState('');
  const [filterCentre, setFilterCentre] = useState('Tous');
  const [filterNote, setFilterNote] = useState('Tous');

  // Export CSV
  const handleExportCSV = () => {
    if (etudiantsFiltres.length === 0) return alert("Aucune donnée à exporter.");

    const headers = ["Matricule", "Nom", "Centre", "Note", "Mention"];
    const rows = etudiantsFiltres.map((et) => [
      et.numero,
      `"${et.nom.replace(/"/g, '""')}"`,
      et.centre,
      et.note,
      getMentionStyle(et.note).label
    ].join(';'));

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `etudiants_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const startEdit = (et) => {
    setEditionId(et.id);
    setFormData({ numero: et.numero, nom: et.nom, centre: et.centre, note: et.note });
  };

  const handleSave = (id) => {
    if (!formData.numero || !formData.nom || !formData.centre || formData.note === '') return;
    onUpdate(id, { ...formData, note: Number(formData.note) });
    setEditionId(null);
  };

  const centresUniques = ['Tous', ...new Set(etudiants.map((e) => e.centre))];

  const etudiantsFiltres = etudiants.filter((et) => {
    const matchSearch = et.nom.toLowerCase().includes(search.toLowerCase()) || et.numero.toLowerCase().includes(search.toLowerCase());
    const matchCentre = filterCentre === 'Tous' || et.centre === filterCentre;
    
    const val = Number(et.note);
    let matchNote = true;
    if (filterNote === 'Admis') matchNote = val >= 10;
    else if (filterNote === 'Ajourne') matchNote = val < 10;
    else if (filterNote === 'TresBien') matchNote = val >= 16;
    else if (filterNote === 'Bien') matchNote = val >= 14 && val < 16;
    else if (filterNote === 'AssezBien') matchNote = val >= 12 && val < 14;
    else if (filterNote === 'Passable') matchNote = val >= 10 && val < 12;

    return matchSearch && matchCentre && matchNote;
  });

  return (
    <div style={cardStyle}>
      {/* BOUTONS D'ENTÊTE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={onRetour} style={btnRetourStyle}>⬅ Retour</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportCSV} style={btnExportStyle}> Exporter CSV</button>
          <button onClick={() => window.print()} style={btnPrintStyle}> Imprimer</button>
        </div>
      </div>

      {/* BARRE DE FILTRES ET RECHERCHE */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          placeholder="Rechercher..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ ...inputStyle, flex: '2' }} 
        />
        <select value={filterCentre} onChange={(e) => setFilterCentre(e.target.value)} style={{ ...inputStyle, flex: '1' }}>
          {centresUniques.map((c, i) => <option key={i} value={c}>Centre: {c}</option>)}
        </select>
        <select value={filterNote} onChange={(e) => setFilterNote(e.target.value)} style={{ ...inputStyle, flex: '1' }}>
          <option value="Tous">Toutes les notes</option>
          <option value="Admis">Admis (≥ 10)</option>
          <option value="Ajourne">Ajournés (&lt; 10)</option>
          <option value="TresBien">Très Bien (≥ 16)</option>
          <option value="Bien">Bien (14-15.5)</option>
          <option value="AssezBien">Assez Bien (12-13.5)</option>
          <option value="Passable">Passable (10-11.5)</option>
        </select>
      </div>

      {/* TABLEAU AVEC TEXTE FONCÉ VISIBLE */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
              <th style={thStyle}>Matricule</th>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Centre</th>
              <th style={thStyle}>Note</th>
              <th style={thStyle}>Mention</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {etudiantsFiltres.length > 0 ? (
              etudiantsFiltres.map((et) => {
                const mention = getMentionStyle(et.note);
                const isEditing = editionId === et.id;
                return (
                  <tr key={et.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {isEditing ? (
                      <>
                        <td style={tdStyle}><input value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} style={inputSmall} /></td>
                        <td style={tdStyle}><input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} style={inputSmall} /></td>
                        <td style={tdStyle}><input value={formData.centre} onChange={(e) => setFormData({ ...formData, centre: e.target.value })} style={inputSmall} /></td>
                        <td style={tdStyle}><input type="number" step="0.5" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} style={inputSmall} /></td>
                        <td style={tdStyle}>-</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <button onClick={() => handleSave(et.id)} style={{ ...btnSmall, backgroundColor: '#16a34a' }}>Valider</button>
                          <button onClick={() => setEditionId(null)} style={{ ...btnSmall, backgroundColor: '#64748b' }}>Annuler</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ ...tdStyle, fontWeight: '600', color: '#475569' }}>{et.numero}</td>
                        <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{et.nom}</td>
                        <td style={{ ...tdStyle, color: '#334155' }}>{et.centre}</td>
                        <td style={{ ...tdStyle, fontWeight: '700', color: '#0f172a' }}>{et.note} / 20</td>
                        <td style={tdStyle}>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: mention.bg, color: mention.text, fontWeight: 'bold', fontSize: '12px', display: 'inline-block' }}>
                            {mention.label}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <button onClick={() => startEdit(et)} style={{ ...btnSmall, backgroundColor: '#0284c7' }}>Modifier</button>
                          <button onClick={() => window.confirm(`Supprimer ${et.nom} ?`) && onDelete(et.id)} style={{ ...btnSmall, backgroundColor: '#ef4444' }}>Supprimer</button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '25px', textAlign: 'center', color: '#64748b' }}>
                  Aucun étudiant ne correspond aux filtres.
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
const cardStyle = { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const inputStyle = { padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none', fontSize: '13px' };
const inputSmall = { width: '90%', padding: '5px', borderRadius: '4px', border: '1px solid #2563eb', color: '#0f172a', backgroundColor: '#ffffff' };
const btnRetourStyle = { padding: '8px 14px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const btnExportStyle = { padding: '8px 14px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const btnPrintStyle = { padding: '8px 14px', border: 'none', backgroundColor: '#059669', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const btnSmall = { padding: '5px 10px', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '12px', fontWeight: '600' };
const thStyle = { padding: '12px 10px', color: '#475569', fontSize: '13px', fontWeight: '700' };
const tdStyle = { padding: '12px 10px', fontSize: '14px' };