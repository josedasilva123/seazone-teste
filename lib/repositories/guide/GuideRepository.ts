import { db } from '@/lib/db';

export type GuideWithPlaces = NonNullable<
  Awaited<ReturnType<typeof GuideRepository.findByPropertyCode>>
>;

export interface GeneratedGuideInput {
  welcomeMessage: string;
  seasonalTips: string;
  places: Array<{
    name: string;
    category: string;
    placeType?: string;
    distance: string;
    description: string;
  }>;
}

export const GuideRepository = {
  async findByPropertyCode(code: string) {
    return db.localGuide.findFirst({
      where: { property: { code } },
      include: { places: true },
    });
  },

  async upsertGenerated(propertyCode: string, data: GeneratedGuideInput) {
    const property = await db.property.findUnique({ where: { code: propertyCode } });
    if (!property) throw new Error(`Property not found: ${propertyCode}`);

    const existing = await db.localGuide.findUnique({
      where: { propertyId: property.id },
    });

    if (existing) {
      await db.localGuidePlace.deleteMany({ where: { guideId: existing.id } });
      return db.localGuide.update({
        where: { id: existing.id },
        data: {
          welcomeMessage: data.welcomeMessage,
          seasonalTips: data.seasonalTips,
          aiGeneratedAt: new Date(),
          places: { create: data.places },
        },
        include: { places: true },
      });
    }

    return db.localGuide.create({
      data: {
        propertyId: property.id,
        welcomeMessage: data.welcomeMessage,
        seasonalTips: data.seasonalTips,
        aiGeneratedAt: new Date(),
        places: { create: data.places },
      },
      include: { places: true },
    });
  },
};
