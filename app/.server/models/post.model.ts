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

export const getPosts = async (cursor: { createdAt: string, id: string } | null, pageSize: number) => {
    const posts = await prisma.post.findMany({
        where: cursor ? { 
            OR: [
                { createdAt: { lt: new Date(cursor.createdAt) } },
                { createdAt: new Date(cursor.createdAt), id: { lt: cursor.id } }
            ]
        } : {},
        take: pageSize,
        orderBy: [
            { createdAt: 'desc' },
            { id: 'desc' }
        ],
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

export const getPostsByUsername = async (username: string, cursor: { createdAt: string, id: string } | null, pageSize: number) => {
    const posts = await prisma.post.findMany({
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

export const postsCount = async (ownerHandle: string | null) => {
    if (ownerHandle) {
        return prisma.post.count({
            where: { 
                ownerHandle 
            },
        });
    }
    else {
        return prisma.post.count();
    }
}