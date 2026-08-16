# Système de Gestion des Étudiants

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
