# Todo App

## Description
Une application Todo construite avec Vue.js, Express et MongoDB, déployée via Docker. Ce dépôt sert de base pour évaluer les compétences techniques des développeurs candidats. Les candidats sont invités à récupérer ce projet, à le faire fonctionner localement, et à y ajouter de nouvelles fonctionnalités.

## Prérequis
- Docker
- Docker Compose
- Un éditeur de code (ex. VS Code)
- Node.js (si vous travaillez sans Docker)

## Installation et Déploiement

### 1. Cloner le Dépôt
```bash
git clone https://github.com/Jahzzman/todo-app.git
cd todo-app
```

### 2. Démarrer les Services
```bash
docker-compose up --build
```

### 3. Accéder à l'Application
- Frontend : http://localhost:8080
- Backend API : http://localhost:5001/api/todos

## Structure du Projet

### Frontend
- Technologies utilisées : Vue.js, Tailwind CSS
- Port : 8080
- Dossier : `frontend`

### Backend
- Technologies utilisées : Express.js, MongoDB, Mongoose
- Port : 5001
- Dossier : `backend`

### Base de Données
- Technologie : MongoDB
- Port : 27017
- Volume persistant : `mongo-data`

## Fonctionnalités Existantes
- Ajouter une tâche
- Lister les tâches
- Marquer une tâche comme complétée
- Supprimer une tâche
- Réordonnancement des tâches (drag & drop)

## Nouvelles Fonctionnalités à Implémenter

### 1. Gestion des Tags
#### Frontend
- Interface pour ajouter et gérer des tags personnalisés avec des couleurs
- Assignation de plusieurs tags à une tâche
- Affichage visuel des tags dans la liste des tâches
- Système de filtrage des tâches par tag

#### Backend
- Tables pour stocker les tags et leurs associations avec les tâches
- Endpoints API pour la création/modification/suppression des tags
- Gestion des associations tags-tâches
- Optimisation des requêtes de tags

### 2. Filtrage et Recherche
#### Frontend
- Champ de recherche pour filtrer les tâches par titre
- Filtres pour tâches complétées/en cours
- Interface réactive en temps réel

#### Backend
- Endpoints de recherche et filtrage
- Optimisation avec index
- Pagination des résultats

### 3. Gestion des Priorités
#### Frontend
- Interface pour définir les priorités (haute, moyenne, basse)
- Tri des tâches par priorité
- Indicateurs visuels de priorité

#### Backend
- Champ priorité dans le schéma des tâches
- Endpoints de gestion des priorités
- Tri par priorité côté serveur

## API Documentation

### Endpoints Existants

#### GET /api/todos
Retourne toutes les tâches
```json
[
  {
    "_id": "64b91d841aa2d933285b5670",
    "title": "Acheter du lait",
    "completed": false,
    "position": 1
  }
]
```

#### POST /api/todos
Crée une nouvelle tâche
```json
// Request
{
  "title": "Nouvelle tâche"
}

// Response
{
  "_id": "64b91d841aa2d933285b5672",
  "title": "Nouvelle tâche",
  "completed": false,
  "position": 3
}
```

#### PATCH /api/todos/:id
Met à jour une tâche
```json
// Request
{
  "completed": true
}

// Response
{
  "_id": "64b91d841aa2d933285b5672",
  "title": "Nouvelle tâche",
  "completed": true,
  "position": 3
}
```

#### DELETE /api/todos/:id
Supprime une tâche
```json
{
  "message": "Tâche supprimée avec succès"
}
```

### Nouveaux Endpoints à Implémenter

#### Tags
- `GET /api/tags` - Liste tous les tags
- `POST /api/tags` - Crée un nouveau tag
- `PATCH /api/tags/:id` - Modifie un tag
- `DELETE /api/tags/:id` - Supprime un tag
- `POST /api/todos/:id/tags` - Ajoute des tags à une tâche
- `DELETE /api/todos/:id/tags` - Retire des tags d'une tâche

#### Recherche et Filtrage
- `GET /api/todos/search` - Recherche dans les tâches avec pagination
- `GET /api/todos/filter` - Filtre les tâches par statut
- `GET /api/todos/by-tag/:tagId` - Filtre les tâches par tag

#### Priorités
- `PATCH /api/todos/:id/priority` - Met à jour la priorité d'une tâche
- `GET /api/todos/by-priority` - Liste les tâches triées par priorité

## Documentation Requise
- Documentation des nouvelles tables et relations
- Description détaillée des nouveaux endpoints
- Instructions d'installation mises à jour
- Commentaires dans le code

## Critères d'Évaluation
1. **Fonctionnalité**
   - Implémentation correcte des features demandées
   - Performance et optimisation

2. **Qualité du Code**
   - Structure et organisation
   - Bonnes pratiques
   - Lisibilité

3. **Tests et Documentation**
   - Tests unitaires et d'intégration
   - Documentation claire et complète

4. **Créativité**
   - Améliorations innovantes
   - Solutions élégantes

## Contact
Pour toute question ou assistance, vous pouvez utiliser le formulaire de contact dans votre espace de travail.