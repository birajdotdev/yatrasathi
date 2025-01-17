import { type Metadata } from "next";
import Image from "next/image";

import { Calendar, MessageCircle, Plus, ThumbsUp, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Share your adventures and read about others' experiences",
};

const blogPosts = [
  {
    title: "10 Must-Visit Hidden Gems in Bali",
    author: "Jane Doe",
    date: "May 15, 2023",
    likes: 245,
    comments: 37,
    image: "https://images.pexels.com/photos/2014872/pexels-photo-2014872.jpeg",
  },
  {
    title: "A Foodie's Guide to Tokyo",
    author: "John Smith",
    date: "April 28, 2023",
    likes: 189,
    comments: 42,
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg",
  },
  {
    title: "Backpacking Through Europe: Tips and Tricks",
    author: "Emma Wilson",
    date: "June 2, 2023",
    likes: 312,
    comments: 56,
    image: "https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg",
  },
];

export default function BlogPage() {
  return (
    <main>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Travel Blog</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Share your adventures and read about others&apos; experiences.
          </p>
        </div>

        <div className="mb-8">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Write New Post
          </Button>
        </div>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search blog posts..."
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="featured" className="mb-8">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="featured">
            <div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post, index) => (
                  <Card key={index}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Click to read more about this amazing travel
                        experience...
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {post.comments}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <p className="text-muted-foreground">
              Recent blog posts go here...
            </p>
          </TabsContent>
          <TabsContent value="popular">
            <p className="text-muted-foreground">
              Popular blog posts go here...
            </p>
          </TabsContent>
          <TabsContent value="following">
            <p className="text-muted-foreground">
              Blog posts from authors you&apos;re following go here...
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
