import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getChildComments, getComment } from "~/.server/models/comment.model";

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    invariant(params.replyId, "Missing replyId param");
    const reply = await getComment(params.replyId);
    if (!reply) {
      throw new Response("Ops! No reply with this id", { status: 404 });
    }

	const url = new URL(request.url);
	const cursor = url.searchParams.get('cursor');
	const pageSize = 5;
	const parsedCursor = cursor ? JSON.parse(cursor) : null;

	// Extract reply from the URL path
	const pathSegments = url.pathname.split('/');
	const replyId = pathSegments[3]; // URL structure is /api/reply/$replyId/replies

	const replies = await getChildComments(replyId, parsedCursor, pageSize);
	const nextCursor = replies.length === pageSize ? { createdAt: replies[replies.length - 1].createdAt, id: replies[replies.length - 1].id } : null;
	
	return json({ replies, nextCursor });
};