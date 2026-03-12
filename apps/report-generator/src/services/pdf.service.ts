import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export function generatePdfStream(payload: any) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();

  doc.pipe(stream);

  // Title
  doc.fontSize(22).text('Accessibility Report', { align: 'center' });

  doc.moveDown();

  // Metadata
  doc.fontSize(12).text(`Site ID: ${payload.siteId}`);
  doc.text(`Crawl Job ID: ${payload.crawlJobId}`);

  doc.moveDown();

  // Issues section
  doc.fontSize(16).text('Issues Found');

  doc.moveDown();
  const issues = Array.isArray(payload.issues) ? payload.issues : [];
  if (issues.length === 0) {
    doc.fontSize(12).text('No issues detected.');
  } else {
    issues.forEach((issue: any, index: number) => {
      // Use dataValues since the issue is a Sequelize/IssueAnalytics instance
      const data = issue.dataValues || issue;

      doc.fontSize(12).text(`${index + 1}. Rule: ${data.rule_id}`);

      if (data.page_url) {
        doc.text(`URL: ${data.page_url}`);
      }
      if (data.severity) {
        doc.text(`Severity: ${data.severity}`);
      }
      if (data.rule_description) {
        doc.text(`Description: ${data.rule_description}`);
      }
      if (data.message) {
        doc.text(`Fix: ${data.message.replace(/\n/g, ' ')}`);
      }

      doc.moveDown();
    });
  }

  doc.end();

  return stream;
}
