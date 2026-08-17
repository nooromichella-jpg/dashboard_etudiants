import React, { useState } from 'react';

export default function AuthModal({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        alert('Compte créé avec succès ! Connectez-vous.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ margin: '0 0 15px 0', color: '#0f172a', textAlign: 'center' }}>
          {isLogin ? 'Connexion' : 'Inscription'}
        </h2>

        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="votre@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={toggleBtnStyle}
          >
            {isLogin ? " S'inscrire" : " Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}

// STYLES
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' };
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const errorStyle = { color: '#ef4444', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' };
const toggleBtnStyle = { background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', paddingLeft: '4px' };