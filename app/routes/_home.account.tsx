import { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {

  return {

  };
};

export default function Account() {

  return (
    <div>
      MY ACCOUNT
    </div>
  );
}