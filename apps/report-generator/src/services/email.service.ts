import nodemailer from 'nodemailer';
import { env } from '@packages/shared-config/env';
// setup transporter to send mail to user
export const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  secure: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});
// add service to send accessibility pdf document to user
export async function sendReportEmail(
  email: string,
  buffer: Buffer,
  reportId: string
) {
  await transporter.sendMail({
    from: `"Accessibility Reports" <${env.MAIL_USER}>`,
    to: email,
    subject: 'Your Accessibility Report is Ready',
    text: 'Your accessibility report is attached.',
    attachments: [
      {
        filename: `report-${reportId}.pdf`,
        content: buffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
