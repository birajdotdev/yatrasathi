"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

import TermCard from "@/components/terms/term-card";
import { Card, CardContent } from "@/components/ui/card";
import terms from "@/data/terms";

export default function TermsCard() {
  return (
    <main className="container mx-auto flex justify-center pb-24">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", damping: 15 }}
        >
          <Card className="border border-border/40 bg-background/50 shadow-xl backdrop-blur-xs dark:border-border/5 dark:bg-card/40">
            <CardContent className="grid gap-10 p-8 sm:p-10">
              <div className="flex items-center justify-between border-b border-border/40 pb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-primary">
                    YatraSathi Terms
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Last Updated: December 26, 2024
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 p-3 dark:bg-primary/10">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="grid gap-8">
                {terms.map((term, index) => (
                  <TermCard key={index} term={term} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
