import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task API',
      version: '1.0.0',
      description: 'API REST complète de gestion de tâches',
      contact: {
        name: 'API Support',
        email: 'support@task-api.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Serveur de développement',
      },
      {
        url: 'https://ton-api.onrender.com',
        description: 'Serveur de production',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'completed', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique de la tâche',
            },
            title: {
              type: 'string',
              description: 'Titre de la tâche',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Description de la tâche',
            },
            completed: {
              type: 'boolean',
              description: 'Statut de la tâche',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
            },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Titre de la tâche',
            },
            description: {
              type: 'string',
              description: 'Description de la tâche',
            },
            completed: {
              type: 'boolean',
              description: 'Statut de la tâche',
              default: false,
            },
          },
        },
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Titre de la tâche',
            },
            description: {
              type: 'string',
              description: 'Description de la tâche',
            },
            completed: {
              type: 'boolean',
              description: 'Statut de la tâche',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Message d\'erreur',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Tasks',
        description: 'Gestion des tâches',
      },
      {
        name: 'Health',
        description: 'Vérification de la santé du service',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
