"use client";

import { useState } from "react";

import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SigninForm() {
  const [email, setEmail] = useState("");

  return (
    <form className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full pl-10 h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button className="w-full text-sm sm:text-base font-semibold" size="lg">
        Continue with Email
      </Button>
    </form>
  );
}
