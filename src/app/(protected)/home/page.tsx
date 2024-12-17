import Form from "next/form";

import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome {session?.user?.name}</h1>
          <Form
            action={async () => {
              "use server";
              await signOut({
                redirectTo: "/",
              });
            }}
          >
            <Button type="submit" variant="destructive">
              Sign out
            </Button>
          </Form>
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
            Session Data
          </h2>
          <pre className="overflow-x-scroll rounded border bg-background p-4">
            <code className="text-sm">{JSON.stringify(session, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
