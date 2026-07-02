import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';
import { corsOptions, corsHeaders } from './middlewares/cors';
import { limiter } from './middlewares/rateLimiter';
import { logRequest } from './middlewares/logger';
import { specs } from './swagger';
import { config } from './config/env';
import { logger } from './utils/logger';

const app = express();

// Middlewares de sécurité et performance
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());

// CORS
app.use(corsOptions);
app.use(corsHeaders);

// Logging
app.use(logRequest);

// Rate limiting
app.use(limiter);

// Parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Routes
app.get('/health', (_req, res) => {  // ← ICI LE CORRECTION
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

app.use('/tasks', taskRoutes);

// Gestion des erreurs
app.use(notFoundHandler);
app.use(errorHandler);

// Démarrage du serveur
if (!config.isTest) {
  app.listen(config.port, () => {
    logger.info(`🚀 Serveur démarré sur http://localhost:${config.port}`);
    logger.info(`📚 Documentation Swagger: http://localhost:${config.port}/api-docs`);
    logger.info(`💚 Health check: http://localhost:${config.port}/health`);
    logger.info(`🌍 Environnement: ${config.nodeEnv}`);
  });
}

export default app;
