import { LoaderFunction } from '@remix-run/node';
import RedditStyleComments from '~/components/comments';
import FeedComponent from '~/components/feed';

export const loader: LoaderFunction = async () => {

  return {

  };
};

export default function Feed() {

  return (
    <div>
      <FeedComponent />
      <RedditStyleComments />
      FEED
    </div>
  );
}