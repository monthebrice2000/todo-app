const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todos');
const net = require('net');

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/todos';

// Fonction pour tester si un port est disponible
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '0.0.0.0');
  });
};

// Fonction pour démarrer le serveur sur le bon port
const startServer = async () => {
  let PORT = process.env.PORT || 5000;
  
  // Si le port 5000 n'est pas disponible, essayer 5001
  if (!(await isPortAvailable(PORT))) {
    console.log(`Port ${PORT} is not available, trying 5001...`);
    PORT = 5001;
  }

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/api/todos', todoRoutes);

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4
    });
    console.log('Connected to MongoDB');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      // Stocker le port utilisé dans une variable d'environnement pour que le frontend puisse l'utiliser
      process.env.ACTUAL_PORT = PORT;
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();