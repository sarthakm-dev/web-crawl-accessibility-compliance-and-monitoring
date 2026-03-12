import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendReportEmail(
  email: string,
  buffer: Buffer,
  reportId: string
) {
  await transporter.sendMail({
    from: `"Accessibility Reports" <${process.env.MAIL_USER}>`,
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
