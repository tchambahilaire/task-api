import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Le titre est requis')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .transform(val => val === '' || val === null || val === undefined ? undefined : val),
  completed: z.boolean().optional().default(false),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'Au moins un champ doit être fourni pour la mise à jour',
  }
);

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
