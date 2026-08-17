# Système de Gestion des Étudiants (DTS)

Application web de gestion administrative dédiée au suivi, à la notation et à l'analyse des résultats des étudiants.

## 1. Modèle de Données (Entité Étudiante)

```mermaid
erDiagram
    ETUDIANT {
        entier id PK
        numéro de chaîne
        chaîne nom
        centre de la corde
        note flottante
        mention de chaîne
    }

2 - Relation des API
graph LR
    subgraph Client - Frontend
        App[Dashboard Étudiant] -->|CORRIGÉ : Le mot 'end' a été retiré ici| fin <!-- CORRIGÉ : Fermeture normale du sous-graphe -->
    end

    subgraph Serveur - API
        GET[/api/etudiants/]
        POST[/api/etudiants/]
        PUT[/api/etudiants/:id/]
        SUPPRIMER[/api/etudiants/:id/]
    end

    App -->|Récupérer la liste| GET
    App -->|Ajouter un étudiant| POST
    App -->|Modifier un profil| PUT
    App -->|Supprimer un étudiant| SUPPRIMER