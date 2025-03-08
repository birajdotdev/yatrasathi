import { type Metadata } from "next";

import TermsCard from "@/components/terms/terms-card";
import TermsHeader from "@/components/terms/terms-header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read our Terms of Service to understand the rules, guidelines, and agreements for using our services.",
};

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-background via-background/95 to-background flex flex-col justify-between">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-primary/3 dark:bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/4 dark:bg-primary/5 blur-[80px]" />
      </div>
      <div className="relative grow flex flex-col">
        <TermsHeader />
        <TermsCard />
      </div>
    </div>
  );
}
