import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createComment, getCommentsByPostId } from "~/.server/models/comment.model";
import { getPost } from "~/.server/models/post.model";
import UserJournal from "~/components/post";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { knownUser } from "~/gaurds.server";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import UserComment from "~/components/comment";
import { Comment } from "@prisma/client";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.journalId, "Missing journal param");
  const post = await getPost(params.journalId);
  if (!post) {
    throw new Response("Ops! No journal with this id", { status: 404 });
  }
  const user = await knownUser(request);
  const comments = await getCommentsByPostId(params.journalId);

  return json({ post, comments, user });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  await createComment({
    content: String(data.content),
    parentId: null, // No parent comment as this is a root comment
    ownerHandle: String(data.username),
    postId: String(data.postId),
  });
  return null;
};

export default function Journal() {
  const data = useLoaderData<typeof loader>();
  const { post } = data;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isCommenting = navigation.formData?.get('intent') === 'postingComment';

  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1500;

  return (
    <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
      <UserJournal
        key={post.id}
        id={post.id}
        title={post.title}
        content={post.content}
        username={post.ownerHandle}
        commentCount={post.commentCount}
      />
      {data.user ? (
        <div className="w-full max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-gray-800">
          <Card className="mt-4 rounded-none border-y border-l-0 border-r-0">
            <VisuallyHidden.Root>
              <CardHeader>
                <CardTitle>
                  {t("Leave a comment")}
                </CardTitle>
              </CardHeader>
            </VisuallyHidden.Root>
            <CardContent className="pb-1 pt-1">
              <Form method="post" className="space-y-1">
                <Input type="hidden" name="intent" value="postingComment" />
                <Input type="hidden" name="username" value={data.user.username} />
                <Input type="hidden" name="postId" value={post.id} />
                <Textarea
                  placeholder="Share your thoughts..."
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
                <div className='flex justify-end'>
                  <Button type="submit">
                    {isCommenting ? t("Replying...") : t("Reply")}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      ) : <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
        {t("Log in or sign up to reply")}
      </div>}
      {data.comments.length > 0 &&
        <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
          {t("Replies to this journal")}
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