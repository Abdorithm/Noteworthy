import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getCommentsByUsername } from "~/.server/models/comment.model";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const cursor = url.searchParams.get('commentCursor');
	const pageSize = 5;
	const parsedCursor = cursor ? JSON.parse(cursor) : null;

	// Extract username from the URL path
	const pathSegments = url.pathname.split('/');
	const username = pathSegments[2]; // URL structure is /api/$userId/replies

	const replies = await getCommentsByUsername(username, parsedCursor, pageSize);
	const nextCursor = replies.length === pageSize ? { createdAt: replies[replies.length - 1].createdAt, id: replies[replies.length - 1].id } : null;
	
	return json({ replies, nextCursor });
};