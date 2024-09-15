import { Separator } from '@radix-ui/react-dropdown-menu';
import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { knownUser } from '~/gaurds.server';
import UserJournal from '~/components/post'
import React, { useState } from 'react';
import { createPost, getPosts } from '~/.server/models/post.model';
import { Post } from '@prisma/client';

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await knownUser(request);
  const posts = await getPosts();

  return json({ user, posts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  await createPost({
    title: String(data.title),
    content: String(data.content),
    ownerHandle: String(data.username),
    favorite: false
  });
  return null;
};

export default function Feed() {
  const data = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isPosting = navigation.formData?.get('intent') === 'postingJournal';

  const [charCount, setCharCount] = useState(0);
  const [charTitleCount, setCharTitleCount] = useState(0);
  const MAX_CHARS_CONTENT = 1500;
  const MAX_CHARS_TITLE = 100;
  const [searchParams, setSearchParams] = useSearchParams();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'title') {
      setCharTitleCount(e.target.value.length)
    }
    else if (e.target.name === 'content') {
      setCharCount(e.target.value.length)
    }
  };

  return (
    <div>
      {data.user ? (
        <div className="w-full max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-gray-800">
          <Card className="my-4 rounded-none border-y border-l-0 border-r-0">
            <CardHeader>
              <CardTitle></CardTitle>
              <span className='text-sm'>
                {t("Welcome, @{{ username }}. Got something on your mind?", { username: data.user.username })}
              </span>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-1">
                <Input type="hidden" name="intent" value="postingJournal" />
                <Input type="hidden" name="username" value={data.user.username} />
                <Input
                  placeholder="Journal title"
                  id="title"
                  name="title"
                  onChange={handleContentChange}
                  maxLength={MAX_CHARS_TITLE}
                  required
                />
                <div className="text-sm text-gray-500 text-right">
                  {charTitleCount}/{MAX_CHARS_TITLE}
                </div>
                <Textarea
                  placeholder="Share your thoughts..."
                  id="content"
                  name="content"
                  rows={3}
                  onChange={handleContentChange}
                  maxLength={MAX_CHARS_CONTENT}
                  required
                />
                <div className="text-sm text-gray-500 text-right">
                  {charCount}/{MAX_CHARS_CONTENT}
                </div>
                <div className='flex justify-center'>
                  <Button type="submit" className="w-1/4">
                    {isPosting ? t("Posting...") : t("Post")}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
          <Separator className="max-w-2xl mx-auto" />
        </div>
      ) : <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
        {t("Log in or sign up to post a journal")}
      </div>}
      <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
        {data.posts.length > 0 ? data.posts.map((post: Pick<Post, "id" | "title" | "content" | "ownerHandle" | "commentCount">) => (
          <UserJournal
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            username={post.ownerHandle}
            commentCount={post.commentCount}
          />
        )) : <div className="flex items-center justify-center pt-2 font-semibold text-muted-foreground">
          {t("No journals yet")}
        </div>}
      </div>
    </div>
  );
}