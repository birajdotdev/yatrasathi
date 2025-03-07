"use client";

import { motion } from "framer-motion";

export default function TermsHeader() {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", damping: 15 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-linear-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                Terms of{" "}
              </span>
              <span className="relative bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Service
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-linear-to-r from-primary/40 via-primary/30 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Please read these terms carefully before using YatraSathi
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
