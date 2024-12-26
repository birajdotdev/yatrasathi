"use client";

import { useRef } from "react";

import { motion, useInView } from "framer-motion";
import { ChevronRight, Compass } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Section {
  title: string;
  content: string;
  list?: string[];
}

interface SectionCardProps {
  section: Section;
  index: number;
}

const SectionCard = ({ section, index }: SectionCardProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-50px",
  });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group rounded-xl border border-border/40 bg-card/30 p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/50 hover:shadow-md dark:border-border/40 dark:bg-background/30 dark:hover:border-primary/50 dark:hover:bg-background/50"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary/10 group-hover:ring-primary/20 dark:bg-primary/10 dark:ring-primary/20 dark:group-hover:bg-primary/20 dark:group-hover:ring-primary/30">
          <motion.div
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
          >
            <ChevronRight className="h-5 w-5" />
          </motion.div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {section.title}
          </h3>
          <div className="text-muted-foreground">
            <p className="leading-relaxed">{section.content}</p>
            {section.list && (
              <ul className="mt-4 grid gap-2.5">
                {section.list.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + i * 0.05 + 0.5,
                    }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50 dark:bg-primary/70" />
                    <span className="text-foreground/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TermsOfService() {
  const ref = useRef(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-1/3 right-0 h-[300px] w-[300px] rounded-full bg-primary/3 dark:bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[250px] w-[250px] rounded-full bg-primary/4 dark:bg-primary/5 blur-[60px]" />
      </div>

      <div className="relative">
        <div className="relative overflow-hidden py-24 sm:py-32">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring", damping: 15 }}
              >
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                    Terms of{" "}
                  </span>
                  <span className="relative bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Service
                    <motion.span
                      className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-primary/40 via-primary/30 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </span>
                </h1>
                <p className="mt-8 text-lg leading-8 text-muted-foreground">
                  Please read these terms carefully before using YatraSathi
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <main className="container relative pb-32" ref={ref}>
          <div className="mx-auto max-w-4xl">
            <Card className="border border-border/40 bg-background/50 shadow-xl backdrop-blur-sm dark:border-border/5 dark:bg-card/40">
              <CardContent className="grid gap-8 p-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-between border-b border-border/40 pb-6"
                >
                  <div className="space-y-1">
                    <h2 className="font-semibold text-primary">
                      YatraSathi Terms
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Last Updated: December 26, 2024
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 p-2 dark:bg-primary/10"
                  >
                    <Compass className="h-5 w-5 text-primary" />
                  </motion.div>
                </motion.div>

                <div className="grid gap-6">
                  {sections.map((section, index) => (
                    <SectionCard key={index} section={section} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

const sections: Section[] = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using YatraSathi's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "2. Service Description",
    content:
      "YatraSathi provides an AI-powered travel planning platform that includes:",
    list: [
      "Personalized itinerary creation",
      "Travel recommendations",
      "Community blogging features",
      "Email notifications for travel updates",
      "Subscription-based premium features",
    ],
  },
  {
    title: "3. User Accounts",
    content:
      "Users must register for an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.",
  },
  {
    title: "4. Free Credits and Subscriptions",
    content:
      "New users receive a limited number of free credits for AI-generated itineraries. Once exhausted:",
    list: [
      "Users must subscribe to continue using AI features",
      "Subscription fees are non-refundable",
      "Prices may be subject to change with notice",
    ],
  },
  {
    title: "5. Community Guidelines",
    content: "When using our blog and community features, users must:",
    list: [
      "Respect other users and their content",
      "Share accurate and genuine travel experiences",
      "Avoid posting inappropriate or harmful content",
      "Not engage in spam or deceptive practices",
    ],
  },
  {
    title: "6. Privacy and Data Protection",
    content:
      "We protect your personal information according to our Privacy Policy. By using YatraSathi, you consent to our data collection and processing practices.",
  },
  {
    title: "7. Payment Terms",
    content: "We accept payments through:",
    list: [
      "Stripe (International payments)",
      "Khalti (Nepal)",
      "Esewa (Nepal)",
    ],
  },
  {
    title: "8. Intellectual Property",
    content:
      "All content and materials available on YatraSathi, including but not limited to text, graphics, website name, code, images and logos are the intellectual property of YatraSathi.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "YatraSathi is not responsible for the accuracy of AI-generated itineraries or user-generated content. Users should verify all travel information independently.",
  },
  {
    title: "10. Modifications to Service",
    content:
      "We reserve the right to modify or discontinue any part of our service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.",
  },
  {
    title: "11. Contact Information",
    content:
      "For questions about these Terms of Service, please contact us at: info@yatrasathi.com",
  },
];
