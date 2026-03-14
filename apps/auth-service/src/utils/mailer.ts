import nodemailer from 'nodemailer';
import { env } from '@packages/shared-config/env';

export const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  secure: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

export async function sendOTP(email: string, otp: string) {
  await transporter.sendMail({
    from: `"CompliScan" <${env.MAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <h3>Password Reset Request</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  });
}
