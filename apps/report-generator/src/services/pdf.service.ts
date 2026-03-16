import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export function generatePdfStream(payload: any) {
  const doc = new PDFDocument({ margin: 50 });
  const stream = new PassThrough();

  doc.pipe(stream);
  // get site
  const site = payload.site;
  // get site summary
  const summary = payload.summary;

  doc.fontSize(22).text('Accessibility Report', { align: 'center' });

  doc.moveDown();

  doc.fontSize(14).text('Site Information', { underline: true });

  doc.moveDown(0.5);
  // write site name in pdf
  doc.fontSize(12).text(`Site Name: ${site?.name ?? '-'}`);
  // add base url field
  doc.text(`Site URL: ${site?.base_url ?? '-'}`);

  doc.moveDown();

  doc.fontSize(14).text('Summary', { underline: true });

  doc.moveDown(0.5);
  // Add accessibility score
  doc
    .fontSize(12)
    .text(`Accessibility Score: ${summary?.accessibility_score ?? '-'}`);
  // add pages_crawled
  doc.text(`Pages Crawled: ${summary?.pages_crawled ?? '-'}`);
  // add total issues
  doc.text(`Total Issues: ${summary?.total_issues ?? '-'}`);

  doc.moveDown();
  // add issues count summary
  doc.text(`Critical: ${summary?.critical_count ?? 0}`);
  doc.text(`Serious: ${summary?.serious_count ?? 0}`);
  doc.text(`Moderate: ${summary?.moderate_count ?? 0}`);
  doc.text(`Minor: ${summary?.minor_count ?? 0}`);

  doc.moveDown();

  doc.fontSize(16).text('Issues Found');

  doc.moveDown();

  const issues = Array.isArray(payload.issues) ? payload.issues : [];

  if (issues.length === 0) {
    doc.fontSize(12).text('No issues detected.');
  } else {
    // update issues in pdf
    issues.forEach((issue: any, index: number) => {
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
