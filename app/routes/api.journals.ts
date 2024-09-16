import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getPosts } from "~/.server/models/post.model";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const pageSize = 10;
    const parsedCursor = cursor ? JSON.parse(cursor) : null;
    const posts = await getPosts(parsedCursor, pageSize);
    const nextCursor = posts.length === pageSize ? { createdAt: posts[posts.length - 1].createdAt, id: posts[posts.length - 1].id } : null;
    
    return json({ posts, nextCursor });
};