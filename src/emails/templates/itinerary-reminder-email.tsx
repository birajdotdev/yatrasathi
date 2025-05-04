import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ItineraryReminderEmailProps {
  username: string;
  itineraryTitle: string;
  destination: string;
  startDate: Date;
  itineraryLink: string;
}

export const ItineraryReminderEmail = ({
  username,
  itineraryTitle,
  destination,
  startDate,
  itineraryLink,
}: ItineraryReminderEmailProps) => {
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
      <Body
        style={{
          fontFamily: "system-ui",
          margin: "0",
          padding: "0",
          backgroundColor: "#f4f4f5",
        }}
      >
        <Container
          style={{ padding: "20px", margin: "0 auto", maxWidth: "600px" }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "40px 20px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Heading
              as="h1"
              style={{
                color: "#18181b",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                margin: "0 0 24px",
              }}
            >
              Trip Reminder: {itineraryTitle}
            </Heading>

            <Section>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Hello {username},
              </Text>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Your trip to <strong>{destination}</strong> is coming up on{" "}
                <strong>{formattedStartDate}</strong>!
              </Text>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                We wanted to remind you to check your itinerary and make any
                final preparations before your journey.
              </Text>
            </Section>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Button
                href={itineraryLink}
                style={{
                  backgroundColor: "#06b6d4",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  textDecoration: "none",
                  textTransform: "none",
                }}
              >
                View Your Itinerary
              </Button>
            </Section>

            <Section>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                }}
              >
                Safe travels!
              </Text>
              <Text
                style={{
                  color: "#3f3f46",
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "0",
                }}
              >
                The YatraSathi Team
              </Text>
            </Section>
          </Section>

          <Text
            style={{
              color: "#71717a",
              fontSize: "12px",
              lineHeight: "16px",
              textAlign: "center",
              margin: "16px 0",
            }}
          >
            © {new Date().getFullYear()} YatraSathi. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ItineraryReminderEmail;
