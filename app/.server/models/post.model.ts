import { Post } from "@prisma/client";
import { prisma } from "../db";

export const createPost = async (post: Pick<Post, "title" | "content" | "ownerHandle" | "favorite">) => {
    return prisma.post.create({
        data: post,
    });
}

export const getPosts = async ({ offset, limit }: { offset: number, limit: number }) => {
    return prisma.post.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
    });
};

export const getPostsByUsername = async (username: string, { offset, limit }: { offset: number, limit: number }) => {
    const posts = await getPosts({ offset, limit });
    return posts.filter(post => post.ownerHandle === username);
};

export const getTotalPostsCount = async () => {
    return prisma.post.count();
};