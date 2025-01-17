import { type Metadata } from "next";

import { Gift, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Credits",
  description: "Manage your AI-powered travel planning credits",
};

const creditHistory = [
  { date: "2023-06-01", description: "Monthly subscription", amount: 100 },
  { date: "2023-05-15", description: "Referral bonus", amount: 50 },
  { date: "2023-05-01", description: "Monthly subscription", amount: 100 },
  { date: "2023-04-20", description: "Special promotion", amount: 75 },
];

export default function CreditsPage() {
  const totalCredits = 325;
  const usedCredits = 210;
  const remainingCredits = totalCredits - usedCredits;
  const creditPercentage = (usedCredits / totalCredits) * 100;

  return (
    <main>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Credits</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your AI-powered travel planning credits.
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Credit Balance</CardTitle>
              <CardDescription>
                Your current AI credit balance and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {remainingCredits} credits
              </div>
              <Progress value={creditPercentage} className="mt-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                {usedCredits} of {totalCredits} credits used
              </p>
            </CardContent>
            <CardFooter>
              <Button className="mr-2">
                <Plus className="mr-2 h-4 w-4" /> Buy Credits
              </Button>
              <Button variant="outline">
                <Gift className="mr-2 h-4 w-4" /> Redeem Code
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Credit Packages</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Starter", credits: 100, price: "$10" },
              { name: "Explorer", credits: 500, price: "$45" },
              { name: "Adventurer", credits: 1000, price: "$80" },
            ].map((pack, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{pack.name}</CardTitle>
                  <CardDescription>{pack.credits} credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{pack.price}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Purchase</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Credit History</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.amount} credits</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </main>
  );
}
