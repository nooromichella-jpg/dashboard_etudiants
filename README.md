# Système de Gestion des Étudiants (DTS)

Application web de gestion administrative dédiée au suivi, à la notation et à l'analyse des résultats des étudiants.

## 1. Modèle de Données (Entité Étudiante)

* **ETUDIANT**
  * `id` (PK - Entier)
  * `numero` (Chaîne)
  * `nom` (Chaîne)
  * `centre` (Chaîne)
  * `note` (Flottante)
  * `mention` (Chaîne)

## 2. Relation des API

* **Frontend (Dashboard)** -> Appelle les routes suivantes :
  * `GET /api/etudiants/` : Récupérer la liste des étudiants
  * `POST /api/etudiants/` : Ajouter un nouvel étudiant
  * `PUT /api/etudiants/:id/` : Modifier un profil d'étudiant
  * `DELETE /api/etudiants/:id/` : Supprimer un étudiant

## 3. Fonctionnalités Principales

* **Gestion des dossiers** : Ajout, modification et suppression des étudiants (CRUD).
* **Suivi des résultats** : Enregistrement des notes et calcul automatique des mentions.
* **Recherche et Filtrage** : Recherche par nom, matricule ou centre d'examen.
* **Tableau de bord** : Visualisation des statistiques de réussite et répartition des mentions.
