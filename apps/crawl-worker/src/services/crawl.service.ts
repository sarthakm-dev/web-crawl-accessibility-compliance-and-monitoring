import crypto from 'crypto';
import amqp from 'amqplib';
import { getBrowser } from '../browser/browser';
import { CrawlJobRepository } from '../repositories/crawl-job.repository';
import { CrawlQueueRepository } from '../repositories/crawl-queue.repository';
import { PageRepository } from '../repositories/page.repository';
import { PageVersionRepository } from '../repositories/page-version.repository';
import { publishToAnalysis } from '../publishers/analysis.publisher';
import { uploadHtml } from '../storage/upload-html';

export const CrawlService = {
  async processJob(
    payload: {
      jobId: string;
      siteId: string;
      baseUrl: string;
    },
    channel: amqp.Channel
  ) {
    const { jobId, siteId, baseUrl } = payload;

    let browser;
    // Define base host
    const baseHost = new URL(baseUrl).hostname;
    // Set limit for maximum no of pages to be crawled
    const MAX_PAGES = Number(process.env.MAX_PAGES) || 200;

    let processedCount = 0;
    // Initialize publish event to send messages through RabbitMQ
    const publishEvent = (data: any) => {
      channel.sendToQueue('crawl_events', Buffer.from(JSON.stringify(data)), {
        persistent: true,
      });
    };

    try {
      browser = await getBrowser();

      await CrawlJobRepository.updateStatus(jobId, 'running');
      // Send publish event status througn RabbitMQ to crawl manager for real time update
      publishEvent({
        jobId,
        siteId,
        status: 'running',
      });

      await CrawlQueueRepository.createIfNotExists({
        crawl_job_id: jobId,
        url: baseUrl,
        status: 'pending',
        discovered_from: null,
        retry_count: 0,
      });
      // While processed pages less than limit
      while (processedCount < MAX_PAGES) {
        const queueItem = await CrawlQueueRepository.getNextPending(jobId);

        if (!queueItem) break;
        // Initialize new page to crawl
        const page = await browser.newPage();

        try {
          await CrawlQueueRepository.updateStatus(queueItem.id, 'processing');
          // Wait untill network idle
          const response = await page.goto(queueItem.url, {
            waitUntil: 'networkidle2',
            timeout: 30000,
          });

          const httpStatus = response?.status() ?? 0;

          const html = await page.content();
          const title = await page.title();
          // Create a content hash to prevent duplication
          const contentHash = crypto
            .createHash('sha256')
            .update(html)
            .digest('hex');

          const contentSize = Buffer.byteLength(html, 'utf8');

          const dbPage = await PageRepository.upsert({
            site_id: siteId,
            url: queueItem.url,
            last_seen_at: new Date(),
            status: httpStatus === 200 ? 'active' : 'error',
          });
          // Upload the crawled page in s3 bucket for future reference
          const htmlPath = await uploadHtml(
            siteId,
            dbPage.id,
            contentHash,
            html
          );

          const pageVersion = await PageVersionRepository.create({
            page_id: dbPage.id,
            crawl_job_id: jobId,
            http_status: httpStatus,
            content_hash: contentHash,
            title,
            html_path: htmlPath,
            content_size: contentSize,
          });
          // Send publish event status througn RabbitMQ to analysis service for accessibility scan
          await publishToAnalysis({ pageVersionId: pageVersion.id });

          const links: string[] = await page.$$eval('a[href]', as =>
            as.map(a => (a as HTMLAnchorElement).href)
          );

          for (const rawLink of links) {
            try {
              const parsed = new URL(rawLink);

              if (parsed.hostname !== baseHost) continue;

              const cleanUrl = parsed.origin + parsed.pathname;
              // Update crawl queue status for observability
              await CrawlQueueRepository.createIfNotExists({
                crawl_job_id: jobId,
                url: cleanUrl,
                status: 'pending',
                discovered_from: queueItem.url,
                retry_count: 0,
              });
            } catch {
              continue;
            }
          }

          await CrawlQueueRepository.updateStatus(queueItem.id, 'completed');

          processedCount++;

          console.log('Processed Count', processedCount);

          if (processedCount % 5 === 0) {
            publishEvent({
              jobId,
              status: 'running',
              processedPages: processedCount,
            });
          }
        } catch (err) {
          console.error(`Failed crawling ${queueItem.url}`, err);

          await CrawlQueueRepository.updateStatus(queueItem.id, 'failed');
        }

        await page.close();
      }

      await CrawlJobRepository.updateStatus(jobId, 'completed');
      // Send publish event status througn RabbitMQ to crawl manager for real time update
      publishEvent({
        jobId,
        siteId,
        status: 'completed',
      });
    } catch (error) {
      console.error('Crawl job failed:', error);

      await CrawlJobRepository.updateStatus(jobId, 'failed');
      // Send publish event status failed for real time update
      publishEvent({
        jobId,
        siteId,
        status: 'failed',
      });
    }
  },
};
