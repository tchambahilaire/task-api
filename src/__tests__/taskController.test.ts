import request from 'supertest';
import app from '../app';
import { TaskService } from '../services/taskService';

jest.mock('../services/taskService');

describe('TaskController', () => {
  let mockService: jest.Mocked<TaskService>;

  beforeEach(() => {
    mockService = new TaskService() as jest.Mocked<TaskService>;
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('devrait retourner une liste de tâches', async () => {
      const mockTasks = {
        data: [{ id: '1', title: 'Test', completed: false, createdAt: new Date(), updatedAt: new Date() }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };

      mockService.findAll.mockReturnValue(mockTasks);

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });
  });

  describe('POST /tasks', () => {
    it('devrait créer une tâche', async () => {
      const newTask = {
        id: '123',
        title: 'Nouvelle tâche',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.create.mockReturnValue(newTask);

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Nouvelle tâche' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Nouvelle tâche');
    });

    it('devrait retourner une erreur si le titre est manquant', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation échouée');
    });
  });

  describe('GET /tasks/:id', () => {
    it('devrait retourner une tâche par son ID', async () => {
      const task = {
        id: '123',
        title: 'Test',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.findById.mockReturnValue(task);

      const response = await request(app)
        .get('/tasks/123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('123');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('devrait mettre à jour une tâche', async () => {
      const updatedTask = {
        id: '123',
        title: 'Modifié',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.update.mockReturnValue(updatedTask);

      const response = await request(app)
        .put('/tasks/123')
        .send({ title: 'Modifié', completed: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Modifié');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('devrait supprimer une tâche', async () => {
      mockService.delete.mockImplementation(() => {});

      await request(app)
        .delete('/tasks/123')
        .expect(204);
    });
  });
});
