import { MagicToken } from "@prisma/client";
import { prisma } from "../db";

export const createMagicToken = async (userId: string, expiresInMinutes: number) => {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000); // Calculate expiration time

    const magicToken: Omit<MagicToken, "id" | "createdAt" | "updatedAt"> = {
        userId,
        expiresAt,
    };

    return prisma.magicToken.create({ 
        data: magicToken,
    });
}

export const checkMagicToken = async (userId: string) => {
    const currentDateTime = new Date(); // Get the current date and time

    const magicToken = await prisma.magicToken.findFirst({ 
        where: {
            userId,
            expiresAt: {
                gte: currentDateTime, // Check if the token's expiration date is greater than or equal to the current date and time
            },
        },
    });

    return magicToken !== null; // Return true if a non-expired token is found, otherwise return false
}

export const checkExpiredToken = async (tokenId: string) => {
    const currentDateTime = new Date(); // Get the current date and time

    const magicToken = await prisma.magicToken.findFirst({ 
        where: {
            id: tokenId,
            expiresAt: {
                gte: currentDateTime, // Check if the token's expiration date is greater than or equal to the current date and time
            },
        },
    });

    return magicToken == null; // Return true if the token is expired or not found, otherwise return false
}

export const getUserIdByMagicTokenId = async (tokenId: string) => {
    const magicToken = await prisma.magicToken.findUnique({
        where: {
            id: tokenId,
        },
    });

    if (magicToken) {
        return magicToken.userId;
    } else {
        return null;
    }
}