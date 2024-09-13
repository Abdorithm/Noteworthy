import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useState } from "react";
import { Link } from "@remix-run/react";

export default function Component({
  title = "Untitled",
  content = "No content",
  username = "Anonymous",
  commentCount = 0,
  maxLength = 100,
}: {
  title?: string;
  content?: string;
  username?: string;
  commentCount?: number;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldTruncate = content.length > maxLength;
  const displayContent = isExpanded ? content : content.slice(0, maxLength);

  return (
    <Card className="w-full max-w-2xl border-y border-l-0 border-r-0 rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">@{username}</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
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
      <CardFooter>
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-0 hover:bg-transparent"
          >
            <div className="flex">
              <MessageCircle className="h-4 w-4 mr-2" />
              <div className="mr-2">
                ({commentCount})
              </div>
            </div>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}