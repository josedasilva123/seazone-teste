import { z } from 'zod';

export const getPropertyByCodeSchema = z.object({
  code: z.string().min(1, 'Código do imóvel é obrigatório'),
});

export type GetPropertyByCodeInput = z.infer<typeof getPropertyByCodeSchema>;
