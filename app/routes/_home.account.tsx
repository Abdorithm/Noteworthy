import { json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/gaurds.server';

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  return json({ user });
};

export default function Account() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div>
      {data.user && (
        <div>
          <h1>Account</h1>
          <p>{data.user.firstName} {data.user.lastName}</p>
          <p>@{data.user.username}</p>
          <p>{data.user.email}</p>
        </div>
      )}
    </div>
  );
}