import { PricingTable } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { Banner } from "@/components/ui/banner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionPage() {
  return (
    <main className="container mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
      <Banner
        badgeText="Subscription"
        title="Your Subscription"
        description="View your current plan details or upgrade to access more features. Choose the plan that best fits your needs."
        icon={CreditCard}
      />
      <PricingTable
        fallback={<PricingTableSkeleton />}
        checkoutProps={{
          appearance: {
            elements: {
              drawerRoot: {
                zIndex: 10000,
              },
            },
          },
        }}
      />
    </main>
  );
}

function PricingTableSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}
