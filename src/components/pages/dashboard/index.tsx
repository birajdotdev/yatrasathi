"use client";

import { motion } from "framer-motion";

import { BlogSection } from "@/components/pages/dashboard/blog-section";
import { ItinerariesSection } from "@/components/pages/dashboard/itineraries-section";
import { WelcomeBanner } from "@/components/pages/dashboard/welcome-banner";

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

export type ItemVariants = typeof itemVariants;

export default function UserDashboard() {
  return (
    <motion.div
      className="p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <WelcomeBanner variants={itemVariants} />
      <ItinerariesSection variants={itemVariants} />
      <BlogSection variants={itemVariants} />
    </motion.div>
  );
}
