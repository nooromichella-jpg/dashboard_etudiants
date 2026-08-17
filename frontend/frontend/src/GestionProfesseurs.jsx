import React, { useState, useEffect } from 'react';

export default function GestionProfesseurs() {
  const [professeurs, setProfesseurs] = useState([]);
  const [recherche, setRecherche] = useState('');
  
  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [matiere, setMatiere] = useState('');
  const [email, setEmail] = useState('');
  const [statut, setStatut] = useState('Permanent');

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ matricule: '', nom: '', matiere: '', email: '', statut: 'Permanent' });

  const API_URL = 'http://localhost:5000/api/professeurs';

  const fetchProfesseurs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProfesseurs(data);
    } catch (err) {
      console.error("Erreur de chargement des professeurs :", err);
    }
  };

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!matricule || !nom || !matiere || !email) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule, nom, matiere, email, statut }),
      });
      if (res.ok) {
        fetchProfesseurs();
        setMatricule(''); setNom(''); setMatiere(''); setEmail(''); setStatut('Permanent');
      }
    } catch (err) {
      console.error("Erreur d'ajout :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProfesseurs();
    } catch (err) {
      console.error("Erreur de suppression :", err);
    }
  };

  const handleStartEdit = (p) => {
    setEditId(p.id);
    setEditData({ matricule: p.matricule, nom: p.nom, matiere: p.matiere, email: p.email, statut: p.statut });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        fetchProfesseurs();
        setEditId(null);
      }
    } catch (err) {
      console.error("Erreur de modification :", err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Matricule,Nom,Matiere,Email,Statut\n";
    const rows = professeurs.map(p => `"${p.matricule}","${p.nom}","${p.matiere}","${p.email}","${p.statut}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'liste_professeurs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Impression
  const handlePrint = () => {
    window.print();
  };

  // Filtre de recherche
  const profsFiltres = professeurs.filter(p =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
    p.matiere.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* FORMULAIRE D'AJOUT PROFESSEUR */}
      <div style={cardStyle}>
        <h3 style={cardTitleStyle}>➕ Ajouter un Professeur</h3>
        <form onSubmit={handleAdd} style={formStyle}>
          <input
            type="text"
            placeholder="Matricule (ex: PROF01)"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Matière / Module"
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="Email professionnel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <select value={statut} onChange={(e) => setStatut(e.target.value)} style={inputStyle}>
            <option value="Permanent">Permanent</option>
            <option value="Vacataire">Vacataire</option>
          </select>
          <button type="submit" style={btnSubmitStyle}>Enregistrer</button>
        </form>
      </div>

      {/* RECHERCHE ET EXPORT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, matricule ou matière..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={{ ...inputStyle, width: '320px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} style={btnExportStyle}> Exporter CSV</button>
          <button onClick={handlePrint} style={btnPrintStyle}>Imprimer</button>
        </div>
      </div>

      {/* TABLEAU DES PROFESSEURS */}
      <div style={cardStyle}>
        <h3 style={cardTitleStyle}> Liste des Professeurs ({profsFiltres.length})</h3>

        {profsFiltres.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', margin: '20px 0' }}>
            Aucun professeur trouvé.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={thStyle}>Matricule</th>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Matière</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Statut</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profsFiltres.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {editId === p.id ? (
                    <>
                      <td style={tdStyle}><input type="text" value={editData.matricule} onChange={(e) => setEditData({ ...editData, matricule: e.target.value })} style={smallInputStyle} /></td>
                      <td style={tdStyle}><input type="text" value={editData.nom} onChange={(e) => setEditData({ ...editData, nom: e.target.value })} style={smallInputStyle} /></td>
                      <td style={tdStyle}><input type="text" value={editData.matiere} onChange={(e) => setEditData({ ...editData, matiere: e.target.value })} style={smallInputStyle} /></td>
                      <td style={tdStyle}><input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} style={smallInputStyle} /></td>
                      <td style={tdStyle}>
                        <select value={editData.statut} onChange={(e) => setEditData({ ...editData, statut: e.target.value })} style={smallInputStyle}>
                          <option value="Permanent">Permanent</option>
                          <option value="Vacataire">Vacataire</option>
                        </select>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button onClick={() => handleSaveEdit(p.id)} style={btnSaveStyle}>Valider</button>
                        <button onClick={() => setEditId(null)} style={btnCancelStyle}>Annuler</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{p.matricule}</td>
                      <td style={tdStyle}><strong>{p.nom}</strong></td>
                      <td style={tdStyle}>{p.matiere}</td>
                      <td style={tdStyle}>{p.email}</td>
                      <td style={tdStyle}>
                        <span style={p.statut === 'Permanent' ? badgePermanentStyle : badgeVacataireStyle}>
                          {p.statut}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button onClick={() => handleStartEdit(p)} style={btnEditStyle}>Modifier</button>
                        <button onClick={() => handleDelete(p.id)} style={btnDeleteStyle}>Supprimer</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// STYLES
const cardStyle = { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const cardTitleStyle = { margin: '0 0 15px 0', fontSize: '16px', color: '#0f172a' };
const formStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' };
const smallInputStyle = { width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' };
const btnSubmitStyle = { padding: '10px 15px', backgroundColor: '#059669', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const btnExportStyle = { padding: '10px 14px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const btnPrintStyle = { padding: '10px 14px', backgroundColor: '#475569', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '14px' };
const thStyle = { padding: '10px', textAlign: 'left', color: '#475569', fontWeight: '600' };
const tdStyle = { padding: '10px', color: '#0f172a' };
const btnEditStyle = { padding: '6px 10px', backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px', fontWeight: 'bold' };
const btnDeleteStyle = { padding: '6px 10px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };
const btnSaveStyle = { padding: '6px 10px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px', fontWeight: 'bold' };
const btnCancelStyle = { padding: '6px 10px', backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const badgePermanentStyle = { backgroundColor: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
const badgeVacataireStyle = { backgroundColor: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };