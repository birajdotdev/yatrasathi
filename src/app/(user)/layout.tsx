import Footer from "@/components/footer";
import NavBar from "@/components/nav/nav-bar";
import React from "react";

export default function UserLayout({
  auth,
  children,
}: {
  auth: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
        {auth}
      </main>
      <Footer />
    </div>
  );
}
