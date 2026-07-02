import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchema';
import { taskQuerySchema } from '../schemas/taskQuerySchema';
import { idSchema } from '../schemas/idSchema';
import { logger } from '../utils/logger';

const taskService = new TaskService();

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = taskQuerySchema.parse(req.query);
    const result = taskService.findAll(
      query.page,
      query.limit,
      {
        completed: query.completed,
        search: query.search,
      },
      {
        field: query.sort,
        order: query.order,
      }
    );

    res.setHeader('X-Total-Count', result.total);
    res.setHeader('X-Total-Pages', result.totalPages);
    res.setHeader('X-Current-Page', result.page);
    res.setHeader('X-Has-Next', String(result.hasNext));
    res.setHeader('X-Has-Previous', String(result.hasPrevious));

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idSchema.parse(req.params);
    const task = taskService.findById(id);
    
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    // Nettoyer les données avant de les passer au service
    const cleanData = {
      title: validatedData.title,
      description: validatedData.description || undefined,
      completed: validatedData.completed || false,
    };
    const newTask = taskService.create(cleanData);
    
    logger.info(`Tâche créée avec l'ID: ${newTask.id}`);
    
    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);
    // Nettoyer les données avant de les passer au service
    const cleanData: any = {};
    if (validatedData.title !== undefined) cleanData.title = validatedData.title;
    if (validatedData.description !== undefined) cleanData.description = validatedData.description || undefined;
    if (validatedData.completed !== undefined) cleanData.completed = validatedData.completed;
    
    const updatedTask = taskService.update(id, cleanData);
    
    logger.info(`Tâche mise à jour: ${id}`);
    
    res.json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idSchema.parse(req.params);
    taskService.delete(id);
    
    logger.info(`Tâche supprimée: ${id}`);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const patchTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = idSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);
    // Nettoyer les données avant de les passer au service
    const cleanData: any = {};
    if (validatedData.title !== undefined) cleanData.title = validatedData.title;
    if (validatedData.description !== undefined) cleanData.description = validatedData.description || undefined;
    if (validatedData.completed !== undefined) cleanData.completed = validatedData.completed;
    
    const updatedTask = taskService.update(id, cleanData);
    
    logger.info(`Tâche patchée: ${id}`);
    
    res.json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};
