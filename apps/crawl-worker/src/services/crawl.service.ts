import crypto from 'crypto';
import amqp from 'amqplib';
import { env } from '@packages/shared-config/env';
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
    // Get Payload from comsumer
    const { jobId, siteId, baseUrl } = payload;
    // Setup base host
    const baseHost = new URL(baseUrl).hostname;
    // Limit MAX PAGES to defined constraint
    const MAX_PAGES = Number(env.MAX_PAGES) || 200;

    let browser;
    let processedCount = 0;
    // Setup crawl event for status updates
    const publishEvent = (data: any) => {
      channel.sendToQueue('crawl_events', Buffer.from(JSON.stringify(data)), {
        persistent: true,
      });
    };

    try {
      browser = await getBrowser();
      // Update crawl job status in db
      await CrawlJobRepository.updateStatus(jobId, 'running');
      // Publish status as event running
      publishEvent({
        jobId,
        siteId,
        status: 'running',
      });
      // Update crawl queue for observability
      await CrawlQueueRepository.createIfNotExists({
        crawl_job_id: jobId,
        url: baseUrl,
        status: 'pending',
        discovered_from: null,
        retry_count: 0,
      });
      // Crawl untill MAX PAGES reached
      while (processedCount < MAX_PAGES) {
        // Fetch page from queue
        const queueItem = await CrawlQueueRepository.getNextPending(jobId);
        // If queue empty no more pages to crawl so break
        if (!queueItem) break;

        const page = await browser.newPage();

        try {
          //Update status to processing
          await CrawlQueueRepository.updateStatus(queueItem.id, 'processing');
          // Wait untill network idle
          const response = await page.goto(queueItem.url, {
            waitUntil: 'networkidle2',
            timeout: 30000,
          });

          const httpStatus = response?.status() ?? 0;
          // Get HTML contenyt
          const html = await page.content();
          const title = await page.title();
          // Create content hash
          const contentHash = crypto
            .createHash('sha256')
            .update(html)
            .digest('hex');
          // Get content size
          const contentSize = Buffer.byteLength(html, 'utf8');
          // Insert page metadata into repository
          const dbPage = await PageRepository.upsert({
            site_id: siteId,
            url: queueItem.url,
            last_seen_at: new Date(),
            status: httpStatus === 200 ? 'active' : 'error',
          });

          // Check if same content already analyzed

          const existingVersion =
            await PageVersionRepository.findByHash(contentHash);

          let pageVersion;

          if (existingVersion) {
            //Content unchanged reuse previous HTML + analysis

            pageVersion = await PageVersionRepository.create({
              page_id: dbPage.id,
              crawl_job_id: jobId,
              http_status: httpStatus,
              content_hash: contentHash,
              title,
              html_path: existingVersion.html_path,
              content_size: existingVersion.content_size,
            });

            console.log('Content unchanged, reused analysis');
          } else {
            //New content so  upload and analyze page

            const htmlPath = await uploadHtml(
              siteId,
              dbPage.id,
              contentHash,
              html
            );
            // Add new page version metadata in db
            pageVersion = await PageVersionRepository.create({
              page_id: dbPage.id,
              crawl_job_id: jobId,
              http_status: httpStatus,
              content_hash: contentHash,
              title,
              html_path: htmlPath,
              content_size: contentSize,
            });

            await publishToAnalysis({
              pageVersionId: pageVersion.id,
            });
          }

          // Discover links in pages

          const links: string[] = await page.$$eval('a[href]', as =>
            as.map(a => (a as HTMLAnchorElement).href)
          );
          // Add pages into queue for further crawling
          for (const rawLink of links) {
            try {
              const parsed = new URL(rawLink);

              if (parsed.hostname !== baseHost) continue;

              const cleanUrl = parsed.origin + parsed.pathname;

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
          // update queue status as completed
          await CrawlQueueRepository.updateStatus(queueItem.id, 'completed');

          processedCount++;

          console.log('Processed Count:', processedCount);
          // After every 5 crawls update event as running
          if (processedCount % 5 === 0) {
            publishEvent({
              jobId,
              status: 'running',
              processedPages: processedCount,
            });
          }
        } catch (err) {
          console.error(`Failed crawling ${queueItem.url}`, err);
          // Mark Crawl as failed
          await CrawlQueueRepository.updateStatus(queueItem.id, 'failed');
        }

        await page.close();
      }

      await CrawlJobRepository.updateStatus(jobId, 'completed');

      publishEvent({
        jobId,
        siteId,
        status: 'completed',
      });
    } catch (error) {
      console.error('Crawl job failed:', error);

      await CrawlJobRepository.updateStatus(jobId, 'failed');

      publishEvent({
        jobId,
        siteId,
        status: 'failed',
      });
    }
  },
};
