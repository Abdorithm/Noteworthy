import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function Component({ 
  title = "Untitled", 
  content = "No content", 
  username = "Anonymous",
  commentCount = 0,
  onViewComments
}: { 
  title?: string; 
  content?: string; 
  username?: string;
  commentCount?: number;
  onViewComments?: () => void;
}) {
  return (
    <Card className="w-full max-w-2xl border-y border-l-0 border-r-0 rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{username}</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{content}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start px-0 hover:bg-transparent"
          onClick={onViewComments}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          View Comments ({commentCount})
        </Button>
      </CardFooter>
    </Card>
  )
}