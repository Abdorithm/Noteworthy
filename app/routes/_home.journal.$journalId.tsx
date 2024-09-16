import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createComment, getCommentsByPostId } from "~/.server/models/comment.model";
import { getPost } from "~/.server/models/post.model";
import UserJournal from "~/components/post";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { knownUser, requireUser } from "~/gaurds.server";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import UserComment from "~/components/comment";
import { Comment } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.journalId, "Missing journalId param");
  const post = await getPost(params.journalId);
  if (!post) {
    throw new Response("Ops! No journal with this id", { status: 404 });
  }
  const user = await knownUser(request);
  const url = new URL(request.url);

  const cursor = url.searchParams.get('cursor');
  const pageSize = 5;
  const parsedCursor = cursor ? JSON.parse(cursor) : null;
  const replies = await getCommentsByPostId(post.id!, parsedCursor, pageSize);
  const nextCursor = replies.length === pageSize ? { createdAt: replies[replies.length - 1].createdAt, id: replies[replies.length - 1].id } : null;

  return json({ user, journal: post, initialReplies: replies, initialNextCursor: nextCursor });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const user = await requireUser(request);

  await createComment({
    content: String(data.content),
    parentId: null, // No parent comment as this is a root comment
    ownerHandle: String(user.username),
    postId: String(data.postId),
  });

  return json(
    {
      "message": "success"
    }
  );
};

export default function Journal() {
  const data = useLoaderData<typeof loader>();
  const { initialReplies, initialNextCursor } = data;
  const actionData = useActionData<typeof action>();
  const { journal } = data;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const isCommenting = navigation.formData?.get('intent') === 'postingComment';
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1500;

  const [replies, setReplies] = useState<Comment[]>(initialReplies);
  const [nextCursor, setNextCursor] = useState<{ createdAt: Date; id: string } | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load more replies
  const handleLoadMore = async () => {
    setIsLoading(true);
    const url = new URL(`/api/journal/${data.journal.id}/replies`, window.location.origin);
    if (nextCursor) url.searchParams.set('cursor', JSON.stringify(nextCursor));

    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      setReplies(prevReplies => [...prevReplies, ...data.replies]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setShowSuccess(false);
      setCharCount(0);
    }
  };

  // useEffect hook to set showSuccess when actionData changes
  useEffect(() => {
    if (actionData?.message === "success") {
      setShowSuccess(true);
    }
  }, [actionData]);

  return (
    <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
      <UserJournal
        key={journal.id}
        id={journal.id}
        title={journal.title}
        content={journal.content}
        username={journal.ownerHandle}
        commentCount={journal.commentCount}
        createdAt={journal.createdAt}
      />
      {data.user ? (
        <div className="w-full max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-gray-800">
          <div className="my-2 flex justify-center">
            <Dialog onOpenChange={handleDialogChange}>
              <DialogTrigger>
                <span className='text-rose-600 font-semibold hover:underline'>
                  {t("Write a reply")}
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("Write your reply")}</DialogTitle>
                  <DialogDescription>
                    {t("Share your thoughts with the community")}
                  </DialogDescription>
                </DialogHeader>
                <Form method="post" className="space-y-1">
                  <Input type="hidden" name="intent" value="postingComment" />
                  <Input type="hidden" name="postId" value={journal.id} />
                  <Textarea
                    placeholder={t("Share your thoughts...")}
                    id="content"
                    name="content"
                    rows={1}
                    onChange={(e) => setCharCount(e.target.value.length)}
                    maxLength={MAX_CHARS}
                    required
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {charCount}/{MAX_CHARS}
                  </div>
                  <div className='flex justify-center'>
                    <Button type="submit">
                      {isCommenting ? t("Replying...") : t("Reply")}
                    </Button>
                  </div>
                  {showSuccess && (
                    <p className="text-sky-600 font-semibold text-sm">
                      {t("Reply posted")}
                    </p>
                  )}
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
        {t("Log in or sign up to reply")}
      </div>}
      {replies.length > 0 &&
        <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
          {t("Replies to this journal")}
        </div>}
      {replies.length > 0 ? replies.map((comment: Omit<Comment, "updatedAt">) => (
        <UserComment
          key={comment.id}
          id={comment.id}
          username={comment.ownerHandle}
          parentId={comment.parentId}
          postId={comment.postId}
          content={comment.content}
          commentCount={comment.commentCount}
          createdAt={comment.createdAt}
        />
      )) : <div className="flex items-center justify-center pt-2 font-semibold text-muted-foreground">
        {t("No replies yet")}
      </div>}
      <div className='flex justify-center'>
        {nextCursor && (
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full mt-4"
            variant="ghost"
          >
            {isLoading ? t('Loading...') : t('Load More')}
          </Button>
        )}
      </div>
    </div>
  );
}