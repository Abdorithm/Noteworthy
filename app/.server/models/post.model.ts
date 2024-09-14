import { Post } from "@prisma/client";
import { prisma } from "../db";

export const createPost = async (post: Pick<Post, "title" | "content" | "ownerHandle" | "favorite">) => {
    return prisma.post.create({
        data: post,
    });
}

export const getPost = async (postId: string) => {
    return prisma.post.findUnique({
        where: { id: postId },
    });
};

export const getPosts = async () => {
    return prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

export const getPostsByUsername = async (username: string) => {
    const posts = await getPosts();
    return posts.filter(post => post.ownerHandle === username);
};

export const getTotalPostsCount = async () => {
    return prisma.post.count();
};