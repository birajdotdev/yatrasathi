import { LoginForm } from "@/components/auth/login/login-form";

import AuthCard from "../auth-card";

export default function Login() {
  return (
    <AuthCard
      title="Welcome to YatraSathi"
      description="Your personal travel planning companion"
      social
      bottomLinkLabel="Don't have an account?"
      bottomLinkHref="/signup"
      bottomLink="Sign up"
    >
      <LoginForm />
    </AuthCard>
  );
}
