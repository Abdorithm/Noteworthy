import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (recipient: string, subject: string, content: string) => {
  const response = await resend.emails.send({
    from: "noreply@abdorithm.tech",
    to: recipient,
    subject: subject,
    html: content,
  });

  return { error: response.error?.message };
};