import { Comment } from "@prisma/client";
import { prisma } from "../db";

// Function to create a comment
export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "commentCount">) => {
    const createdComment = await prisma.comment.create({
        data: comment,
    });

    if (comment.parentId) {
        // This is a child comment, increase the commentCount of the parent comment
        await prisma.comment.update({
            where: { id: comment.parentId },
            data: { commentCount: { increment: 1 } },
        });
    } else {
        // This is a root comment, increase the commentCount of the post
        await prisma.post.update({
            where: { id: comment.postId },
            data: { commentCount: { increment: 1 } },
        });
    }
    return createdComment;
}

// Function to get a comment by its ID
export const getComment = async (commentId: string) => {
    return prisma.comment.findUnique({
        where: { id: commentId },
    });
}

// Function to get child comments for a given parent comment ID
export const getChildComments = async (parentId: string) => {
    return prisma.comment.findMany({
        where: { parentId },
        orderBy: { createdAt: 'desc' },
    });
}

// Function to get comments by post ID
export const getCommentsByPostId = async (postId: string) => {
    return prisma.comment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: 'desc' },
    });
}

// Function to get comments
export const getComments = async () => {
    return prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

// Function to get comments by username
export const getCommentsByUsername = async (username: string) => {
    return prisma.comment.findMany({
        where: { ownerHandle: username },
        orderBy: { createdAt: 'desc' },
    });
};

// Function to get the total count of comments
export const getTotalCommentsCount = async () => {
    return prisma.comment.count();
};
