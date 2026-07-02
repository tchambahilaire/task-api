import { z } from 'zod';

export const idSchema = z.object({
  id: z.string().uuid('L\'ID doit être un UUID valide'),
});

export type IdDTO = z.infer<typeof idSchema>;
