import { User } from "@prisma/client";
import { prisma } from "../db";

export const createUser = async (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    return prisma.user.create({
        data: user,
    });
}