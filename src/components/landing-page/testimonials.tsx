"use client";

import { useRef } from "react";

import { motion, useInView } from "framer-motion";
import { QuoteIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah L.",
      role: "Solo Traveler",
      content:
        "YatraSathi made planning my solo trip to Nepal a breeze. The AI-generated itinerary was spot-on!",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      name: "Michael R.",
      role: "Business Traveler",
      content:
        "As a frequent business traveler, YatraSathi has saved me countless hours in trip planning. Highly recommended!",
      avatar:
        "https://images.pexels.com/photos/323503/pexels-photo-323503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=100",
    },
    {
      name: "Emma and Tom",
      role: "Adventure Couple",
      content:
        "We discovered amazing off-the-beaten-path locations thanks to YatraSathi's community recommendations.",
      avatar:
        "https://images.pexels.com/photos/1417255/pexels-photo-1417255.jpeg?auto=compress&cs=tinysrgb&w=100",
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

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-linear-to-br from-background to-background/80 py-24"
      ref={ref}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                What Our
              </span>{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground">
              Hear from our satisfied travelers who have experienced the magic
              of YatraSathi
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-primary to-primary/50 opacity-30 blur-sm transition duration-1000 group-hover:opacity-100" />
                <Card className="relative flex h-full flex-col items-center space-y-8 rounded-xl bg-card p-6 shadow-lg transition duration-300 md:p-8">
                  <div className="flex w-full justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xl font-semibold">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <QuoteIcon className="h-8 w-8 text-primary/20 transition duration-300 group-hover:text-primary/80" />
                  </div>
                  <div className="grow">
                    <p className="text-pretty text-muted-foreground">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
