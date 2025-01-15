# Utiliser une image Node.js officielle comme image parent
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]