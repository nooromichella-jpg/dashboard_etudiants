# Système de Gestion des Étudiants (DTS)

Application web de gestion administrative dédiée au suivi, à la notation et à l'analyse des résultats des étudiants.

## 1. Modèle de Données (Entité Étudiant)
```mermaid
erDiagram
    ETUDIANT {
        int id PK
        string numero
        string nom
        string centre
        float note
        string mention
    }
<<<<<<< HEAD
2 - Relation des API 
graph LR
    subgraph Client_Frontend
        App[Dashboard Étudiant]  <!-- CORRIGÉ : Le mot 'end' a été retiré ici -->
    end                         <!-- CORRIGÉ : Fermeture normale du sous-graphe -->

    subgraph Server_API
        GET[/GET /api/etudiants/]
        POST[/POST /api/etudiants/]
        PUT[/PUT /api/etudiants/:id/]
        DELETE[/DELETE /api/etudiants/:id/]
    end

    App -->|Récupérer la liste| GET
    App -->|Ajouter un étudiant| POST
    App -->|Modifier un profil| PUT
    App -->|Supprimer un étudiant| DELETE

3. Fonctionnalités Principales
Gestion des dossiers : Ajout, modification et suppression des étudiants (CRUD).

Suivi des résultats : Enregistrement des notes et calcul automatique des mentions.

Recherche et Filtrage : Recherche par nom, matricule ou centre d'examen.

Tableau de bord : Visualisation des statistiques de réussite et répartition des mentions.
=======
>>>>>>> 2c6b33cd6cfbeca4f9eff63bbb71cc1ca29c7e77
