import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});
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
