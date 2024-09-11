import { useState, useMemo } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { MessageSquareIcon } from 'lucide-react'

interface Comment {
  id: number
  parentId: number | null
  author: string
  content: string
}

const initialComments: Comment[] = [
  { id: 1, parentId: null, author: "Alice", content: "This is a great post!" },
  { id: 2, parentId: 1, author: "Bob", content: "I agree with Alice." },
  { id: 3, parentId: 1, author: "Charlie", content: "Thanks for sharing your thoughts!" },
  { id: 4, parentId: 3, author: "David", content: "I have a different perspective." },
  { id: 5, parentId: null, author: "Eve", content: "Interesting discussion here." },
]

interface CommentNode extends Comment {
  replies: CommentNode[]
}

function buildCommentTree(comments: Comment[]): CommentNode[] {
  const commentMap: { [key: number]: CommentNode } = {}

  // Create CommentNode objects
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] }
  })

  // Build the tree structure
  const rootComments: CommentNode[] = []
  comments.forEach(comment => {
    if (comment.parentId === null) {
      rootComments.push(commentMap[comment.id])
    } else {
      commentMap[comment.parentId].replies.push(commentMap[comment.id])
    }
  })

  return rootComments
}

function CommentComponent({ comment, level = 0 }: { comment: CommentNode; level?: number }) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReply = () => {
    if (replyContent.trim()) {
      // In a real app, you'd send this to a server
      console.log(`Reply to comment ${comment.id}: ${replyContent}`)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  return (
    <div className={`mb-2 ${level > 0 ? 'ml-4 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{comment.author}</span>
      </div>
      <p className="mt-1 text-sm">{comment.content}</p>
      <div className="mt-2 flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsReplying(!isReplying)}>
          <MessageSquareIcon className="mr-1 h-3 w-3" />
          {isReplying ? 'Cancel' : 'Reply'}
        </Button>
      </div>
      {isReplying && (
        <div className="mt-2 flex gap-2">
          <Input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="flex-grow text-sm"
          />
          <Button size="sm" onClick={handleReply}>Send</Button>
        </div>
      )}
      <div className="mt-2">
        {comment.replies.map((reply) => (
          <CommentComponent key={reply.id} comment={reply} level={level + 1} />
        ))}
      </div>
    </div>
  )
}

export default function RedditStyleComments() {
  const commentTree = useMemo(() => buildCommentTree(initialComments), [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      {commentTree.map((comment) => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
    </div>
  )
}