import SocialMediaPost from '~/components/post'

export default function FeedComponent() {
  const handleViewComments = (postId: string) => {
    console.log(`Viewing comments for post ${postId}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-0 divide-y divide-gray-200 dark:divide-gray-800">
      <SocialMediaPost 
        title="My First Post" 
        content="This is the content of my very first post. It's short and sweet!" 
        username="johndoe"
        commentCount={5}
        onViewComments={() => handleViewComments("post1")}
      />
      <SocialMediaPost 
        title="Another Great Post" 
        content="Here's another post with some more content. Click below to see the comments!" 
        username="janedoe"
        commentCount={10}
        onViewComments={() => handleViewComments("post2")}
      />
      <SocialMediaPost 
        title="Third Time's a Charm" 
        content="This is the third post in our feed. Notice how they stack nicely without side borders!" 
        username="alexsmith"
        commentCount={3}
        onViewComments={() => handleViewComments("post3")}
      />
    </div>
  )
}