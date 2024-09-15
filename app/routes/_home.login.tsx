import { LoaderFunction, ActionFunctionArgs, json, redirect, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { getUserByEmailOrUsername } from '~/.server/models/user.model';
import { sendMagicToken } from '~/tokens.server';
import { checkMagicToken } from '~/.server/models/token.model';
import { requireAnon } from '~/gaurds.server';

const loginSchema = z.object({
  'username-or-email': z.string().min(1, 'Username or email is required'),
});

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  await requireAnon(request);
  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // client-side validation
  try {
    loginSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.errors });
    }
  }

  // server-side validation
  const userId = await getUserByEmailOrUsername(String(data['username-or-email']));
  if (!userId) {
    return json(
      {
        "errors": [
          {
            "message": "User not found",
            "path": [
              "username-or-email"
            ]
          }
        ]
      }
    );
  }

  // Check if the user already has a non-expired token
  // We don't want to spam the user with emails
  if (await checkMagicToken(userId)) {
    return json(
      {
        "errors": [
          {
            "message": "You already have a non-expired token sent to your email",
            "path": [
              "username-or-email"
            ]
          }
        ]
      }
    );
  }
  else {
    // Send the magic token to the user
    await sendMagicToken(userId);
  }

  return redirect('/magictoken');
}

export default function Login() {
  const { t } = useTranslation();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isRequesting = navigation.formData?.get('intent') === 'requestToken';

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Form method='post' className='flex flex-col items-center justify-center'>
        <Input type='hidden' name='intent' value='requestToken' />
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t("Log in")}</CardTitle>
            <CardDescription>
              {t("Enter your credentials to log in, a magic token will be sent to your email. Tokens expire in 3 minutes")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username-or-email">{t("Username or email")}</Label>
                <Input
                  id="username-or-email"
                  name="username-or-email"
                  placeholder='a@example.com or maxrobinson23'
                  required
                />
                {actionData?.errors?.find(error => error.path.includes('username-or-email')) && (
                  <p className="text-rose-600 font-semibold text-sm">
                    {actionData.errors.find(error => error.path.includes('username-or-email'))?.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {isRequesting ? t("Requesting token...") : t("Request magic token")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("Don't have an account?")}{" "}
              <Link to="/register" className="underline">
                {t("Sign up")}
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("Already requested a token?")}{" "}
              <Link to="/magictoken" className="underline">
                {t("Verify token")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
