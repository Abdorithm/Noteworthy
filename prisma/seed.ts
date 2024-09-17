import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          username: faker.internet.userName(),
        },
      })
    )
  );

  await Promise.all(
    users.map((user) =>
      Promise.all(
        Array.from({ length: 10 }).map(() =>
          prisma.post.create({
            data: {
              content: faker.lorem.paragraph(),
              title: faker.lorem.sentence(),
              favorite: faker.datatype.boolean(),
              ownerHandle: user.username,
            },
          })
        )
      )
    )
  );
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