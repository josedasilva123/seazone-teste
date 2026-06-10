import { PropertyRepository } from '@/lib/repositories/property';
import type { ListPropertiesInput } from '@/lib/validations/property';

export const PropertyService = {
  async getByCode(code: string) {
    const property = await PropertyRepository.findByCode(code);
    if (!property) {
      throw new Error(`Imóvel com código "${code}" não encontrado.`);
    }
    return property;
  },

  async list(input: ListPropertiesInput) {
    return PropertyRepository.list(input);
  },
};
