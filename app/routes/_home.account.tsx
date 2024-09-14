import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import { requireUser } from '~/gaurds.server';
import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Separator } from '~/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getUserByEmail, getUserById, getUserByUsername, updateUser } from '~/.server/models/user.model';
import { getPostsByUsername } from '~/.server/models/post.model';
import UserJournal from '~/components/post';
import UserComment from '~/components/comment';
import { Post, Comment } from '@prisma/client';
import { getCommentsByUsername } from '~/.server/models/comment.model';


const registerSchema = z.object({
  'firstName': z.string().min(2, 'First name must be at least 2 characters').max(15, 'First name must be at most 15 characters'),
  'lastName': z.string().min(2, 'Last name must be at least 2 characters').max(15, 'Last name must be at most 15 characters'),
  'username': z.string().regex(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers').max(20, 'Username must be at most 20 characters'),
  'email': z.string().email('Invalid email address'),
});

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  const posts = await getPostsByUsername(user.username);
  const comments = await getCommentsByUsername(user.username);

  return json({ user, posts, comments });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // client-side validation
  try {
    registerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.errors });
    }
  }

  // server-side validation
  // we required the user in the loader so this can't be null
  const originalUser = await getUserById(String(data.id));

  if (String(data.email) === String(originalUser!.email) && String(data.username) === String(originalUser!.username)
    && String(data['firstName']) === String(originalUser!.firstName)
    && String(data['lastName']) === String(originalUser!.lastName)) {
    return json(
      {
        "errors": [
          {
            "message": "No changes detected",
            "path": [
              "same-info"
            ]
          }
        ]
      }
    );
  }
  else if (await getUserByEmail(String(data.email))
    && String(originalUser!.email) !== String(data.email)) {
    return json(
      {
        "errors": [
          {
            "message": "Email already registered",
            "path": [
              "email"
            ]
          }
        ]
      }
    );
  }
  else if (await getUserByUsername(String(data.username))
    && String(originalUser!.username) !== String(data.username)) {
    return json(
      {
        "errors": [
          {
            "message": "Username already taken",
            "path": [
              "username"
            ]
          }
        ]
      }
    );
  }
  else {
    await updateUser(String(originalUser!.id), {
      firstName: String(data['firstName']),
      lastName: String(data['lastName']),
      username: String(data.username),
      email: String(data.email),
      updatedAt: new Date(),
    });
  }

  return json(
    {
      "errors": [
        {
          "message": "Account updated successfully",
          "path": [
            "success"
          ]
        }
      ]
    }
  );
}

export default function Account() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isSaving = navigation.formData?.get('intent') === 'savingChanges';

  const [controlledUser, setUser] = useState({
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    username: data.user.username,
    email: data.user.email,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prevUser => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto mb-4">
        <CardHeader>
          <CardTitle>{t("Account info")}</CardTitle>
          <CardDescription>{t("View and update your account details")}</CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{data.user.firstName} {data.user.lastName}</h3>
                  <p className="text-sm text-muted-foreground">@{data.user.username}</p>
                  <p className="text-sm text-muted-foreground">{data.user.email}</p>
                </div>
                <Button onClick={handleEditToggle}>{t("Edit")}</Button>
              </div>
            </div>
          ) : (
            <Form method='post' className="space-y-4">
              <Input type="hidden" name="intent" value="savingChanges" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("First name")}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={controlledUser.firstName}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="hidden"
                    name="id"
                    defaultValue={data.user.id}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("Last name")}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={controlledUser.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {actionData?.errors?.find(error => error.path.includes('firstName')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('firstName'))?.message}
                </p>
              )}
              {actionData?.errors?.find(error => error.path.includes('lastName')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('lastName'))?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">{t("Username")}</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={controlledUser.username}
                  onChange={handleInputChange}
                />
              </div>
              {actionData?.errors?.find(error => error.path.includes('username')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('username'))?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={controlledUser.email}
                  onChange={handleInputChange}
                />
              </div>
              {actionData?.errors?.find(error => error.path.includes('email')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('email'))?.message}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <Button className='ml-2' type="button" variant="outline" onClick={handleEditToggle}>{t("Cancel")}</Button>
                <Button type="submit">
                  {isSaving ? t("Saving changes...") : t("Save changes")}
                </Button>
              </div>
              {actionData?.errors?.find(error => error.path.includes('same-info')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('same-info'))?.message}
                </p>
              )}
              {actionData?.errors?.find(error => error.path.includes('success')) && (
                <p className="text-sky-600">
                  {actionData.errors.find(error => error.path.includes('success'))?.message}
                </p>
              )}
            </Form>
          )}
        </CardContent>
      </Card>
      <Separator className="max-w-2xl mx-auto mb-4" />
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto mb-4">
          <TabsTrigger value="posts">{t("My journals")}</TabsTrigger>
          <TabsTrigger value="comments">{t("My comments")}</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
            {data.posts.map((post: Pick<Post, "id" | "title" | "content" | "ownerHandle" | "commentCount">) => (
              <UserJournal
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                username={post.ownerHandle}
                commentCount={post.commentCount}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="comments">
          <div className="my-4 w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
            {data.comments.map((comment: Omit<Comment, "createdAt" | "updatedAt">) => (
              <UserComment
                key={comment.id}
                id={comment.id}
                username={comment.ownerHandle}
                parentUsername={comment.parentHandle}
                parentId={comment.parentId}
                postId={comment.postId}
                content={comment.content}
                commentCount={comment.commentCount}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}