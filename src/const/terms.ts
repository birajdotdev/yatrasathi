export interface Term {
  title: string;
  content: string;
  list?: string[];
}

const terms: Term[] = [
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

export default terms;
