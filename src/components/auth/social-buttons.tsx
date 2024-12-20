import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function SocialButtons() {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full text-sm sm:text-base font-semibold"
        size="lg"
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full text-sm sm:text-base font-semibold"
        size="lg"
      >
        <GithubIcon className="mr-2 h-5 w-5" />
        Continue with GitHub
      </Button>
    </div>
  );
}
