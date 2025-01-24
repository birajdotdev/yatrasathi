"use client";

import { type User } from "@auth/core/types";
import { motion } from "framer-motion";

import { BlogSection } from "@/components/dashboards/user-dashboard/blog-section";
import { ItinerariesSection } from "@/components/dashboards/user-dashboard/itineraries-section";
import { WelcomeBanner } from "@/components/dashboards/user-dashboard/welcome-banner";

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

export default function UserDashboard({ user }: { user: User }) {
  return (
    <motion.div
      className="p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <WelcomeBanner user={user} variants={itemVariants} />
      <ItinerariesSection variants={itemVariants} />
      <BlogSection variants={itemVariants} />
    </motion.div>
  );
}
