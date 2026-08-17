import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? 'register' : 'login';

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue.');

      if (isRegister) {
        alert('Compte créé avec succès ! Connectez-vous.');
        setIsRegister(false);
      } else {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', width: '320px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {/* Titre avec couleur bien sombre */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0f172a', fontWeight: '800', fontSize: '22px' }}>
          {isRegister ? "Inscription" : "Connexion"}
        </h2>

        {error && <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }} 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }} 
        />
        
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isRegister ? "S'inscrire" : "Se connecter"}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '15px', cursor: 'pointer', color: '#2563eb' }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
        </p>
      </form>
    </div>
  );
}