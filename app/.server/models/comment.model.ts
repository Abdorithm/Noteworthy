import { Comment } from "@prisma/client";
import { prisma } from "../db";

// Function to create a comment
export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "commentCount">) => {
    const newComment = await prisma.comment.create({
        data: comment,
    });

    let parentId = comment.parentId;

    while (parentId) {
        await prisma.comment.update({
            where: { id: parentId },
            data: {
                commentCount: {
                    increment: 1,
                },
            },
        });

        const parentComment = await prisma.comment.findUnique({
            where: { id: parentId },
            select: { parentId: true },
        });

        parentId = parentComment?.parentId || null;
    }

    return newComment;
}

// Function to get a comment by its ID
export const getComment = async (commentId: string) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });

    return comment;
}

// Function to get child comments for a given parent comment ID
export const getChildComments = async (parentId: string, cursor: { createdAt: string, id: string } | null, pageSize: number) => {
    const comments = await prisma.comment.findMany({
        where: cursor ? {
            AND: [
                { parentId },
                {
                    OR: [
                        { createdAt: { lt: new Date(cursor.createdAt) } },
                        { createdAt: new Date(cursor.createdAt), id: { lt: cursor.id } }
                    ]
                }
            ]
        } : { parentId },
        take: pageSize,
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' }
        ],
    });

    return comments;
}

// Function to get comments by post ID
export const getCommentsByPostId = async (postId: string, cursor: { createdAt: string, id: string } | null, pageSize: number) => {
    const comments = await prisma.comment.findMany({
        where: cursor ? {
            AND: [
                { postId, parentId: null },
                {
                    OR: [
                        { createdAt: { lt: new Date(cursor.createdAt) } },
                        { createdAt: new Date(cursor.createdAt), id: { lt: cursor.id } }
                    ]
                }
            ]
        } : { postId, parentId: null },
        take: pageSize,
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' }
        ],
    });

    return comments;
}

// Function to get comments by username
export const getCommentsByUsername = async (username: string, cursor: { createdAt: string, id: string } | null, pageSize: number) => {
    const comments = await prisma.comment.findMany({
        where: cursor ? {
            AND: [
                { ownerHandle: username },
                {
                    OR: [
                        { createdAt: { lt: new Date(cursor.createdAt) } },
                        { createdAt: new Date(cursor.createdAt), id: { lt: cursor.id } }
                    ]
                }
            ]
        } : { ownerHandle: username },
        take: pageSize,
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' }
        ],
    });

    return comments;
};


export const commentsCount = async (ownerHandle: string | null, postId: string | null, parentId: string | null) => {
    if (ownerHandle) {
        return await prisma.comment.count({
            where: {
                ownerHandle
            },
        });
    }
    else if (postId) {
        return await prisma.comment.count({
            where: {
                postId
            },
        });
    }
    else if (parentId) {
        return await prisma.comment.count({
            where: {
                parentId
            },
        });
    }
    else {
        return await prisma.comment.count();
    }
} 