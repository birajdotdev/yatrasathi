import type { EmailConfig } from "@auth/core/providers/email";

import MagicLinkEmail from "@/components/emails/magic-link-email";
import { env } from "@/env";
import resend from "@/lib/resend";

type SendVerificationRequestParams = Parameters<
  EmailConfig["sendVerificationRequest"]
>[0];

export async function sendVerificationRequest(
  params: SendVerificationRequestParams
) {
  const { identifier: to, provider, url } = params;
  const { host } = new URL(url);
  const res = await resend.emails.send({
    from: provider.from ?? env.MAIL_FROM_ADDRESS,
    to,
    subject: `Sign in to ${host}`,
    react: MagicLinkEmail({ url, host, userEmail: to }),
    text: text({ url, host }),
  });

  if (!res.error) throw new Error("Failed to send email");
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
