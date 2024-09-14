import { Comment } from "@prisma/client";
import { prisma } from "../db";

// Function to create a comment
export const createComment = async (comment: Omit<Comment, "id" | "createdAt" | "updatedAt" | "commentCount">) => {
    return await prisma.comment.create({
        data: comment,
    });
}

// Function to get a comment by its ID
export const getComment = async (commentId: string) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
            _count: {
                select: { replies: true },
            },
        },
    });

    return {
        ...comment,
        commentCount: comment?._count?.replies ?? 0,
    };
}

// Function to get child comments for a given parent comment ID
export const getChildComments = async (parentId: string) => {
    const comments = await prisma.comment.findMany({
        where: { parentId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { replies: true },
            },
        },
    });

    return comments.map(comment => ({
        ...comment,
        commentCount: comment?._count?.replies ?? 0,
    }));
}

// Function to get comments by post ID
export const getCommentsByPostId = async (postId: string) => {
    const comments = await prisma.comment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { replies: true },
            },
        },
    });

    return comments.map(comment => ({
        ...comment,
        commentCount: comment?._count?.replies ?? 0,
    }));
}

// Function to get comments
export const getComments = async () => {
    const comments = await prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { replies: true },
            },
        },
    });

    return comments.map(comment => ({
        ...comment,
        commentCount: comment?._count?.replies ?? 0,
    }));
};

// Function to get comments by username
export const getCommentsByUsername = async (username: string) => {
    const comments = await prisma.comment.findMany({
        where: { ownerHandle: username },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { replies: true },
            },
        },
    });

    return comments.map(comment => ({
        ...comment,
        commentCount: comment?._count?.replies ?? 0,
    }));
};


// Function to get the total count of comments
export const getTotalCommentsCount = async () => {
    return prisma.comment.count();
};
