'use server';

import { getPropertyByCodeSchema } from '@/lib/validations/property';
import { PropertyService } from '@/lib/services/property';
import type { ActionResult } from '@/lib/actions/types';
import type { PropertyWithRelations } from '@/lib/repositories/property';

export async function getPropertyByCode(
  code: string,
): Promise<ActionResult<PropertyWithRelations>> {
  const parsed = getPropertyByCodeSchema.safeParse({ code });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  try {
    const property = await PropertyService.getByCode(parsed.data.code);
    return { ok: true, data: property };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
}
