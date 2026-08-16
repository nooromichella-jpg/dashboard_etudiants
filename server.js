const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

// 1. Déclaration de l'application Express
const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// --- AUTHENTIFICATION ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Champs requis.' });

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ success: false, error: 'Erreur serveur.' });
      if (row) return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé.' });

      const hashedPassword = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
        if (err) return res.status(500).json({ success: false, error: "Erreur d'inscription." });
        res.json({ success: true, message: 'Compte créé avec succès.' });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Champs requis.' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur base de données.' });
    if (!user) return res.status(400).json({ success: false, error: 'Compte inexistant.' });

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ success: true, user: { id: user.id, email: user.email } });
    } else {
      res.status(400).json({ success: false, error: 'Mot de passe incorrect.' });
    }
  });
});

// --- GESTION DES ÉTUDIANTS ---
app.get('/api/etudiants', (req, res) => {
  db.all('SELECT * FROM etudiants ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/etudiants', (req, res) => {
  const { numero, nom, centre, note } = req.body;
  db.run('INSERT INTO etudiants (numero, nom, centre, note) VALUES (?, ?, ?, ?)', [numero, nom, centre, note], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

app.put('/api/etudiants/:id', (req, res) => {
  const { id } = req.params;
  const { numero, nom, centre, note } = req.body;
  db.run('UPDATE etudiants SET numero = ?, nom = ?, centre = ?, note = ? WHERE id = ?', [numero, nom, centre, note, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/etudiants/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM etudiants WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- GESTION DES PROFESSEURS ---
app.get('/api/professeurs', (req, res) => {
  db.all('SELECT * FROM professeurs ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/professeurs', (req, res) => {
  const { matricule, nom, matiere, email, statut } = req.body;
  db.run('INSERT INTO professeurs (matricule, nom, matiere, email, statut) VALUES (?, ?, ?, ?, ?)', [matricule, nom, matiere, email, statut], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

app.put('/api/professeurs/:id', (req, res) => {
  const { id } = req.params;
  const { matricule, nom, matiere, email, statut } = req.body;
  db.run('UPDATE professeurs SET matricule = ?, nom = ?, matiere = ?, email = ?, statut = ? WHERE id = ?', [matricule, nom, matiere, email, statut, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/professeurs/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM professeurs WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- GESTION DES SEMESTRES ---
app.get('/api/semestres', (req, res) => {
  db.all('SELECT * FROM semestres ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/semestres', (req, res) => {
  const { code, annee, statut } = req.body;
  db.run('INSERT INTO semestres (code, annee, statut) VALUES (?, ?, ?)', [code, annee, statut], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});


app.delete('/api/semestres/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM semestres WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// 3. Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur prêt sur http://localhost:${PORT}`));