// import { ScrollArea } from "@/components/ui/scroll-area" // Removed ScrollArea import

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

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[url(/bg-light.svg)] bg-fixed dark:bg-[url(/bg-dark.svg)]">
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background/50 to-background/80 backdrop-blur-none" />

      {/* Main Content */}
      <main className="container relative z-10 mx-auto pt-16">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Terms of
              </span>{" "}
              <span className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
              Please read these terms carefully before using YatraSathi
            </p>
          </div>

          <div className="space-y-8 mb-8">
            <div className="relative overflow-hidden bg-background/80 backdrop-blur-sm shadow-md rounded-lg">
              <div className="border-b px-8 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">YatraSathi Terms</h2>
                  <p className="text-sm text-muted-foreground">
                    Last updated: December 26, 2024
                  </p>
                </div>
              </div>
              <div className="px-8 py-6">
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <section
                      key={index}
                      className="border-l-4 border-primary/20 pl-6 transition-all hover:border-primary"
                    >
                      <h3 className="text-xl font-semibold text-primary mb-3">
                        {section.title}
                      </h3>
                      <div className="text-muted-foreground">
                        <p>{section.content}</p>
                        {section.list && (
                          <ul className="mt-2 space-y-1 list-disc list-inside">
                            {section.list.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const sections = [
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
