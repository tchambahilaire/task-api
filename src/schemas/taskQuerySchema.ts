import { z } from 'zod';

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  completed: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(['createdAt', 'title', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type TaskQueryDTO = z.infer<typeof taskQuerySchema>;
