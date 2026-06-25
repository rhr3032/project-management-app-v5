import { getPrisma } from '../lib/prisma';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  console.log("Checking DB URL:", process.env.DATABASE_URL);
  const prisma = getPrisma();
  try {
    console.log("Counting projects...");
    const count = await prisma.project.count();
    console.log("Current count of projects:", count);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

main();
