import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: "Verify your DreamFundr account",
    html: `
      <h2>Welcome to DreamFundr</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `,
  });
};
