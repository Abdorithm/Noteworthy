import { LoaderFunction, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { deleteUserMagicTokens } from '~/.server/models/token.model';
import { requireUser } from '~/gaurds.server';
import { destroyUserSession } from '~/sessions.server';

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const sessionHeader = await destroyUserSession(request);
  await deleteUserMagicTokens(user.id);

  return redirect('/feed', {
    headers: {
      'Set-Cookie': sessionHeader,
    },
  });
};