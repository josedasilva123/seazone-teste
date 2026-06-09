'use server';

import { listPropertiesSchema } from '@/lib/validations/property';
import { PropertyService } from '@/lib/services/property';
import type { ActionResult } from '@/lib/actions/types';
import type { PropertyListItem } from '@/lib/repositories/property';

export type PropertyListResult = {
  items: PropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function listProperties(
  params: Record<string, string | undefined> = {},
): Promise<ActionResult<PropertyListResult>> {
  const parsed = listPropertiesSchema.safeParse(params);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  try {
    const result = await PropertyService.list(parsed.data);
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
}
