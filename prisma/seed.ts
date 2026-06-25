import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { DEFAULT_PLAN_NAME } from '../src/modules/subscriptions/domain/value-objects/plan-limits.value-object';

config();

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main(): Promise<void> {
  await prisma.plan.upsert({
    where: { name: DEFAULT_PLAN_NAME },
    update: {},
    create: {
      name: DEFAULT_PLAN_NAME,
      price: 0,
      limitsJson: { maxDocuments: 10, maxDataTables: 3 },
    },
  });

  await prisma.plan.upsert({
    where: { name: 'pro' },
    update: {},
    create: {
      name: 'pro',
      price: 49,
      limitsJson: { maxDocuments: 200, maxDataTables: 50 },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
