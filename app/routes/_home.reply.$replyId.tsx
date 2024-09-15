import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { createComment, getChildComments, getComment } from "~/.server/models/comment.model";
import UserComment from "~/components/comment";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { knownUser } from "~/gaurds.server";
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
  invariant(params.replyId, "Missing replyId param");
  const currComment = await getComment(params.replyId);
  if (!currComment) {
    throw new Response("Ops! No comment with this id", { status: 404 });
  }
  const user = await knownUser(request);
  const comments = await getChildComments(params.replyId);

  return json({ currComment, comments, user });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  await createComment({
    content: String(data.content),
    parentId: String(data.parentId),
    ownerHandle: String(data.username),
    postId: String(data.postId),
  });

  return null;
};

export default function CommentPage() {
  const data = useLoaderData<typeof loader>();
  const { currComment } = data;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isReplying = navigation.formData?.get('intent') === 'postingReply';

  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1500;

  return (
    <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
      <UserComment
        key={currComment.id}
        id={currComment.id}
        content={currComment.content}
        username={currComment.ownerHandle}
        postId={currComment.postId}
        parentId={currComment.parentId}
        commentCount={currComment.commentCount}
      />
      {data.user ? (
        <div className="w-full max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-gray-800">
          <div className="my-2 flex justify-center">
            <Dialog>
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
                  <Input type="hidden" name="intent" value="postingReply" />
                  <Input type="hidden" name="username" value={data.user.username} />
                  <Input type="hidden" name="postId" value={currComment.postId} />
                  <Input type="hidden" name="parentId" value={currComment.id} />
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
                      {isReplying ? t("Replying...") : t("Reply")}
                    </Button>
                  </div>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
        {t("Log in or sign up to reply")}
      </div>}
      {data.comments.length > 0 &&
        <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
          {t("Replies to this reply")}
        </div>}
      {data.comments.length > 0 ? data.comments.map((comment: Omit<Comment, "createdAt" | "updatedAt">) => (
        <UserComment
          key={comment.id}
          id={comment.id}
          username={comment.ownerHandle}
          parentId={comment.parentId}
          postId={comment.postId}
          content={comment.content}
          commentCount={comment.commentCount}
        />
      )) : <div className="flex items-center justify-center pt-2 font-semibold text-muted-foreground">
        {t("No replies yet")}
      </div>}
    </div>
  );
}