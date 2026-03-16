import puppeteer, { Browser } from 'puppeteer';
import { logger } from '@packages/shared-config/logger';
let browser: Browser;

export async function getBrowser() {
  if (!browser) {
    // setup browser instance
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    logger.info('Puppeteer browser launched');
  }

  return browser;
}
