const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à SQLite :', err.message);
  } else {
    console.log('Connecté avec succès à la base de données SQLite.');
  }
});

db.serialize(() => {
  // Table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Table des étudiants
  db.run(`
    CREATE TABLE IF NOT EXISTS etudiants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE NOT NULL,
      nom TEXT NOT NULL,
      centre TEXT NOT NULL,
      note REAL NOT NULL
    )
  `, () => {
    db.get('SELECT COUNT(*) AS count FROM etudiants', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare('INSERT INTO etudiants (numero, nom, centre, note) VALUES (?, ?, ?, ?)');
        const initialEtudiants = [
          ['ETU001', 'RAKOTO Jean', 'Antananarivo', 14.5],
          ['ETU002', 'RABEMANANJARA Marie', 'Toamasina', 16.0],
          ['ETU003', 'RAJOELINA Paul', 'Antsirabe', 9.5],
          ['ETU004', 'RAMAROSON Sophie', 'Mahajanga', 12.0],
          ['ETU005', 'RANAIVO Eric', 'Fianarantsoa', 15.5],
          ['ETU006', 'RASOLOFONIRINA Luc', 'Toliara', 8.0],
          ['ETU007', 'RAKOTOMALALA Julie', 'Antananarivo', 17.5],
          ['ETU008', 'RANDRIAMAMPIANINA Marc', 'Antsiranana', 11.0],
          ['ETU009', 'RAFANOMEZANTSOA Claire', 'Toamasina', 13.5],
          ['ETU10', 'ANDRIANARIVELO Yves', 'Antsirabe', 10.0]
        ];
        initialEtudiants.forEach((et) => stmt.run(et));
        stmt.finalize();
      }
    });
  });

  // Table des professeurs
  db.run(`
    CREATE TABLE IF NOT EXISTS professeurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricule TEXT UNIQUE NOT NULL,
      nom TEXT NOT NULL,
      matiere TEXT NOT NULL,
      email TEXT NOT NULL,
      statut TEXT NOT NULL
    )
  `, () => {
    db.get('SELECT COUNT(*) AS count FROM professeurs', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare('INSERT INTO professeurs (matricule, nom, matiere, email, statut) VALUES (?, ?, ?, ?, ?)');
        const initialProfs = [
          ['PROF01', 'M. RAKOTOARIJAONA Michel', 'Algorithmique & C', 'rakoto.michel@univ.mg', 'Permanent'],
          ['PROF02', 'Mme RANAIVOSON Hery', 'Développement Web (React/Node)', 'hery.ranaivo@univ.mg', 'Permanent'],
          ['PROF03', 'M. ANDRIAMAMPIANINA Harilala', 'Réseaux & Système', 'harilala.andria@univ.mg', 'Vacataire']
        ];
        initialProfs.forEach((p) => stmt.run(p));
        stmt.finalize();
      }
    });
  });

  // NOUVELLE TABLE : Semestres
  db.run(`
    CREATE TABLE IF NOT EXISTS semestres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      annee TEXT NOT NULL,
      statut TEXT NOT NULL
    )
  `, () => {
    db.get('SELECT COUNT(*) AS count FROM semestres', (err, row) => {
      if (!err && row.count === 0) {
        const stmt = db.prepare('INSERT INTO semestres (code, annee, statut) VALUES (?, ?, ?)');
        const initialSemestres = [
          ['S1', '2025-2026', 'Clôturé'],
          ['S2', '2025-2026', 'En cours'],
          ['S3', '2026-2027', 'À venir']
        ];
        initialSemestres.forEach((s) => stmt.run(s));
        stmt.finalize();
      }
    });
  });
});

module.exports = db;