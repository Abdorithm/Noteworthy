import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { requireUser } from '~/gaurds.server';
import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import FeedComponent from '~/components/feed';
import RedditStyleComments from '~/components/comments';
import { Separator } from '~/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getUserByEmail, getUserById, getUserByUsername, updateUser } from '~/.server/models/user.model';

const registerSchema = z.object({
  'first-name': z.string().min(2, 'First name must be at least 2 characters').max(15, 'First name must be at most 10 characters'),
  'last-name': z.string().min(2, 'Last name must be at least 2 characters').max(15, 'Last name must be at most 10 characters'),
  'username': z.string().regex(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers').max(20, 'Username must be at most 20 characters'),
  'email': z.string().email('Invalid email address'),
});

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  return json({ user });
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
  && String(data['first-name']) === String(originalUser!.firstName)
  && String(data['last-name']) === String(originalUser!.lastName)) {
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
      firstName: String(data['first-name']),
      lastName: String(data['last-name']),
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
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">{t("First name")}</Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    defaultValue={data.user.firstName}
                  />
                  <Input
                    type="hidden"
                    name="id"
                    defaultValue={data.user.id}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">{t("Last name")}</Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    defaultValue={data.user.lastName}
                  />
                </div>
              </div>
              {actionData?.errors?.find(error => error.path.includes('first-name')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('first-name'))?.message}
                </p>
              )}
              {actionData?.errors?.find(error => error.path.includes('last-name')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('last-name'))?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">{t("Username")}</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={data.user.username}
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
                  defaultValue={data.user.email}
                />
              </div>
              {actionData?.errors?.find(error => error.path.includes('email')) && (
                <p className="text-rose-600">
                  {actionData.errors.find(error => error.path.includes('email'))?.message}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <Button className='ml-2' type="button" variant="outline" onClick={handleEditToggle}>{t("Cancel")}</Button>
                <Button type="submit">{t("Save changes")}</Button>
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
          <FeedComponent />
        </TabsContent>
        <TabsContent value="comments">
          <RedditStyleComments />
        </TabsContent>
      </Tabs>
    </div>
  );
}