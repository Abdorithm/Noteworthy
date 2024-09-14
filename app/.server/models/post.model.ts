import { Post } from "@prisma/client";
import { prisma } from "../db";

export const createPost = async (post: Pick<Post, "title" | "content" | "ownerHandle" | "favorite">) => {
    return prisma.post.create({
        data: post,
    });
}

export const getPost = async (postId: string) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            _count: {
                select: { comments: true },
            },
        },
    });

    return {
        ...post,
        commentCount: post?._count?.comments ?? 0,
    };
};

export const getPosts = async () => {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { comments: true },
            },
        },
    });

    return posts.map(post => ({
        ...post,
        commentCount: post?._count?.comments ?? 0,
    }));
};

export const getPostsByUsername = async (username: string) => {
    const posts = await prisma.post.findMany({
        where: { ownerHandle: username },
        include: {
            _count: {
                select: { comments: true },
            },
        },
    });

    return posts.map(post => ({
        ...post,
        commentCount: post?._count?.comments ?? 0,
    }));
};

export const getTotalPostsCount = async () => {
    return prisma.post.count();
};