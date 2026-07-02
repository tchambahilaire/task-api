import { TaskService } from '../services/taskService';
import { NotFoundError } from '../exceptions/AppError';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  describe('create', () => {
    it('devrait créer une tâche avec succès', () => {
      const task = service.create({ 
        title: 'Test Task', 
        description: 'Description test',
        completed: false 
      });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Description test');
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('devrait créer une tâche avec des valeurs par défaut', () => {
      const task = service.create({ title: 'Test' });
      
      expect(task.description).toBeUndefined();
      expect(task.completed).toBe(false);
    });
  });

  describe('findAll', () => {
    it('devrait retourner une liste paginée', () => {
      for (let i = 0; i < 15; i++) {
        service.create({ title: `Tâche ${i}` });
      }

      const result = service.findAll(1, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.totalPages).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrevious).toBe(false);
    });

    it('devrait filtrer par statut completed', () => {
      service.create({ title: 'Tâche 1', completed: true });
      service.create({ title: 'Tâche 2', completed: false });
      service.create({ title: 'Tâche 3', completed: true });

      const result = service.findAll(1, 10, { completed: true });
      
      expect(result.data).toHaveLength(2);
      expect(result.data.every(t => t.completed)).toBe(true);
    });

    it('devrait filtrer par recherche', () => {
      service.create({ title: 'Projet React', description: 'Développement frontend' });
      service.create({ title: 'Projet Node', description: 'Backend API' });
      service.create({ title: 'Design', description: 'Interface utilisateur' });

      const result = service.findAll(1, 10, { search: 'react' });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Projet React');
    });

    it('devrait trier par titre ascendant', () => {
      service.create({ title: 'B Tâche' });
      service.create({ title: 'A Tâche' });
      service.create({ title: 'C Tâche' });

      const result = service.findAll(1, 10, undefined, { 
        field: 'title', 
        order: 'asc' 
      });
      
      expect(result.data[0].title).toBe('A Tâche');
      expect(result.data[1].title).toBe('B Tâche');
      expect(result.data[2].title).toBe('C Tâche');
    });
  });

  describe('findById', () => {
    it('devrait trouver une tâche par son ID', () => {
      const created = service.create({ title: 'Test' });
      const found = service.findById(created.id);
      
      expect(found).toEqual(created);
    });

    it('devrait lever une erreur si la tâche n\'existe pas', () => {
      expect(() => {
        service.findById('non-existent-id');
      }).toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une tâche', () => {
      const task = service.create({ title: 'Original' });
      const updated = service.update(task.id, { 
        title: 'Modifié', 
        completed: true 
      });

      expect(updated.title).toBe('Modifié');
      expect(updated.completed).toBe(true);
      expect(updated.updatedAt).not.toEqual(task.updatedAt);
    });

    it('devrait lever une erreur si la tâche n\'existe pas', () => {
      expect(() => {
        service.update('non-existent-id', { title: 'Test' });
      }).toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('devrait supprimer une tâche', () => {
      const task = service.create({ title: 'À supprimer' });
      service.delete(task.id);
      
      expect(() => {
        service.findById(task.id);
      }).toThrow(NotFoundError);
    });

    it('devrait lever une erreur si la tâche n\'existe pas', () => {
      expect(() => {
        service.delete('non-existent-id');
      }).toThrow(NotFoundError);
    });
  });

  describe('count', () => {
    it('devrait retourner le nombre de tâches', () => {
      expect(service.count()).toBe(0);
      
      service.create({ title: 'Tâche 1' });
      service.create({ title: 'Tâche 2' });
      
      expect(service.count()).toBe(2);
    });
  });
});
