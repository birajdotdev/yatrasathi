import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface MagicLinkEmailProps {
  url: string;
  host: string;
  userEmail: string;
}

export default function MagicLinkEmail({
  url,
  host,
  userEmail,
}: MagicLinkEmailProps) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  return (
    <Html>
      <Head />
      <Preview>Sign in to {escapedHost}</Preview>
      <Tailwind>
        <Body className="bg-[#fafafa] my-auto mx-auto font-sans">
          <Container className="bg-white border border-solid border-gray-200 rounded-xl shadow-sm my-[20px] mx-auto p-[24px] max-w-[400px]">
            <Section className="mt-[12px] mb-[20px]">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                width="32"
                height="32"
                alt={`${host} logo`}
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-gray-900 text-[20px] font-semibold text-center p-0 my-[16px] mx-0">
              Sign in to {escapedHost}
            </Heading>
            <Text className="text-gray-600 text-[14px] leading-[24px] mb-[20px] text-center">
              Click the button below to securely sign in to your account.
            </Text>
            <Section className="text-center mb-[24px]">
              <Button
                className="bg-[#e11d48] px-5 py-3 rounded-lg text-white text-[14px] font-medium no-underline text-center shadow-sm hover:bg-[#c01b41] transition-colors"
                href={url}
              >
                Sign in to Your Account
              </Button>
            </Section>
            <Text className="text-gray-500 text-[12px] leading-[16px] text-center">
              This secure sign-in link was sent to {userEmail} and will expire
              in 24 hours.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
