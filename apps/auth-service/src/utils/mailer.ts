import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendOTP(email: string, otp: string) {
  await transporter.sendMail({
    from: `"CompliScan" <${process.env.MAIL_USER}>`,
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
