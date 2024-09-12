import { User } from "@prisma/client";
import { prisma } from "../db";

export const createUser = async (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    return prisma.user.create({ 
        data: user,
    });
}

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
}

export const getUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
        where: {
            username,
        },
    });
}

export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export const getUserByEmailOrUsername = async (identifier: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier }
            ]
        },
    });

    return user ? user.id : null;
}