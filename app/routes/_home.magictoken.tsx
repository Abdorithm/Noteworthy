import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { checkExpiredToken, getUserIdByMagicTokenId } from '~/.server/models/token.model';
import { storeUserInSession } from '~/sessions.server';
import { requireAnon } from '~/gaurds.server';

const magicTokenSchema = z.object({
  'magic': z.string().uuid('Magic token must be a valid UUID'),
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
    magicTokenSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.errors });
    }
  }

  // server-side validation
  if (await checkExpiredToken(String(data['magic']))) {

    // check if the token exists and is not expired
    return json(
      {
        "errors": [
          {
            "message": "Invalid or expired token",
            "path": [
              "magic"
            ]
          }
        ]
      }
    );
    
  }
  else {

    // now we know that the token is valid and not expired
    // create an authenticated session (auth cookie) for the user
    // and redirect to the home page
    // I LOVE COOKIES 🍪
    const userId = await getUserIdByMagicTokenId(String(data['magic']));

    // userId is not null because the token is valid
    const sessionHeader = await storeUserInSession(userId!);

    return redirect('/feed', {
      headers: {
        'Set-Cookie': sessionHeader,
      },
    });

  }
}

export default function VerifyMagic() {
  const { t } = useTranslation();
  const actionData = useActionData<typeof action>();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Form method='post' className='flex flex-col items-center justify-center'>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t("Verify token")}</CardTitle>
            <CardDescription>
              {t("Enter the token that was sent to your email")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="magic">{t("Magic token")}</Label>
                <Input
                  id="magic"
                  name="magic"
                  placeholder='UUID'
                  required
                />
              </div>
              {actionData?.errors?.find(error => error.path.includes('magic')) && (
                <p className="text-red-500">
                  {actionData.errors.find(error => error.path.includes('magic'))?.message}
                </p>
              )}
              <Button type="submit" className="w-full">
                {t("Log in")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("Don't have an account?")}{" "}
              <Link to="/register" className="underline">
                {t("Sign up")}
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("Didn't request a token?")}{" "}
              <Link to="/login" className="underline">
                {t("Request a token")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}