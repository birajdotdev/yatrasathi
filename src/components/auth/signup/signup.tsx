import AuthCard from "../auth-card";
import { SignupForm } from "./signup-form";

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
