import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit">Log out</Button>
    </form>
  );
}
