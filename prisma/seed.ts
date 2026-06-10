import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.property.deleteMany();

  // ─── FLN001 — Florianópolis ───────────────────────────────────────────────
  await prisma.property.create({
    data: {
      code: 'FLN001',
      name: 'Apartamento Beira-Mar Florianópolis',
      propertyType: 'Apartamento',
      bedroomQuantity: 2,
      bathroomQuantity: 1,
      guestCapacity: 4,

      address: {
        create: {
          street: 'Rua Lauro Linhares',
          number: '589',
          complement: 'Apto 301',
          neighborhood: 'Trindade',
          city: 'Florianópolis',
          state: 'SC',
          postalCode: '88036-001',
        },
      },

      operational: {
        create: {
          wifiNetwork: 'SeaHome_FLN001',
          wifiPassword: 'floripa2024',
          isSelfCheckin: true,
          propertyAccessType: 'smart_lock',
          propertyAccessInstructions: 'Use o código 4521 na fechadura eletrônica',
          propertyPassword: '4521',
          hasParkingSpot: true,
          parkingSpotIdentifier: 'Vaga 12 — subsolo B1',
          parkingSpotInstructions: 'Portão lateral, código 7890 no interfone',
        },
      },

      rules: {
        create: {
          checkInTime: '15:00',
          checkOutTime: '11:00',
          allowPet: false,
          smokingPermitted: false,
          suitableForChildren: true,
          suitableForBabies: true,
          eventsPermitted: false,
        },
      },

      amenities: {
        create: {
          wifi: true,
          tv: true,
          airConditioning: true,
          kitchen: true,
          washingMachine: true,
          elevator: true,
          balcony: true,
        },
      },

      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            alt: 'Sala de estar ampla com vista para o mar',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            alt: 'Cozinha moderna equipada',
            order: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
            alt: 'Quarto principal com cama de casal',
            order: 2,
          },
        ],
      },

      host: {
        create: {
          name: 'Ana Paula',
          phone: '+5548991234567',
        },
      },

      localGuide: {
        create: {
          aiGeneratedAt: new Date(),
          welcomeMessage:
            'Seu apartamento fica no coração da Trindade, a poucos minutos das principais atrações da ilha. Aproveite a vista privilegiada e a localização central para explorar Florianópolis!',
          seasonalTips:
            'No verão, as praias do leste (Joaquina, Mole, Campeche) são as mais badaladas. No inverno, aposte nos restaurantes de frutos do mar no centro histórico.',
          places: {
            create: [
              {
                name: 'Box 32',
                category: 'restaurant',
                distance: 'Aprox. 1,2 km',
                description: 'Boteco tradicional de Florianópolis, famoso pelos petiscos e chopes gelados.',
              },
              {
                name: 'Armazém Vieira',
                category: 'restaurant',
                distance: 'Aprox. 2,5 km',
                description: 'Referência em frutos do mar desde 1958. Filé de linguado é imperdível.',
              },
              {
                name: 'Praia da Joaquina',
                category: 'attraction',
                distance: 'Aprox. 18 km',
                description: 'Famosa pelas dunas e pelas ondas ideais para surf.',
              },
              {
                name: 'Centro Histórico de Florianópolis',
                category: 'attraction',
                distance: 'Aprox. 5 km',
                description: 'Arquitetura colonial, Mercado Público e a Ponte Hercílio Luz.',
              },
              {
                name: 'Farmácia Catarinense',
                category: 'essential',
                placeType: 'pharmacy',
                distance: 'Aprox. 300 metros',
                description: 'Farmácia 24h na Av. Madre Benvenuta.',
              },
              {
                name: 'Supermercado Angeloni',
                category: 'essential',
                placeType: 'supermarket',
                distance: 'Aprox. 800 metros',
                description: 'Grande rede local com hortifrúti, padaria e seção de vinhos.',
              },
            ],
          },
        },
      },
    },
  });

  // ─── GRM001 — Gramado ─────────────────────────────────────────────────────
  await prisma.property.create({
    data: {
      code: 'GRM001',
      name: 'Chalé Serra Gramado',
      propertyType: 'Casa',
      bedroomQuantity: 3,
      bathroomQuantity: 2,
      guestCapacity: 6,

      address: {
        create: {
          street: 'Rua das Hortênsias',
          number: '220',
          complement: null,
          neighborhood: 'Planalto',
          city: 'Gramado',
          state: 'RS',
          postalCode: '95670-000',
        },
      },

      operational: {
        create: {
          wifiNetwork: 'ChaletSerra_GRM',
          wifiPassword: 'gramado@2024',
          isSelfCheckin: false,
          propertyAccessType: 'keybox',
          propertyAccessInstructions: 'A chave está no cofre na entrada. Código: 1983',
          propertyPassword: '1983',
          hasParkingSpot: true,
          parkingSpotInstructions: 'Garagem própria para 2 carros',
        },
      },

      rules: {
        create: {
          checkInTime: '14:00',
          checkOutTime: '12:00',
          allowPet: true,
          smokingPermitted: false,
          suitableForChildren: true,
          suitableForBabies: false,
          eventsPermitted: false,
        },
      },

      amenities: {
        create: {
          wifi: true,
          tv: true,
          kitchen: true,
          bbqGrill: true,
          balcony: true,
          dishwasher: true,
        },
      },

      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
            alt: 'Chalé aconchegante cercado pela Serra Gaúcha',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
            alt: 'Área de churrasqueira e deck externo',
            order: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
            alt: 'Quarto suíte com vista para o jardim',
            order: 2,
          },
        ],
      },

      host: {
        create: {
          name: 'Carlos Eduardo',
          phone: '+5554998765432',
        },
      },

      localGuide: {
        create: {
          aiGeneratedAt: new Date(),
          welcomeMessage:
            'Bem-vindo ao Chalé Serra Gramado! Você está em um dos destinos mais encantadores do Brasil. Explore a gastronomia italiana, os chocolates artesanais e as paisagens de tirar o fôlego.',
          seasonalTips:
            'No inverno (jun–ago) Gramado tem névoa matinal e temperaturas abaixo de 0°C — leve agasalho. O Natal Luz (nov–jan) é o evento mais aguardado do ano.',
          places: {
            create: [
              {
                name: 'Ristorante La Caceria',
                category: 'restaurant',
                distance: 'Aprox. 1,5 km',
                description: 'Culinária italiana da Serra Gaúcha, ambiente rústico e requintado.',
              },
              {
                name: 'Café Colonial Bela Vista',
                category: 'restaurant',
                distance: 'Aprox. 2 km',
                description: 'Clássico café colonial gaúcho com mais de 80 itens artesanais.',
              },
              {
                name: 'Mini Mundo',
                category: 'attraction',
                distance: 'Aprox. 3 km',
                description: 'Parque com réplicas de monumentos mundiais em escala reduzida.',
              },
              {
                name: 'Lago Negro',
                category: 'attraction',
                distance: 'Aprox. 4 km',
                description: 'Passeio de pedalinho e paisagem com pinheiros ao redor do lago.',
              },
              {
                name: 'Chocolates Prawer',
                category: 'attraction',
                distance: 'Aprox. 2,5 km',
                description: 'Fábrica de chocolates artesanais com tour e degustação.',
              },
              {
                name: 'Farmácia Panvel',
                category: 'essential',
                placeType: 'pharmacy',
                distance: 'Aprox. 1 km',
                description: 'Farmácia com atendimento diário na Av. Borges de Medeiros.',
              },
            ],
          },
        },
      },
    },
  });

  console.log('✅ Seed concluído: FLN001 e GRM001 inseridos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
