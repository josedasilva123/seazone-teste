import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL não definida');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.localGuide.updateMany({
    where: { aiGeneratedAt: null },
    data: { aiGeneratedAt: new Date() },
  });
  console.log(`✅ ${result.count} guia(s) marcado(s) como gerado(s)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
