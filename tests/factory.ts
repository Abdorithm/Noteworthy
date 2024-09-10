import { createUser as createDbUser } from "~/.server/models/user.model";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

const createUser = (username: User["username"]) => () =>
  createDbUser({
    username,
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  });

export const createUserWithUsername = createUser("test-user");