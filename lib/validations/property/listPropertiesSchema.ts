import { z } from 'zod';

export const listPropertiesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  city: z.string().optional(),
  state: z.string().optional(),
  propertyType: z.string().optional(),
  minBedrooms: z.coerce.number().int().min(0).optional(),
  minGuests: z.coerce.number().int().min(1).optional(),
  allowPet: z.coerce.boolean().optional(),
});

export type ListPropertiesInput = z.infer<typeof listPropertiesSchema>;
