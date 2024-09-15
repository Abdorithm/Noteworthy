import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { format } from "date-fns";

export default function UserComment({
  id = "0",
  parentId = "0", // id of the parent comment
  content = "No content",
  username = "Anonymous", // username of the current comment author
  postId = "0",
  commentCount = 0,
  createdAt,
  maxLength = 100,
}: {
  id?: string;
  parentId?: string | null;
  content?: string;
  username?: string;
  postId? : string;
  commentCount?: number;
  createdAt?: Date;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (createdAt) {
      setFormattedDate(format(new Date(createdAt), "MMM d, yyyy hh:mm a"));
    }
  }, [createdAt]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldTruncate = content.length > maxLength;
  const displayContent = isExpanded ? content : content.slice(0, maxLength);

  return (
    <Card className="w-full max-w-2xl border-y border-l-0 border-r-0 rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
            <span className="font-bold">
            @{username}
            </span>
          &apos;s&nbsp;reply to&nbsp;
          {parentId === null ? (
            <Link to={`/journal/${postId}`} className="text-rose-600 hover:underline">
              this post
            </Link>
          ) : (
            <Link to={`/reply/${parentId}`} className="text-rose-600 hover:underline">
              this reply
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="text-sm text-gray-500 dark:text-gray-400 whitespace-break-spaces break-words max-w-full"
          style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {displayContent}
          {shouldTruncate && !isExpanded && '...'}
        </div>
        {shouldTruncate && (
          <Button className="p-0" variant="link" size="sm" onClick={toggleReadMore}>
            {isExpanded ? "Read less" : "Read more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Link to={`/reply/${id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-0 hover:bg-transparent"
          >
            <div className="flex">
              <MessageCircle className="h-4 w-4 mr-2" />
              <div className="mr-2">
                {commentCount}
              </div>
            </div>
          </Button>
        </Link>
        <div className="flex items-center font-bold text-sm text-muted-foreground">
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  )
}