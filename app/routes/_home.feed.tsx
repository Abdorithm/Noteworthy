import { Separator } from '@radix-ui/react-dropdown-menu';
import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { knownUser, requireUser } from '~/gaurds.server';
import UserJournal from '~/components/post'
import React, { useEffect, useState } from 'react';
import { createPost, getPosts } from '~/.server/models/post.model';
import { Post } from '@prisma/client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await knownUser(request);
  const url = new URL(request.url);

  const cursor = url.searchParams.get('cursor');
  const pageSize = 10;
  const parsedCursor = cursor ? JSON.parse(cursor) : null;
  const posts = await getPosts(parsedCursor, pageSize);
  const nextCursor = posts.length === pageSize ? { createdAt: posts[posts.length - 1].createdAt, id: posts[posts.length - 1].id } : null;

  return json({ user, initialJournals: posts, initialNextCursor: nextCursor });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const user = await requireUser(request);

  await createPost({
    title: String(data.title),
    content: String(data.content),
    ownerHandle: String(user.username),
    favorite: false
  });

  return json(
    {
      "message": "success"
    }
  );
};

export default function Feed() {
  const data = useLoaderData<typeof loader>();
  const { initialJournals, initialNextCursor } = data;
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isPosting = navigation.formData?.get('intent') === 'postingJournal';
  const [charCount, setCharCount] = useState(0);
  const [charTitleCount, setCharTitleCount] = useState(0);
  const MAX_CHARS_CONTENT = 1500;
  const MAX_CHARS_TITLE = 100;
  const [showSuccess, setShowSuccess] = useState(false);

  const [journals, setJournals] = useState<Post[]>(initialJournals);
  const [nextCursor, setNextCursor] = useState<{ createdAt: Date; id: string } | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load more journals
  const handleLoadMore = async () => {
    setIsLoading(true);
    const url = new URL('/api/journals', window.location.origin);
    if (nextCursor) url.searchParams.set('cursor', JSON.stringify(nextCursor));

    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      setJournals(prevJournals => [...prevJournals, ...data.posts]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // character count for title and content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'title') {
      setCharTitleCount(e.target.value.length)
    }
    else if (e.target.name === 'content') {
      setCharCount(e.target.value.length)
    }
  };

  // Function to handle dialog open/close
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setShowSuccess(false);
      setCharCount(0);
      setCharTitleCount(0);
    }
  };

  // useEffect hook to set showSuccess when actionData changes
  useEffect(() => {
    if (actionData?.message === "success") {
      setShowSuccess(true);
    }
  }, [actionData]);

  return (
    <div>
      {data.user ? (
        <div className="w-full max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-gray-800">
          <Card className="mt-4 rounded-none border-y border-l-0 border-r-0">
            <CardHeader>
              <CardTitle></CardTitle>
              <span className='text-sm'>
                {t("Welcome, @{{ username }}. Got something on your mind?", { username: data.user.username })}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Dialog onOpenChange={handleDialogChange}>
                  <DialogTrigger>
                    <span className='text-rose-600 font-semibold hover:underline'>
                      {t("Share a journal")}
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{t("Write a journal")}</DialogTitle>
                      <DialogDescription>
                        {t("Share your thoughts with the community")}
                      </DialogDescription>
                    </DialogHeader>
                    <Form method="post" className="space-y-1">
                      <Input type="hidden" name="intent" value="postingJournal" />
                      <Input
                        placeholder={t("Journal title")}
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
                        placeholder={t("Share your thoughts...")}
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
                      {showSuccess && (
                        <p className="text-sky-600 font-semibold text-sm">
                          {t("Journal posted")}
                        </p>
                      )}
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Separator className="max-w-2xl mx-auto" />
        </div>
      ) : <div className="flex items-center justify-center py-2 font-semibold text-muted-foreground">
        {t("Log in or sign up to post a journal")}
      </div>}
      <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
        {journals.length > 0 ? journals.map((post: Omit<Post, "updatedAt">) => (
          <UserJournal
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            username={post.ownerHandle}
            commentCount={post.commentCount}
            createdAt={post.createdAt}
          />
        )) : <div className="flex items-center justify-center pt-2 font-semibold text-muted-foreground">
          {t("No journals yet")}
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
    </div>
  );
}