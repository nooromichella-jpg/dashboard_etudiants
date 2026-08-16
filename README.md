# Système de Gestion d'Établissement

Application web de gestion administrative développée pour le suivi des étudiants.


## 1. Modèle de Données (Graphe de Données)
```mermaid
erDiagram
    USER ||--o{ ETUDIANT : "gère"
    USER ||--o{ PROFESSEUR : "gère"
    USER ||--o{ SEMESTRE : "gère"

    USER {
        int id PK
        string nom
        string email
        string password
    }

    ETUDIANT {
        int id PK
        string numero
        string nom
        string centre
        float note
        int id_user FK
    }

2 - Relations des API 
graph LR
    subgraph Client_Frontend
        App[Dashboard Étudiant]
    

    subgraph Server_API
        GET[/GET /api/etudiants/]
        POST[/POST /api/etudiants/]
        PUT[/PUT /api/etudiants/:id/]
        DELETE[/DELETE /api/etudiants/:id/]


    App -->|Récupérer la liste| GET
    App -->|Ajouter un étudiant| POST
    App -->|Modifier un profil| PUT
    App -->|Supprimer un étudiant| DELETE



3 -  Fonctionnalités du Dashboard Étudiant
KPIs : Suivi du total des étudiants, moyenne générale et taux de réussite.

CRUD complet : Ajout, modification et suppression des dossiers étudiants.

Filtres avancés : Recherche par nom/matricule, centre d'examen et tranches de notes.

Visualisation : Graphique de répartition des mentions (Très Bien, Bien, Assez Bien, Passable, Ajourné)."# dashboard_etudiants"  
