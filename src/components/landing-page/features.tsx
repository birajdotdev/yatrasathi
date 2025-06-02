"use client";

import { useRef } from "react";

import { motion, useInView } from "framer-motion";
import { Bell, Compass, MapPin, PenTool } from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    title: "AI-Generated Itineraries",
    description:
      "Create personalized travel plans in minutes with our advanced AI technology.",
    icon: MapPin,
  },
  {
    title: "Smart Recommendations",
    description:
      "Discover attractions, restaurants, and activities tailored to your preferences.",
    icon: Compass,
  },
  {
    title: "Community Blogging",
    description:
      "Share your experiences and learn from fellow travelers in our vibrant community.",
    icon: PenTool,
  },
  {
    title: "Real-Time Updates",
    description:
      "Stay informed with live updates on weather, travel advisories, and local events.",
    icon: Bell,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      duration: 0.5,
    },
  },
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-linear-to-br from-background to-background/80 py-24"
      ref={ref}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Powerful Features for
              </span>{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Seamless Travel Planning
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
              Explore our innovative tools designed to enhance your travel
              experience
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-10 sm:grid-cols-2"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-primary to-primary/50 opacity-30 blur-sm transition duration-1000 group-hover:opacity-100" />
                <Card className="relative grid h-full grid-cols-[64px_1fr] items-center space-x-6 rounded-xl bg-card p-8 shadow-lg transition duration-300">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_40%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.1),transparent_40%)]" />
    </section>
  );
}
