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

# Todo App - Correction

## Introduction

Ce projet est une application Todo qui permet aux utilisateurs de gérer leurs tâches et leurs tags. L'application est construite en utilisant Node.js, Express, MongoDB pour le backend, et Vue.js pour le frontend.

## Table des matières

- [Schéma de la base de données](#schéma-de-la-base-de-données)
- [Endpoints API](#endpoints-api)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Commentaires dans le code](#commentaires-dans-le-code)

## Schéma de la base de données

### Collections

#### Todos

| Champ      | Type    | Description                  |
|------------|---------|------------------------------|
| _id        | ObjectId| Identifiant unique pour la tâche |
| title      | String  | Titre de la tâche            |
| completed  | Boolean | Statut de la tâche           |
| tags       | Array   | Tableau d'ObjectIds de tags  |
| createdAt  | Date    | Date de création de la tâche |
| priority   | String  | Priorité de la tâche (haute, moyenne, basse) |

#### Tags

| Champ      | Type    | Description                  |
|------------|---------|------------------------------|
| _id        | ObjectId| Identifiant unique pour le tag |
| name       | String  | Nom du tag                   |
| color      | String  | Couleur du tag               |
| createdAt  | Date    | Date de création du tag      |

### Relations

- Chaque tâche peut avoir plusieurs tags.
- Les tags sont associés aux tâches via un tableau d'ObjectIds de tags dans le champ `tags` de la collection `Todos`.

## Endpoints API

### Todos

- **GET /api/todos**
  - Récupère une liste de toutes les tâches.
  - **Réponse**: Tableau d'objets de tâches.

- **POST /api/todos**
  - Crée une nouvelle tâche.
  - **Corps de la requête**: `{ "title": "Titre de la tâche" }`
  - **Réponse**: L'objet de la tâche créée.

- **PATCH /api/todos/:id**
  - Met à jour une tâche.
  - **Corps de la requête**: `{ "completed": true }`
  - **Réponse**: L'objet de la tâche mise à jour.

- **DELETE /api/todos/:id**
  - Supprime une tâche.
  - **Réponse**: Message de succès.

- **POST /api/todos/:id/tags**
  - Ajoute des tags à une tâche.
  - **Corps de la requête**: `{ "tags": ["tagId1", "tagId2"] }`
  - **Réponse**: L'objet de la tâche mise à jour.

- **DELETE /api/todos/:id/tags**
  - Supprime des tags d'une tâche.
  - **Corps de la requête**: `{ "tags": ["tagId1", "tagId2"] }`
  - **Réponse**: L'objet de la tâche mise à jour.

- **PATCH /api/todos/:id/priority**
  - Met à jour la priorité d'une tâche.
  - **Corps de la requête**: `{ "priority": "haute" }`
  - **Réponse**: L'objet de la tâche mise à jour.

- **GET /api/todos/by-priority**
  - Liste les tâches triées par priorité.
  - **Réponse**: Tableau d'objets de tâches triées par priorité.

- **GET /api/todos/filter?completed=xxx**
  - Liste les tâches triées par statut.
  - **Réponse**: Tableau d'objets de tâches triées par statut.

- **GET /api/todos/filter?title=xxx**
  - Liste les tâches triées par titre.
  - **Réponse**: Tableau d'objets de tâches triées par titre.  

### Tags

- **GET /api/tags**
  - Récupère une liste de tous les tags.
  - **Réponse**: Tableau d'objets de tags.

- **POST /api/tags**
  - Crée un nouveau tag.
  - **Corps de la requête**: `{ "name": "Nom du tag", "color": "#FFFFFF" }`
  - **Réponse**: L'objet du tag créé.

- **PATCH /api/tags/:id**
  - Met à jour un tag.
  - **Corps de la requête**: `{ "name": "Nouveau nom du tag", "color": "#000000" }`
  - **Réponse**: L'objet du tag mis à jour.

- **DELETE /api/tags/:id**
  - Supprime un tag.
  - **Réponse**: Message de succès.

## Installation sans docker

### Backend

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/monthebrice2000/todo-app.git
   cd todo-app/backend
   ```
2. Démarrer le serveur mongodb :
   ```bash
   docker run --name mongodb-container -d -p 27017:27017 -v mongodb-data:/data/db mongo:6.0
   ```
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Créer un fichier `.env` avec le contenu suivant :
   ```env
   MONGO_URI=mongodb://localhost:27017/todo-app
   PORT=5000
   ```
5. Démarrer le serveur backend :
   ```bash
   npm start
   ```

### Frontend

1. Naviguer vers le répertoire frontend :
   ```bash
   cd ../frontend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Démarrer le serveur de développement frontend :
   ```bash
   npm run serve
   ```

## Tests Unitaires

1. Tests des tâches
   ```bash
   cd backend
   npm run test ./test/todos.test.js
   ```
2. Tests des tags
   ```bash
   cd backend
   npm run test ./test/tags.test.js
   ```


## Installation avec docker

### Backend

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/monthebrice2000/todo-app.git
   cd todo-app/backend
   ```
2. Démarrer les services frontend, backend et mongo:
   ```bash
   docker-compose up --build
   ```


## Utilisation

1. Ouvrir votre navigateur et naviguer vers `http://localhost:5000` (si l'installation est sans docker) ou `http://localhost:5001` pour accéder à la liste des APIs.
2. Ouvrir votre navigateur et naviguer vers `http://localhost:8080` pour accéder à l'application Todo.
3. Utiliser le formulaire pour ajouter de nouvelles tâches.
4. En cliquant sur chaque tâche, utiliser l'interface de gestion des tags pour créer et gérer les tags.
5. Assigner des tags aux tâches et filtrer les tâches par tags.
6. Utiliser le champ de recherche et les filtres pour filtrer les tâches soit par statut, soit par tag ou soit par titre
7. Utiliser le select pour choisir la priorité d'une tâche au moment de sa création

## Commentaires dans le code

### Backend

- **server.js**: Contient la configuration principale du serveur et des middlewares. Ce fichier contient aussi les configurations swaggers pour la documentation des apis
- **routes/todos.js**: Contient les routes pour gérer les tâches, y compris l'ajout et la suppression de tags.
- **routes/tags.js**: Contient les routes pour gérer les tags.

### Frontend

- **components/TodoList.vue**: Contient le composant principal de la liste des tâches, y compris le formulaire pour ajouter des tâches et l'interface pour gérer les tags.

## Completion

**Gestion des Tags**
 
**Interface utilisateur**

- [x] Créer une interface pour ajouter et gérer des tags personnalisés avec des couleurs
- [x] Permettre d'assigner plusieurs tags à une tâche
- [x] Afficher les tags de manière visuelle dans la liste des tâches
- [x] Implémenter un système de filtrage des tâches par tag

 
**API et Base de données**

- [x] Créer les tables nécessaires pour stocker les tags et leurs associations avec les tâches
- [x] Implémenter les endpoints API pour la création/modification/suppression des tags
- [x] Gérer les associations entre tags et tâches dans la base de données
- [x] Optimiser les requêtes pour le chargement des tags et le filtrage

**Filtrage et Recherche**

 **Interface utilisateur**

- [x] - Ajouter un champ de recherche pour filtrer les tâches par titre
- [x] - Créer des filtres pour les tâches complétées/en cours
- [ ] - Implémenter une interface réactive qui se met à jour en temps réel

 

**API et Base de données**

- [x] - Implémenter les endpoints de recherche et filtrage
- [x] - Optimiser les requêtes avec des index appropriés
- [x] - Gérer la pagination des résultats de recherche

**Gestion des Priorités**
 
**Interface utilisateur**

- [x] Créer une interface pour définir la priorité des tâches (haute, moyenne, basse)
- [ ] Implémenter le tri des tâches par priorité
- [x] Ajouter des indicateurs visuels pour les différentes priorités

 

**API et Base de données**

- [x] Ajouter le champ priorité dans la table des tâches
- [x] Créer les endpoints pour gérer les priorités
- [x] Implémenter le tri par priorité côté serveur