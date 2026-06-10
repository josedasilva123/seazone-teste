import { db } from '@/lib/db';
import type { ListPropertiesInput } from '@/lib/validations/property';

const propertyInclude = {
  address: true,
  operational: true,
  rules: true,
  amenities: true,
  images: { orderBy: { order: 'asc' as const } },
  host: true,
  localGuide: { include: { places: true } },
} as const;

export type PropertyWithRelations = NonNullable<
  Awaited<ReturnType<typeof PropertyRepository.findByCode>>
>;

export type PropertyListItem = Awaited<
  ReturnType<typeof PropertyRepository.list>
>['items'][number];

export const PropertyRepository = {
  async findByCode(code: string) {
    return db.property.findUnique({
      where: { code },
      include: propertyInclude,
    });
  },

  async list({ page, pageSize, city, state, propertyType, minBedrooms, minGuests, allowPet }: ListPropertiesInput) {
    const where = {
      ...(propertyType && { propertyType }),
      ...(minBedrooms !== undefined && { bedroomQuantity: { gte: minBedrooms } }),
      ...(minGuests !== undefined && { guestCapacity: { gte: minGuests } }),
      ...(city || state
        ? {
            address: {
              ...(city && { city: { contains: city } }),
              ...(state && { state }),
            },
          }
        : {}),
      ...(allowPet !== undefined && { rules: { allowPet } }),
    };

    const [total, items] = await Promise.all([
      db.property.count({ where }),
      db.property.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          address: true,
          amenities: true,
          images: { orderBy: { order: 'asc' }, take: 1 },
          rules: true,
          host: true,
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },
};
