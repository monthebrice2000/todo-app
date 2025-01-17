const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todos');
const tagRoutes = require('./routes/tags');
const net = require('net');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'API for managing todos and tags',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

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

let isDatabaseConnected = false; // Track the database connection state

const connectToDatabase = async (uri) => {
  if (!isDatabaseConnected) {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4, // Use IPv4
      });
      console.log('Connected to MongoDB');
      isDatabaseConnected = true;
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  }
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
  app.use('/api/tags', tagRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  try {
    await connectToDatabase(MONGO_URI);
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      // Stocker le port utilisé dans une variable d'environnement pour que le frontend puisse l'utiliser
      process.env.ACTUAL_PORT = PORT;
    });

    return server;
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Export the app and startServer for use in tests or other modules
module.exports = { app, startServer, connectToDatabase };

// Start the server only if this file is executed directly
if (require.main === module) {
  startServer();
}