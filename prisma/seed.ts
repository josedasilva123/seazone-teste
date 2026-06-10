import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não definida');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMAGE_POOLS = [
  [
    { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', alt: 'Sala de estar ampla com vista para o mar' },
    { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', alt: 'Cozinha moderna equipada' },
    { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', alt: 'Quarto principal com cama de casal' },
  ],
  [
    { url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800', alt: 'Chalé aconchegante cercado pela Serra Gaúcha' },
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', alt: 'Área de churrasqueira e deck externo' },
    { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', alt: 'Quarto suíte com vista para o jardim' },
  ],
] as const;

function imagesFromPool(poolIndex: number) {
  const pool = IMAGE_POOLS[poolIndex % IMAGE_POOLS.length];
  return pool.map((image, order) => ({ ...image, order }));
}

type PlaceSeed = {
  name: string;
  category: 'restaurant' | 'attraction' | 'essential';
  placeType?: string;
  distance: string;
  description: string;
};

type PropertySeed = {
  code: string;
  name: string;
  propertyType: string;
  bedroomQuantity: number;
  bathroomQuantity: number;
  guestCapacity: number;
  imagePool: number;
  address: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  operational: {
    wifiNetwork: string;
    wifiPassword: string;
    isSelfCheckin: boolean;
    propertyAccessType: string;
    propertyAccessInstructions: string;
    propertyPassword: string;
    hasParkingSpot: boolean;
    parkingSpotIdentifier?: string | null;
    parkingSpotInstructions?: string | null;
  };
  rules: {
    checkInTime: string;
    checkOutTime: string;
    allowPet: boolean;
    smokingPermitted: boolean;
    suitableForChildren: boolean;
    suitableForBabies: boolean;
    eventsPermitted: boolean;
  };
  amenities: {
    wifi?: boolean;
    tv?: boolean;
    airConditioning?: boolean;
    kitchen?: boolean;
    washingMachine?: boolean;
    elevator?: boolean;
    balcony?: boolean;
    bbqGrill?: boolean;
    dishwasher?: boolean;
    jacuzzi?: boolean;
    pool?: boolean;
  };
  host: { name: string; phone: string };
  localGuide: {
    welcomeMessage: string;
    seasonalTips: string;
    places: PlaceSeed[];
  };
};

const PROPERTIES: PropertySeed[] = [
  {
    code: 'FLN001',
    name: 'Apartamento Beira-Mar Florianópolis',
    propertyType: 'Apartamento',
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    imagePool: 0,
    address: {
      street: 'Rua Lauro Linhares',
      number: '589',
      complement: 'Apto 301',
      neighborhood: 'Trindade',
      city: 'Florianópolis',
      state: 'SC',
      postalCode: '88036-001',
    },
    operational: {
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
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      airConditioning: true,
      kitchen: true,
      washingMachine: true,
      elevator: true,
      balcony: true,
    },
    host: { name: 'Ana Paula', phone: '+5548991234567' },
    localGuide: {
      welcomeMessage:
        'Seu apartamento fica no coração da Trindade, a poucos minutos das principais atrações da ilha. Aproveite a vista privilegiada e a localização central para explorar Florianópolis!',
      seasonalTips:
        'No verão, as praias do leste (Joaquina, Mole, Campeche) são as mais badaladas. No inverno, aposte nos restaurantes de frutos do mar no centro histórico.',
      places: [
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
  {
    code: 'GRM001',
    name: 'Chalé Serra Gramado',
    propertyType: 'Casa',
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    imagePool: 1,
    address: {
      street: 'Rua das Hortênsias',
      number: '220',
      complement: null,
      neighborhood: 'Planalto',
      city: 'Gramado',
      state: 'RS',
      postalCode: '95670-000',
    },
    operational: {
      wifiNetwork: 'ChaletSerra_GRM',
      wifiPassword: 'gramado@2024',
      isSelfCheckin: false,
      propertyAccessType: 'keybox',
      propertyAccessInstructions: 'A chave está no cofre na entrada. Código: 1983',
      propertyPassword: '1983',
      hasParkingSpot: true,
      parkingSpotInstructions: 'Garagem própria para 2 carros',
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      bbqGrill: true,
      balcony: true,
      dishwasher: true,
    },
    host: { name: 'Carlos Eduardo', phone: '+5554998765432' },
    localGuide: {
      welcomeMessage:
        'Bem-vindo ao Chalé Serra Gramado! Você está em um dos destinos mais encantadores do Brasil. Explore a gastronomia italiana, os chocolates artesanais e as paisagens de tirar o fôlego.',
      seasonalTips:
        'No inverno (jun–ago) Gramado tem névoa matinal e temperaturas abaixo de 0°C — leve agasalho. O Natal Luz (nov–jan) é o evento mais aguardado do ano.',
      places: [
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
  {
    code: 'RIO001',
    name: 'Cobertura Vista Mar Copacabana',
    propertyType: 'Apartamento',
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 4,
    imagePool: 0,
    address: {
      street: 'Av. Atlântica',
      number: '1702',
      complement: 'Cobertura 1201',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      postalCode: '22021-001',
    },
    operational: {
      wifiNetwork: 'SeaHome_RIO001',
      wifiPassword: 'copacabana2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Digite 7788 no teclado da porta principal',
      propertyPassword: '7788',
      hasParkingSpot: true,
      parkingSpotIdentifier: 'Vaga 45 — subsolo',
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, elevator: true, balcony: true, pool: true },
    host: { name: 'Mariana Costa', phone: '+5521987654321' },
    localGuide: {
      welcomeMessage: 'Sua cobertura em Copacabana está a passos da praia e do calçadão mais famoso do Rio.',
      seasonalTips: 'No verão, prefira visitar o Pão de Açúcar cedo para evitar filas. Carnaval exige planejamento de transporte.',
      places: [
        { name: 'Confeitaria Colombo', category: 'restaurant', distance: 'Aprox. 3 km', description: 'Patrimônio histórico com doces e café da manhã clássico.' },
        { name: 'Praia de Copacabana', category: 'attraction', distance: 'Aprox. 200 metros', description: '4 km de areia, quiosques e pôr do sol icônico.' },
        { name: 'Farmácia Pacheco', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 400 metros', description: 'Farmácia 24h na Av. Nossa Senhora de Copacabana.' },
      ],
    },
  },
  {
    code: 'SP001',
    name: 'Loft Design Pinheiros',
    propertyType: 'Apartamento',
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    imagePool: 1,
    address: {
      street: 'Rua dos Pinheiros',
      number: '498',
      complement: 'Loft 8',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '05422-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_SP001',
      wifiPassword: 'pinheiros2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Código 3344 na fechadura do hall',
      propertyPassword: '3344',
      hasParkingSpot: false,
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '11:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: false,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, washingMachine: true, elevator: true },
    host: { name: 'Felipe Andrade', phone: '+5511987654321' },
    localGuide: {
      welcomeMessage: 'Loft moderno no coração de Pinheiros, perto de bares, galerias e estações de metrô.',
      seasonalTips: 'Inverno em SP pode ter noites frias — o loft tem aquecedor. Fins de semana são movimentados na região.',
      places: [
        { name: 'Mercado Municipal', category: 'restaurant', distance: 'Aprox. 6 km', description: 'Sanduíche de mortadela e frutas tropicais imperdíveis.' },
        { name: 'Parque Villa-Lobos', category: 'attraction', distance: 'Aprox. 2 km', description: 'Área verde para caminhadas e piqueniques.' },
        { name: 'Supermercado Pão de Açúcar', category: 'essential', placeType: 'supermarket', distance: 'Aprox. 500 metros', description: 'Rede completa com delivery.' },
      ],
    },
  },
  {
    code: 'BUZ001',
    name: 'Casa de Praia Geribá',
    propertyType: 'Casa',
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 8,
    imagePool: 0,
    address: {
      street: 'Rua das Pedras',
      number: '88',
      neighborhood: 'Geribá',
      city: 'Armação dos Búzios',
      state: 'RJ',
      postalCode: '28950-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_BUZ001',
      wifiPassword: 'buzios2024',
      isSelfCheckin: false,
      propertyAccessType: 'physical_key',
      propertyAccessInstructions: 'Retire a chave com o porteiro na guarita',
      propertyPassword: '1234',
      hasParkingSpot: true,
      parkingSpotInstructions: 'Estacionamento na frente da casa',
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '10:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: true,
    },
    amenities: { wifi: true, tv: true, kitchen: true, bbqGrill: true, pool: true, balcony: true },
    host: { name: 'Roberta Lima', phone: '+5522998877665' },
    localGuide: {
      welcomeMessage: 'Casa espaçosa a poucos minutos da Praia de Geribá, ideal para famílias e grupos.',
      seasonalTips: 'Réveillon e janeiro são alta temporada — reserve restaurantes com antecedência.',
      places: [
        { name: 'Praia de Geribá', category: 'attraction', distance: 'Aprox. 600 metros', description: 'Ondas fortes, ideal para surf e bodyboard.' },
        { name: 'Rua das Pedras', category: 'restaurant', distance: 'Aprox. 1 km', description: 'Centro gastronômico e noturno de Búzios.' },
        { name: 'Farmácia São João', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 1,5 km', description: 'Farmácia de plantão no centro.' },
      ],
    },
  },
  {
    code: 'POA001',
    name: 'Apartamento Moinhos de Vento',
    propertyType: 'Apartamento',
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    imagePool: 1,
    address: {
      street: 'Rua Padre Chagas',
      number: '120',
      complement: 'Apto 502',
      neighborhood: 'Moinhos de Vento',
      city: 'Porto Alegre',
      state: 'RS',
      postalCode: '90570-080',
    },
    operational: {
      wifiNetwork: 'SeaHome_POA001',
      wifiPassword: 'poa2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Código 5566 no interfone e na porta',
      propertyPassword: '5566',
      hasParkingSpot: true,
      parkingSpotIdentifier: 'Vaga 3',
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, washingMachine: true, elevator: true },
    host: { name: 'Lucas Müller', phone: '+5551988776655' },
    localGuide: {
      welcomeMessage: 'Apartamento elegante no bairro mais charmoso de Porto Alegre, perto de cafés e parques.',
      seasonalTips: 'Chuvas são frequentes no outono — leve guarda-chuva. O Mercado Público é ótimo para almoço.',
      places: [
        { name: 'Parque Moinhos de Vento', category: 'attraction', distance: 'Aprox. 500 metros', description: 'Parque arborizado com lago e playground.' },
        { name: 'Mercado Público', category: 'restaurant', distance: 'Aprox. 3 km', description: 'Gastronomia gaúcha e produtos artesanais.' },
        { name: 'Farmácia Panvel', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 300 metros', description: 'Atendimento diário na Padre Chagas.' },
      ],
    },
  },
  {
    code: 'CWB001',
    name: 'Studio Batel Curitiba',
    propertyType: 'Apartamento',
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    imagePool: 0,
    address: {
      street: 'Rua Comendador Araújo',
      number: '731',
      complement: 'Studio 304',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR',
      postalCode: '80420-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_CWB001',
      wifiPassword: 'curitiba2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Use o código 8899 na fechadura',
      propertyPassword: '8899',
      hasParkingSpot: true,
      parkingSpotIdentifier: 'Vaga 18',
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '11:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, elevator: true },
    host: { name: 'Juliana Ferreira', phone: '+5541988776655' },
    localGuide: {
      welcomeMessage: 'Studio compacto no Batel, região nobre de Curitiba com excelente infraestrutura.',
      seasonalTips: 'Curitiba é fria no inverno — o studio tem aquecimento. Ótima base para o Parque Barigui.',
      places: [
        { name: 'Parque Barigui', category: 'attraction', distance: 'Aprox. 2 km', description: 'Lago, capivaras e trilhas no coração da cidade.' },
        { name: 'Hard Rock Cafe', category: 'restaurant', distance: 'Aprox. 1 km', description: 'Burgers e ambiente temático no Batel.' },
        { name: 'Supermercado Big', category: 'essential', placeType: 'supermarket', distance: 'Aprox. 600 metros', description: 'Compras rápidas a poucos passos.' },
      ],
    },
  },
  {
    code: 'SSA001',
    name: 'Flat Barra Salvador',
    propertyType: 'Apartamento',
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 5,
    imagePool: 1,
    address: {
      street: 'Av. Oceânica',
      number: '2350',
      complement: 'Flat 1204',
      neighborhood: 'Barra',
      city: 'Salvador',
      state: 'BA',
      postalCode: '40140-130',
    },
    operational: {
      wifiNetwork: 'SeaHome_SSA001',
      wifiPassword: 'salvador2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Código 2211 na portaria e na porta',
      propertyPassword: '2211',
      hasParkingSpot: true,
      parkingSpotIdentifier: 'Vaga 7 — subsolo',
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, pool: true, elevator: true },
    host: { name: 'Beatriz Santos', phone: '+5571988776655' },
    localGuide: {
      welcomeMessage: 'Flat na orla da Barra, com fácil acesso às praias e ao Farol da Barra.',
      seasonalTips: 'Carnaval transforma Salvador — reserve transporte com antecedência. Sol forte o ano todo.',
      places: [
        { name: 'Farol da Barra', category: 'attraction', distance: 'Aprox. 2 km', description: 'Pôr do sol espetacular e Museu Náutico.' },
        { name: 'Restaurante Barravento', category: 'restaurant', distance: 'Aprox. 800 metros', description: 'Frutos do mar com vista para o mar.' },
        { name: 'Farmácia Extrafarma', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 400 metros', description: 'Farmácia na Av. Oceânica.' },
      ],
    },
  },
  {
    code: 'REC001',
    name: 'Casa Boa Viagem Recife',
    propertyType: 'Casa',
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    imagePool: 0,
    address: {
      street: 'Rua Setúbal',
      number: '1450',
      neighborhood: 'Boa Viagem',
      city: 'Recife',
      state: 'PE',
      postalCode: '51030-010',
    },
    operational: {
      wifiNetwork: 'SeaHome_REC001',
      wifiPassword: 'recife2024',
      isSelfCheckin: false,
      propertyAccessType: 'keybox',
      propertyAccessInstructions: 'Cofre na calçada, código 4455',
      propertyPassword: '4455',
      hasParkingSpot: true,
      parkingSpotInstructions: 'Garagem para 1 carro',
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '11:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, kitchen: true, washingMachine: true, bbqGrill: true, balcony: true },
    host: { name: 'Ricardo Alves', phone: '+5581988776655' },
    localGuide: {
      welcomeMessage: 'Casa aconchegante em Boa Viagem, a poucos quarteirões da praia e das piscinas naturais.',
      seasonalTips: 'Maré baixa é ideal para as piscinas naturais. Chuvas concentram-se entre abril e julho.',
      places: [
        { name: 'Praia de Boa Viagem', category: 'attraction', distance: 'Aprox. 400 metros', description: 'Orla extensa com coqueiros e ciclovia.' },
        { name: 'Bode do Nô', category: 'restaurant', distance: 'Aprox. 2 km', description: 'Referência em buchada de bode e culinária regional.' },
        { name: 'Supermercado Bompreço', category: 'essential', placeType: 'supermarket', distance: 'Aprox. 700 metros', description: 'Rede local com preços acessíveis.' },
      ],
    },
  },
  {
    code: 'BSB001',
    name: 'Apartamento Asa Sul Brasília',
    propertyType: 'Apartamento',
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 4,
    imagePool: 1,
    address: {
      street: 'SQN 308 Bloco A',
      number: '101',
      complement: 'Apto 304',
      neighborhood: 'Asa Sul',
      city: 'Brasília',
      state: 'DF',
      postalCode: '70356-010',
    },
    operational: {
      wifiNetwork: 'SeaHome_BSB001',
      wifiPassword: 'brasilia2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Código 6677 na portaria e na porta',
      propertyPassword: '6677',
      hasParkingSpot: true,
      parkingSpotIdentifier: 'Vaga 22',
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, elevator: true, balcony: true },
    host: { name: 'Patricia Rocha', phone: '+5561988776655' },
    localGuide: {
      welcomeMessage: 'Apartamento na Asa Sul, região central de Brasília com comércio e restaurantes acessíveis.',
      seasonalTips: 'Brasília é seca no inverno — hidrate-se. A Esplanada é imperdível ao entardecer.',
      places: [
        { name: 'Congresso Nacional', category: 'attraction', distance: 'Aprox. 4 km', description: 'Arquitetura de Niemeyer e visitas guiadas.' },
        { name: 'Feira da Torre', category: 'restaurant', distance: 'Aprox. 3 km', description: 'Comidas típicas e artesanato aos domingos.' },
        { name: 'Farmácia Pague Menos', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 200 metros', description: 'Farmácia na quadra comercial.' },
      ],
    },
  },
  {
    code: 'MCZ001',
    name: 'Bangalô Ponta Verde Maceió',
    propertyType: 'Casa',
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    imagePool: 0,
    address: {
      street: 'Av. Almirante Barroso',
      number: '520',
      neighborhood: 'Ponta Verde',
      city: 'Maceió',
      state: 'AL',
      postalCode: '57035-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_MCZ001',
      wifiPassword: 'maceio2024',
      isSelfCheckin: true,
      propertyAccessType: 'smart_lock',
      propertyAccessInstructions: 'Código 9900 na fechadura',
      propertyPassword: '9900',
      hasParkingSpot: true,
      parkingSpotInstructions: 'Vaga descoberta na frente',
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '10:00',
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, airConditioning: true, kitchen: true, pool: true, balcony: true },
    host: { name: 'Eduardo Menezes', phone: '+5582988776655' },
    localGuide: {
      welcomeMessage: 'Bangalô em Ponta Verde, a uma caminhada da praia mais badalada de Maceió.',
      seasonalTips: 'Mar calmo de dezembro a março é perfeito para mergulho. Chuva rara entre junho e agosto.',
      places: [
        { name: 'Praia de Ponta Verde', category: 'attraction', distance: 'Aprox. 300 metros', description: 'Águas calmas e quiosques na orla.' },
        { name: 'Massarella', category: 'restaurant', distance: 'Aprox. 1 km', description: 'Pizzas e massas artesanais na orla.' },
        { name: 'Farmácia Pague Menos', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 500 metros', description: 'Farmácia na Av. Almirante Barroso.' },
      ],
    },
  },
  {
    code: 'PAR001',
    name: 'Pousada Centro Histórico Paraty',
    propertyType: 'Casa',
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    imagePool: 1,
    address: {
      street: 'Rua da Cadeia',
      number: '15',
      neighborhood: 'Centro Histórico',
      city: 'Paraty',
      state: 'RJ',
      postalCode: '23970-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_PAR001',
      wifiPassword: 'paraty2024',
      isSelfCheckin: false,
      propertyAccessType: 'physical_key',
      propertyAccessInstructions: 'Chave na recepção da pousada ao lado',
      propertyPassword: '0000',
      hasParkingSpot: false,
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, kitchen: true, balcony: true },
    host: { name: 'Helena Vieira', phone: '+5524998877665' },
    localGuide: {
      welcomeMessage: 'Casa colonial no centro histórico de Paraty, patrimônio UNESCO.',
      seasonalTips: 'Lua cheia entre maio e setembro enche as ruas de água do mar — experiência única.',
      places: [
        { name: 'Centro Histórico', category: 'attraction', distance: 'Na porta', description: 'Ruas de pedra, igrejas e casario colonial.' },
        { name: 'Restaurante Refúgio', category: 'restaurant', distance: 'Aprox. 200 metros', description: 'Frutos do mar frescos no cais.' },
        { name: 'Farmácia São Paulo', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 400 metros', description: 'Única farmácia no centro histórico.' },
      ],
    },
  },
  {
    code: 'UBA001',
    name: 'Casa Praia Grande Ubatuba',
    propertyType: 'Casa',
    bedroomQuantity: 4,
    bathroomQuantity: 3,
    guestCapacity: 10,
    imagePool: 0,
    address: {
      street: 'Rua Praia Grande',
      number: '450',
      neighborhood: 'Praia Grande',
      city: 'Ubatuba',
      state: 'SP',
      postalCode: '11680-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_UBA001',
      wifiPassword: 'ubatuba2024',
      isSelfCheckin: false,
      propertyAccessType: 'keybox',
      propertyAccessInstructions: 'Cofre na entrada lateral, código 1122',
      propertyPassword: '1122',
      hasParkingSpot: true,
      parkingSpotInstructions: 'Estacionamento para até 3 carros',
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: true,
    },
    amenities: { wifi: true, tv: true, kitchen: true, bbqGrill: true, pool: true, washingMachine: true },
    host: { name: 'Gustavo Prado', phone: '+5512998877665' },
    localGuide: {
      welcomeMessage: 'Casa ampla na Praia Grande, ideal para grupos que buscam natureza e praia.',
      seasonalTips: 'Chove mais entre dezembro e março — leve capas de chuva para trilhas. Fora disso, sol garantido.',
      places: [
        { name: 'Praia Grande', category: 'attraction', distance: 'Aprox. 100 metros', description: 'Praia extensa com boas ondas para surf.' },
        { name: 'Restaurante Peixe na Telha', category: 'restaurant', distance: 'Aprox. 1 km', description: 'Peixe fresco grelhado na telha de barro.' },
        { name: 'Supermercado Costa Azul', category: 'essential', placeType: 'supermarket', distance: 'Aprox. 2 km', description: 'Único supermercado da região da praia.' },
      ],
    },
  },
  {
    code: 'CNT001',
    name: 'Chalé Campos do Jordão',
    propertyType: 'Casa',
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    imagePool: 1,
    address: {
      street: 'Av. Dr. Adhemar Pereira de Barros',
      number: '800',
      neighborhood: 'Capivari',
      city: 'Campos do Jordão',
      state: 'SP',
      postalCode: '12460-000',
    },
    operational: {
      wifiNetwork: 'SeaHome_CNT001',
      wifiPassword: 'campos2024',
      isSelfCheckin: false,
      propertyAccessType: 'keybox',
      propertyAccessInstructions: 'Cofre na varanda, código 3344',
      propertyPassword: '3344',
      hasParkingSpot: true,
      parkingSpotInstructions: 'Garagem coberta para 2 carros',
    },
    rules: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    amenities: { wifi: true, tv: true, kitchen: true, bbqGrill: true, jacuzzi: true, balcony: true },
    host: { name: 'Isabela Campos', phone: '+5512988776655' },
    localGuide: {
      welcomeMessage: 'Chalé no Capivari, coração de Campos do Jordão com clima europeu.',
      seasonalTips: 'Inverno (jun–ago) traz frio intenso e Festival de Inverno. Leve casaco e cachecol.',
      places: [
        { name: 'Capivari', category: 'attraction', distance: 'Aprox. 500 metros', description: 'Centro com lojas, fondue e arquitetura alpina.' },
        { name: 'Baden Baden', category: 'restaurant', distance: 'Aprox. 600 metros', description: 'Cervejaria artesanal e gastronomia alemã.' },
        { name: 'Farmácia Drogaria São Paulo', category: 'essential', placeType: 'pharmacy', distance: 'Aprox. 800 metros', description: 'Farmácia no centro de Capivari.' },
      ],
    },
  },
];

async function main() {
  await prisma.property.deleteMany();

  for (const property of PROPERTIES) {
    await prisma.property.create({
      data: {
        code: property.code,
        name: property.name,
        propertyType: property.propertyType,
        bedroomQuantity: property.bedroomQuantity,
        bathroomQuantity: property.bathroomQuantity,
        guestCapacity: property.guestCapacity,
        address: { create: property.address },
        operational: { create: property.operational },
        rules: { create: property.rules },
        amenities: { create: property.amenities },
        images: { create: imagesFromPool(property.imagePool) },
        host: { create: property.host },
        localGuide: {
          create: {
            aiGeneratedAt: new Date(),
            welcomeMessage: property.localGuide.welcomeMessage,
            seasonalTips: property.localGuide.seasonalTips,
            places: { create: property.localGuide.places },
          },
        },
      },
    });
  }

  const codes = PROPERTIES.map((p) => p.code).join(', ');
  console.log(`✅ Seed concluído: ${PROPERTIES.length} imóveis inseridos (${codes}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
