import { redirect } from "next/navigation";
import React from "react";

import Footer from "@/components/footer";
import NavBar from "@/components/nav/nav-bar";
import { auth } from "@/server/auth";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (userId) return redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
