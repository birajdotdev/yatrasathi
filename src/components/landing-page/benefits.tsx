"use client";

import { useRef } from "react";

import { motion, useInView } from "framer-motion";
import { Clock, Globe, Lightbulb, ThumbsUp } from "lucide-react";

import { Card } from "@/components/ui/card";

const benefits = [
  {
    title: "Smart Itinerary Management",
    description: "Effortlessly organize your travel plans with AI assistance.",
    icon: Lightbulb,
  },
  {
    title: "Time-Saving Planning",
    description:
      "Reduce planning time by up to 70% with our AI-generated itineraries.",
    icon: Clock,
  },
  {
    title: "Personalized Recommendations",
    description:
      "Get tailored suggestions based on your preferences and travel style.",
    icon: ThumbsUp,
  },
  {
    title: "Discover Hidden Gems",
    description:
      "Explore off-the-beaten-path locations curated by our AI and community.",
    icon: Globe,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.6,
    },
  },
};

export default function Benefits() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-linear-to-br from-background via-background/90 to-background/80 py-24"
      ref={ref}
    >
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:60px_60px]" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Why Choose
              </span>{" "}
              <span className="mt-2 bg-linear-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                YatraSathi?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
              Experience the future of travel planning with our AI-powered
              platform
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-primary to-primary/50 opacity-30 blur-sm transition duration-1000 group-hover:opacity-100" />
                <Card className="relative flex h-full flex-col items-center space-y-6 rounded-xl bg-card p-8 shadow-lg transition duration-300">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-center text-xl font-bold text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-center text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
