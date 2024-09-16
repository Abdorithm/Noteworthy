import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getCommentsByPostId } from "~/.server/models/comment.model";
import { getPost } from "~/.server/models/post.model";

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    invariant(params.journalId, "Missing journalId param");
    const journal = await getPost(params.journalId);
    if (!journal) {
      throw new Response("Ops! No journal with this id", { status: 404 });
    }

	const url = new URL(request.url);
	const cursor = url.searchParams.get('cursor');
	const pageSize = 5;
	const parsedCursor = cursor ? JSON.parse(cursor) : null;

	// Extract journal from the URL path
	const pathSegments = url.pathname.split('/');
	const journalId = pathSegments[3]; // URL structure is /api/journal/$journalId/replies

	const replies = await getCommentsByPostId(journalId, parsedCursor, pageSize);
	const nextCursor = replies.length === pageSize ? { createdAt: replies[replies.length - 1].createdAt, id: replies[replies.length - 1].id } : null;
	
	return json({ replies, nextCursor });
};