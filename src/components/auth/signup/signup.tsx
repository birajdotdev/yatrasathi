import { SignupForm } from "./signup-form";
import AuthCard from "../auth-card";

export default function Signup() {
  return (
    <AuthCard
      title="Welcome to YatraSathi"
      description="Create your account and start planning"
      bottomLinkLabel="Already have an account?"
      bottomLinkHref="/login"
      bottomLink="Log in"
    >
      <SignupForm />
    </AuthCard>
  );
}
