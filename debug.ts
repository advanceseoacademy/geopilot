import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const accounts = await prisma.account.findMany();
  const sessions = await prisma.session.findMany();
  console.log("Users:", users);
  console.log("Accounts:", accounts);
  console.log("Sessions:", sessions);
}

main().catch(console.error).finally(() => prisma.$disconnect());
