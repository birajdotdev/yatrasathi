"use client";

import Image from "next/image";

import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type GridImage = {
  src: string;
  alt: string;
  delay: number;
};

const gridImages: GridImage[] = [
  {
    src: "https://images.pexels.com/photos/457876/pexels-photo-457876.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Tropical beach",
    delay: 0.2,
  },
  {
    src: "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Mountain landscape",
    delay: 0.3,
  },
  {
    src: "https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "City skyline",
    delay: 0.4,
  },
  {
    src: "https://images.pexels.com/photos/2735037/pexels-photo-2735037.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Cultural experience",
    delay: 0.5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[url(/bg-light.svg)] bg-fixed dark:bg-[url(/bg-dark.svg)]">
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background/50 to-background/80 backdrop-blur-none" />
      <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col justify-center space-y-8"
            variants={itemVariants}
          >
            <div className="inline-flex w-fit items-center rounded-full border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                AI-Powered Travel Planning
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Your Journey,
                </span>
                <span className="block bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>
              <p className="max-w-prose text-lg text-muted-foreground sm:text-xl">
                Plan your perfect trip with AI-powered itineraries, personalized
                recommendations, and a vibrant travel community.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="group cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignUpButton>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative hidden lg:block"
            variants={itemVariants}
          >
            <div className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="grid grid-cols-2 gap-6">
              {gridImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: image.delay,
                    ease: "easeOut",
                  }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-primary to-primary/50 opacity-10 blur transition duration-1000 group-hover:opacity-75" />
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="relative rounded-lg object-cover shadow-lg transition duration-300 group-hover:scale-[1.02]"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
