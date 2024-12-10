import { Button } from "@/components/ui/button";
import { signOut } from "@/server/auth";
import React from "react";

export default function HomePage() {
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
