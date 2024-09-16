import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getPostsByUsername } from "~/.server/models/post.model";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const cursor = url.searchParams.get('journalCursor');
	const pageSize = 10;
	const parsedCursor = cursor ? JSON.parse(cursor) : null;

	// Extract username from the URL path
	const pathSegments = url.pathname.split('/');
	const username = pathSegments[2]; // URL structure is /api/$userId/journals

	const posts = await getPostsByUsername(username, parsedCursor, pageSize);
	const nextCursor = posts.length === pageSize ? { createdAt: posts[posts.length - 1].createdAt, id: posts[posts.length - 1].id } : null;
	
	return json({ posts, nextCursor });
};