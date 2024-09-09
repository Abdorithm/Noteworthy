import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      firstName: "Abdo",
      lastName: "Magdi",
      email: "abdo@king.com",
      username: "username",
    },
  });
}

main()
  .then(() => {
    console.log(chalk.green("Seed successful"));
  })
  .catch((e) => {
    console.error(e);
    console.log("Error: Seed failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });