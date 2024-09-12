import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { requireUser } from '~/gaurds.server';
import { destroyUserSession } from '~/sessions.server';

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  const sessionHeader = await destroyUserSession(request);
  
  return redirect('/feed', {
    headers: {
      'Set-Cookie': sessionHeader,
    },
  });
};