# Système de Gestion d'Établissement (DTS)

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
