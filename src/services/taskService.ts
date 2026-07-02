import { Task, CreateTaskInput, UpdateTaskInput, PaginatedResult, TaskFilters, TaskSort } from '../types/task';
import { randomUUID } from 'crypto';
import { NotFoundError } from '../exceptions/AppError';

export class TaskService {
  private tasks: Map<string, Task> = new Map();

  private generateId(): string {
    return randomUUID();
  }

  private now(): Date {
    return new Date();
  }

  findAll(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilters,
    sort?: TaskSort
  ): PaginatedResult<Task> {
    let allTasks = Array.from(this.tasks.values());

    // Filtrage
    if (filters?.completed !== undefined) {
      allTasks = allTasks.filter(t => t.completed === filters.completed);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      allTasks = allTasks.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    // Tri
    if (sort) {
      allTasks.sort((a, b) => {
        const valA = a[sort.field];
        const valB = b[sort.field];
        
        if (valA instanceof Date && valB instanceof Date) {
          return sort.order === 'asc' 
            ? valA.getTime() - valB.getTime()
            : valB.getTime() - valA.getTime();
        }
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sort.order === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        
        return 0;
      });
    }

    // Pagination
    const total = allTasks.length;
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, total);
    const data = allTasks.slice(start, end);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  findById(id: string): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundError('Tâche');
    }
    return task;
  }

  findByIdOptional(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: this.generateId(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      completed: input.completed || false,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update(id: string, input: UpdateTaskInput): Task {
    const existing = this.tasks.get(id);
    if (!existing) {
      throw new NotFoundError('Tâche');
    }

    const updated: Task = {
      ...existing,
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.description !== undefined && { description: input.description?.trim() || undefined }),
      ...(input.completed !== undefined && { completed: input.completed }),
      updatedAt: this.now(),
    };
    
    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    const deleted = this.tasks.delete(id);
    if (!deleted) {
      throw new NotFoundError('Tâche');
    }
  }

  // Méthodes utilitaires pour les tests
  clear(): void {
    this.tasks.clear();
  }

  count(): number {
    return this.tasks.size;
  }
}
