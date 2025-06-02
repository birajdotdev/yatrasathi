import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ItineraryReminderEmailProps {
  username: string;
  itineraryTitle: string;
  destination: string;
  startDate: Date;
  itineraryLink: string;
}

export default function ItineraryReminderEmail({
  username,
  itineraryTitle,
  destination,
  startDate,
  itineraryLink,
}: ItineraryReminderEmailProps) {
  const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Your trip to {destination} is coming up soon!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-[580px] px-4">
            <Section className="mb-14">
              <Img
                src="https://www.yatrasathi.tech/logo.png"
                width="126"
                height="24"
                alt="YatraSathi"
              />
            </Section>
            <Heading className="text-3xl font-bold text-black">
              Trip Reminder
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Your trip to <strong>{destination}</strong> ({itineraryTitle}) is
              coming up on <strong>{formattedStartDate}</strong>!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We wanted to remind you to check your itinerary and make any final
              preparations before your journey.
            </Text>
            <Section className="my-[32px]">
              <Button
                href={itineraryLink}
                className="rounded bg-[#e11d48] px-[24px] py-[12px] text-center text-[14px] font-medium text-white no-underline"
              >
                View Your Itinerary
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              If you didn&apos;t create this itinerary or need help, please
              contact our support team.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was sent to you because you have an upcoming trip
              planned on YatraSathi. If you believe this is an error, you can
              update your{" "}
              <Link
                href="https://www.yatrasathi.tech/settings"
                className="text-[#e11d48] no-underline"
              >
                notification preferences
              </Link>{" "}
              at any time.
            </Text>
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              © {new Date().getFullYear()} YatraSathi. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
