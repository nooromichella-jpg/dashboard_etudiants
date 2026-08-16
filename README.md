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
