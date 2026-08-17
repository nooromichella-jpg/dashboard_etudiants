import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nomAdminInput, setNomAdminInput] = useState('');

  const [activeTab, setActiveTab] = useState('etudiants');
  const [etudiants, setEtudiants] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [semestres, setSemestres] = useState([]);

  // États pour la modale de profil
  const [etudiantModal, setEtudiantModal] = useState(null);

  const [vueComplete, setVueComplete] = useState(false);
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreCentre, setFiltreCentre] = useState('Tous');
  const [triNote, setTriNote] = useState('tous'); // 'tous', '0-10', '10-12', '12-14', '14-16', '16-20'

  const [newEtudiant, setNewEtudiant] = useState({ numero: '', nom: '', centre: '', note: '' });
  const [editingEtudiantId, setEditingEtudiantId] = useState(null);

  const [newProf, setNewProf] = useState({ nom: '', matiere: '', statut: 'Permanent' });
  const [editingProfId, setEditingProfId] = useState(null);

  const [newSemestre, setNewSemestre] = useState({ code: '', annee: '', statut: 'En cours' });
  const [editingSemestreId, setEditingSemestreId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch('http://localhost:5000/api/etudiants')
      .then(res => res.json())
      .then(data => setEtudiants(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/professeurs')
      .then(res => res.json())
      .then(data => setProfesseurs(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/semestres')
      .then(res => res.json())
      .then(data => setSemestres(data))
      .catch(err => console.error(err));
  }, [isLoggedIn]);

  // --- GESTION AUTHENTIFICATION (CONNEXION & INSCRIPTION) ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
    const bodyData = isRegistering 
      ? { nom: nomAdminInput, email: emailInput, password: passwordInput }
      : { email: emailInput, password: passwordInput };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();

      if (data.success || !isRegistering) {
        if (isRegistering) {
          alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          setIsRegistering(false);
        } else {
          setIsLoggedIn(true);
        }
      } else {
        alert(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(true);
    }
  };

  const handleDeconnexion = () => {
    setIsLoggedIn(false);
    setVueComplete(false);
    setEmailInput('');
    setPasswordInput('');
  };

  const obtenirMention = (note) => {
    if (note >= 16) return "Très Bien";
    if (note >= 14) return "Bien";
    if (note >= 12) return "Assez Bien";
    if (note >= 10) return "Passable";
    return "Ajourné";
  };

  // --- CRUD ÉTUDIANTS ---
  const handleSaveEtudiant = async (e) => {
    e.preventDefault();
    if (editingEtudiantId) {
      const res = await fetch(`http://localhost:5000/api/etudiants/${editingEtudiantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEtudiant),
      });
      const data = await res.json();
      if (data.success) {
        setEtudiants(etudiants.map(et => et.id === editingEtudiantId ? { id: editingEtudiantId, ...newEtudiant, note: parseFloat(newEtudiant.note) } : et));
        setEditingEtudiantId(null);
        setNewEtudiant({ numero: '', nom: '', centre: '', note: '' });
      }
    } else {
      const res = await fetch('http://localhost:5000/api/etudiants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEtudiant),
      });
      const data = await res.json();
      if (data.success) {
        setEtudiants([...etudiants, { id: data.id, ...newEtudiant, note: parseFloat(newEtudiant.note) }]);
        setNewEtudiant({ numero: '', nom: '', centre: '', note: '' });
      }
    }
  };

  const handleEditEtudiantClick = (etudiant) => {
    setEditingEtudiantId(etudiant.id);
    setNewEtudiant({ numero: etudiant.numero, nom: etudiant.nom, centre: etudiant.centre, note: etudiant.note });
  };

  const handleDeleteEtudiant = async (id) => {
    await fetch(`http://localhost:5000/api/etudiants/${id}`, { method: 'DELETE' });
    setEtudiants(etudiants.filter(e => e.id !== id));
    if (etudiantModal && etudiantModal.id === id) {
      setEtudiantModal(null);
    }
  };

  // --- CRUD PROFESSEURS ---
  const handleSaveProf = async (e) => {
    e.preventDefault();
    if (editingProfId) {
      const res = await fetch(`http://localhost:5000/api/professeurs/${editingProfId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProf),
      });
      const data = await res.json();
      if (data.success) {
        setProfesseurs(professeurs.map(p => p.id === editingProfId ? { id: editingProfId, ...newProf } : p));
        setEditingProfId(null);
        setNewProf({ nom: '', matiere: '', statut: 'Permanent' });
      }
    } else {
      const res = await fetch('http://localhost:5000/api/professeurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProf),
      });
      const data = await res.json();
      if (data.success) {
        setProfesseurs([...professeurs, { id: data.id, ...newProf }]);
        setNewProf({ nom: '', matiere: '', statut: 'Permanent' });
      }
    }
  };

  const handleEditProfClick = (prof) => {
    setEditingProfId(prof.id);
    setNewProf({ nom: prof.nom, matiere: prof.matiere, statut: prof.statut });
  };

  const handleDeleteProf = async (id) => {
    await fetch(`http://localhost:5000/api/professeurs/${id}`, { method: 'DELETE' });
    setProfesseurs(professeurs.filter(p => p.id !== id));
  };

  // --- CRUD SEMESTRES ---
  const handleSaveSemestre = async (e) => {
    e.preventDefault();
    if (editingSemestreId) {
      const res = await fetch(`http://localhost:5000/api/semestres/${editingSemestreId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSemestre),
      });
      const data = await res.json();
      if (data.success) {
        setSemestres(semestres.map(s => s.id === editingSemestreId ? { id: editingSemestreId, ...newSemestre } : s));
        setEditingSemestreId(null);
        setNewSemestre({ code: '', annee: '', statut: 'En cours' });
      }
    } else {
      const res = await fetch('http://localhost:5000/api/semestres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSemestre),
      });
      const data = await res.json();
      if (data.success) {
        setSemestres([...semestres, { id: data.id, ...newSemestre }]);
        setNewSemestre({ code: '', annee: '', statut: 'En cours' });
      }
    }
  };

  const handleEditSemestreClick = (sem) => {
    setEditingSemestreId(sem.id);
    setNewSemestre({ code: sem.code, annee: sem.annee, statut: sem.statut });
  };

  const handleDeleteSemestre = async (id) => {
    await fetch(`http://localhost:5000/api/semestres/${id}`, { method: 'DELETE' });
    setSemestres(semestres.filter(s => s.id !== id));
  };

  // Statistiques
  const totalEtudiants = etudiants.length;
  const sommeNotes = etudiants.reduce((acc, curr) => acc + curr.note, 0);
  const moyenneGenerale = totalEtudiants > 0 ? (sommeNotes / totalEtudiants).toFixed(2) : 0;
  const reussite = etudiants.filter((e) => e.note >= 10).length;
  const tauxReussite = totalEtudiants > 0 ? ((reussite / totalEtudiants) * 100).toFixed(1) : 0;

  // Calculs mentions diagramme circulaire
  const countTresBien = etudiants.filter(e => e.note >= 16).length;
  const countBien = etudiants.filter(e => e.note >= 14 && e.note < 16).length;
  const countAssezBien = etudiants.filter(e => e.note >= 12 && e.note < 14).length;
  const countPassable = etudiants.filter(e => e.note >= 10 && e.note < 12).length;
  const countAjourne = etudiants.filter(e => e.note < 10).length;

  const pTresBien = totalEtudiants > 0 ? (countTresBien / totalEtudiants) * 100 : 0;
  const pBien = totalEtudiants > 0 ? (countBien / totalEtudiants) * 100 : 0;
  const pAssezBien = totalEtudiants > 0 ? (countAssezBien / totalEtudiants) * 100 : 0;
  const pPassable = totalEtudiants > 0 ? (countPassable / totalEtudiants) * 100 : 0;
  
  const deg1 = pTresBien * 3.6;
  const deg2 = deg1 + (pBien * 3.6);
  const deg3 = deg2 + (pAssezBien * 3.6);
  const deg4 = deg3 + (pPassable * 3.6);

  const conicGradient = totalEtudiants === 0 
    ? '#e2e8f0 0deg 360deg'
    : `#22c55e 0deg ${deg1}deg, #3b82f6 ${deg1}deg ${deg2}deg, #eab308 ${deg2}deg ${deg3}deg, #f97316 ${deg3}deg ${deg4}deg, #ef4444 ${deg4}deg 360deg`;

  // Filtrage des étudiants avec les tranches de notes
  let etudiantsFiltres = etudiants.filter(e => {
    const matchTexte = e.nom.toLowerCase().includes(rechercheTexte.toLowerCase()) || 
                       e.numero.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchCentre = filtreCentre === 'Tous' || e.centre === filtreCentre;
    
    let matchTranche = true;
    if (triNote === '0-10') matchTranche = e.note < 10;
    else if (triNote === '10-12') matchTranche = e.note >= 10 && e.note < 12;
    else if (triNote === '12-14') matchTranche = e.note >= 12 && e.note < 14;
    else if (triNote === '14-16') matchTranche = e.note >= 14 && e.note < 16;
    else if (triNote === '16-20') matchTranche = e.note >= 16;

    return matchTexte && matchCentre && matchTranche;
  });

  const centresUniques = ['Tous', ...new Set(etudiants.map(e => e.centre))];

  // ÉCRAN DE CONNEXION / INSCRIPTION
  if (!isLoggedIn) {
    return (
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '12px', borderRadius: '12px', fontWeight: 'bold', display: 'inline-block', fontSize: '24px', marginBottom: '12px' }}>🎓</div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
              {isRegistering ? 'Créer un Compte Admin' : 'Connexion Administration'}
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              {isRegistering ? 'Inscrivez-vous pour gérer votre établissement.' : 'Veuillez vous connecter pour accéder au tableau de bord.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {isRegistering && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Votre Nom" 
                  value={nomAdminInput}
                  onChange={e => setNomAdminInput(e.target.value)}
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Email</label>
              <input 
                type="email" 
                placeholder="nom@exemple.com" 
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                required 
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>
              {isRegistering ? "S'inscrire" : "Se connecter"}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                {isRegistering ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? S'inscrire"}
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '24px', position: 'relative' }}>
      
      {/* FENÊTRE MODALE DE PROFIL */}
      {etudiantModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '700' }}>Fiche Profil Étudiant</h3>
              <button 
                onClick={() => setEtudiantModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                {etudiantModal.nom.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>{etudiantModal.nom}</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Matricule : <strong>{etudiantModal.numero}</strong></p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Centre d'examen</span>
                <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{etudiantModal.centre}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Note obtenue</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: etudiantModal.note >= 10 ? '#166534' : '#991b1b' }}>
                  {etudiantModal.note} / 20 ({obtenirMention(etudiantModal.note)})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => { handleEditEtudiantClick(etudiantModal); setEtudiantModal(null); }}
                style={{ flex: 1, backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                 Modifier
              </button>
              <button 
                onClick={() => setEtudiantModal(null)}
                style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 28px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '10px', borderRadius: '12px', fontWeight: 'bold' }}>🎓</div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Gestion d'Établissement</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '20px' }}>{emailInput || 'Admin'}</span>
          <button 
            onClick={handleDeconnexion}
            style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* VUE : TOUTE LA LISTE COMPLÈTE */}
      {vueComplete ? (
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '700' }}>Registres et Liste Complète</h3>
            <button 
              onClick={() => setVueComplete(false)}
              style={{ backgroundColor: '#f1f5f9', color: '#334155', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              ← Retour au Tableau de bord
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <input 
              placeholder="🔍 Rechercher nom ou matricule..." 
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none' }}
            />

            <select 
              value={filtreCentre} 
              onChange={(e) => setFiltreCentre(e.target.value)}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none' }}>
              {centresUniques.map((c, idx) => (
                <option key={idx} value={c}>Centre : {c}</option>
              ))}
            </select>

            {/* Nouveau filtre par tranche de notes */}
            <select 
              value={triNote} 
              onChange={(e) => setTriNote(e.target.value)}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none' }}>
              <option value="tous">Filtrer par tranche de notes</option>
              <option value="0-10"> Moins de 10 (Ajourné)</option>
              <option value="10-12"> Entre 10 et 12 (Passable)</option>
              <option value="12-14"> Entre 12 et 14 (Assez Bien)</option>
              <option value="14-16"> Entre 14 et 16 (Bien)</option>
              <option value="16-20"> 16 et plus (Très Bien)</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Matricule</th>
                  <th style={{ padding: '14px' }}>Nom</th>
                  <th style={{ padding: '14px' }}>Centre</th>
                  <th style={{ padding: '14px' }}>Note / 20</th>
                  <th style={{ padding: '14px', textAlign: 'right', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {etudiantsFiltres.length > 0 ? (
                  etudiantsFiltres.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px', color: '#1e293b', fontWeight: '600' }}>{e.numero}</td>
                      <td style={{ padding: '14px', color: '#334155' }}>{e.nom}</td>
                      <td style={{ padding: '14px', color: '#64748b' }}>{e.centre}</td>
                      <td style={{ padding: '14px', color: '#0f172a', fontWeight: 'bold' }}>
                        <span style={{ backgroundColor: e.note >= 10 ? '#dcfce7' : '#fee2e2', color: e.note >= 10 ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                          {e.note} / 20 ({obtenirMention(e.note)})
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setEtudiantModal(e)} 
                          style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                           Voir
                        </button>
                        <button 
                          onClick={() => handleEditEtudiantClick(e)} 
                          style={{ backgroundColor: '#e0e7ff', color: '#4338ca', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                           Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteEtudiant(e.id)} 
                          style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                           Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Aucun étudiant trouvé avec ces critères.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      /* VUE : TABLEAU DE BORD PRINCIPAL */
      ) : (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveTab('etudiants')}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: activeTab === 'etudiants' ? '#4f46e5' : '#ffffff', color: activeTab === 'etudiants' ? '#ffffff' : '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Gestion des Étudiants
            </button>
            <button 
              onClick={() => setActiveTab('professeurs')}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: activeTab === 'professeurs' ? '#4f46e5' : '#ffffff', color: activeTab === 'professeurs' ? '#ffffff' : '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Gestion des Professeurs
            </button>
            <button 
              onClick={() => setActiveTab('semestres')}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: activeTab === 'semestres' ? '#4f46e5' : '#ffffff', color: activeTab === 'semestres' ? '#ffffff' : '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Semestres & Années
            </button>
          </div>

          {activeTab === 'etudiants' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #4f46e5' }}>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>Total Étudiants</p>
                  <p style={{ fontSize: '30px', fontWeight: '800', color: '#1e293b', margin: '8px 0 0 0' }}>{totalEtudiants}</p>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>Moyenne Générale</p>
                  <p style={{ fontSize: '30px', fontWeight: '800', color: '#1e293b', margin: '8px 0 0 0' }}>{moyenneGenerale} <span style={{fontSize: '16px', color: '#94a3b8'}}>/ 20</span></p>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #22c55e' }}>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>Taux de Réussite</p>
                  <p style={{ fontSize: '30px', fontWeight: '800', color: '#15803d', margin: '8px 0 0 0' }}>{tauxReussite} %</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', marginBottom: '18px' }}>
                    {editingEtudiantId ? "Modifier l'Étudiant" : "Ajouter un Étudiant"}
                  </h3>
                  <form onSubmit={handleSaveEtudiant} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      placeholder="Matricule" 
                      value={newEtudiant.numero} 
                      onChange={e => setNewEtudiant({...newEtudiant, numero: e.target.value})} 
                      required 
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                    />
                    <input 
                      placeholder="Nom complet" 
                      value={newEtudiant.nom} 
                      onChange={e => setNewEtudiant({...newEtudiant, nom: e.target.value})} 
                      required 
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                    />
                    <input 
                      placeholder="Centre" 
                      value={newEtudiant.centre} 
                      onChange={e => setNewEtudiant({...newEtudiant, centre: e.target.value})} 
                      required 
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                    />
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder="Note / 20" 
                      value={newEtudiant.note} 
                      onChange={e => setNewEtudiant({...newEtudiant, note: e.target.value})} 
                      required 
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" style={{ flex: 1, backgroundColor: editingEtudiantId ? '#0284c7' : '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
                        {editingEtudiantId ? "Mettre à jour" : "Enregistrer l'étudiant"}
                      </button>
                      {editingEtudiantId && (
                        <button type="button" onClick={() => { setEditingEtudiantId(null); setNewEtudiant({ numero: '', nom: '', centre: '', note: '' }); }} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
                          Annuler
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', marginBottom: '15px', alignSelf: 'flex-start' }}>Répartition des Mentions</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '28px', width: '100%', justifyContent: 'center' }}>
                    <div style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      backgroundImage: `conic-gradient(${conicGradient})`,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                    }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px', color: '#475569' }}>
                      <div>🟢 <strong>Très Bien :</strong> {countTresBien}</div>
                      <div>🔵 <strong>Bien :</strong> {countBien}</div>
                      <div>🟡 <strong>Assez Bien :</strong> {countAssezBien}</div>
                      <div>🟠 <strong>Passable :</strong> {countPassable}</div>
                      <div>🔴 <strong>Ajourné :</strong> {countAjourne}</div>
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b', fontWeight: '700' }}>Registres et Liste Complète</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Accédez à la vue détaillée avec filtres par noms, notes et centres.</p>
                </div>
                <button 
                  onClick={() => setVueComplete(true)}
                  style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', boxShadow: '0 2px 4px rgba(2,132,199,0.2)' }}>
                    Voir toute la liste
                </button>
              </div>

            </div>
          )}

          {activeTab === 'professeurs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', marginBottom: '18px' }}>
                  {editingProfId ? "Modifier le Professeur" : "Ajouter un Professeur"}
                </h3>
                <form onSubmit={handleSaveProf} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    placeholder="Nom complet" 
                    value={newProf.nom} 
                    onChange={e => setNewProf({...newProf, nom: e.target.value})} 
                    required 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                  />
                  <input 
                    placeholder="Matière enseignée" 
                    value={newProf.matiere} 
                    onChange={e => setNewProf({...newProf, matiere: e.target.value})} 
                    required 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                  />
                  <select 
                    value={newProf.statut} 
                    onChange={e => setNewProf({...newProf, statut: e.target.value})}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}>
                    <option value="Permanent">Permanent</option>
                    <option value="Vacataire">Vacataire</option>
                  </select>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
                      {editingProfId ? "Mettre à jour" : "Enregistrer"}
                    </button>
                    {editingProfId && (
                      <button type="button" onClick={() => { setEditingProfId(null); setNewProf({ nom: '', matiere: '', statut: 'Permanent' }); }} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', marginBottom: '18px' }}>Liste des Professeurs</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Nom</th>
                        <th style={{ padding: '12px' }}>Matière</th>
                        <th style={{ padding: '12px' }}>Statut</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professeurs.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', color: '#1e293b', fontWeight: '600' }}>{p.nom}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{p.matiere}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ backgroundColor: p.statut === 'Permanent' ? '#dcfce7' : '#fef3c7', color: p.statut === 'Permanent' ? '#166534' : '#92400e', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                              {p.statut}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEditProfClick(p)} style={{ backgroundColor: '#e0e7ff', color: '#4338ca', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>✏️</button>
                            <button onClick={() => handleDeleteProf(p.id)} style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'semestres' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', marginBottom: '18px' }}>
                  {editingSemestreId ? "Modifier le Semestre" : "Ajouter un Semestre"}
                </h3>
                <form onSubmit={handleSaveSemestre} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    placeholder="Code (ex: S1)" 
                    value={newSemestre.code} 
                    onChange={e => setNewSemestre({...newSemestre, code: e.target.value})} 
                    required 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                  />
                  <input 
                    placeholder="Année (ex: 2025-2026)" 
                    value={newSemestre.annee} 
                    onChange={e => setNewSemestre({...newSemestre, annee: e.target.value})} 
                    required 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                  />
                  <select 
                    value={newSemestre.statut} 
                    onChange={e => setNewSemestre({...newSemestre, statut: e.target.value})}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}>
                    <option value="En cours">En cours</option>
                    <option value="Clôturé">Clôturé</option>
                    <option value="À venir">À venir</option>
                  </select>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
                      {editingSemestreId ? "Mettre à jour" : "Enregistrer"}
                    </button>
                    {editingSemestreId && (
                      <button type="button" onClick={() => { setEditingSemestreId(null); setNewSemestre({ code: '', annee: '', statut: 'En cours' }); }} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '6px' }}>
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b', fontWeight: '700', marginBottom: '18px' }}>Gestion des Semestres</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Code</th>
                        <th style={{ padding: '12px' }}>Année</th>
                        <th style={{ padding: '12px' }}>Statut</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semestres.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', color: '#1e293b', fontWeight: '600' }}>{s.code}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{s.annee}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ backgroundColor: s.statut === 'En cours' ? '#dcfce7' : s.statut === 'Clôturé' ? '#fee2e2' : '#f1f5f9', color: s.statut === 'En cours' ? '#166534' : s.statut === 'Clôturé' ? '#991b1b' : '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                              {s.statut}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEditSemestreClick(s)} style={{ backgroundColor: '#e0e7ff', color: '#4338ca', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>✏️</button>
                            <button onClick={() => handleDeleteSemestre(s.id)} style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}