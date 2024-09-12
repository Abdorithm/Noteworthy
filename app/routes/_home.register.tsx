import { ActionFunctionArgs, json, LoaderFunction, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { createUser, getUserByEmail, getUserByUsername } from '~/.server/models/user.model';

const registerSchema = z.object({
  'first-name': z.string().min(2, 'First name must be at least 2 characters').max(15, 'First name must be at most 10 characters'),
  'last-name': z.string().min(2, 'Last name must be at least 2 characters').max(15, 'Last name must be at most 10 characters'),
  'username': z.string().regex(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers').max(20, 'Username must be at most 20 characters'),
  'email': z.string().email('Invalid email address'),
});

export const loader: LoaderFunction = async () => {

  return {

  };
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
  if (await getUserByEmail(String(data.email))) {
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
  else if (await getUserByUsername(String(data.username))) {
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
    await createUser({
      firstName: String(data['first-name']),
      lastName: String(data['last-name']),
      username: String(data.username),
      email: String(data.email),
    });
  }

  return redirect('/login');
}

export default function Register() {
  const { t } = useTranslation();
  const actionData = useActionData<typeof action>();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Form method='post' className='flex flex-col items-center justify-center'>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t("Sign up")}</CardTitle>
            <CardDescription>
              {t("Enter your information to create an account")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" name="first-name" placeholder="Max" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" name="last-name" placeholder="Robinson" required />
                </div>
              </div>
              {actionData?.errors?.find(error => error.path.includes('first-name')) && (
                <p className="text-red-500">
                  {actionData.errors.find(error => error.path.includes('first-name'))?.message}
                </p>
              )}
              {actionData?.errors?.find(error => error.path.includes('last-name')) && (
                <p className="text-red-500">
                  {actionData.errors.find(error => error.path.includes('last-name'))?.message}
                </p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder='maxrobinson23'
                  required
                />
                {actionData?.errors?.find(error => error.path.includes('username')) && (
                  <p className="text-red-500">
                    {actionData.errors.find(error => error.path.includes('username'))?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {actionData?.errors?.find(error => error.path.includes('email')) && (
                  <p className="text-red-500">
                    {actionData.errors.find(error => error.path.includes('email'))?.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}