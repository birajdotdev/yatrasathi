import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const sampleComments = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "April 12, 2025",
    content:
      "This is a fantastic article! I especially liked the section about block-based editing. Looking forward to implementing this in my own projects.",
  },
  {
    id: "2",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "April 11, 2025",
    content:
      "Great overview of building a modern blog. Have you considered adding real-time collaboration features? That would be an interesting addition.",
  },
  {
    id: "3",
    author: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "April 10, 2025",
    content:
      "Thanks for sharing this guide. I've been looking for a good approach to implement a Notion-like editor in my Next.js projects.",
  },
];

export default function CommentsSection() {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-6">
        Comments ({sampleComments.length})
      </h3>

      <div className="space-y-6 mb-8">
        {sampleComments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 p-4 rounded-lg bg-muted/50"
          >
            <Avatar>
              <AvatarImage
                src={comment.author.avatar || "/placeholder.svg"}
                alt={comment.author.name}
              />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {comment.date}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="bg-muted/30 p-6 rounded-lg">
        <h4 className="font-medium mb-4">Add a comment</h4>
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Write your comment..."
              className="min-h-[100px] bg-background"
            />
            <Button>Post Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
