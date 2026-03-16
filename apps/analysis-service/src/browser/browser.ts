import puppeteer, { Browser } from 'puppeteer';
import { logger } from '@packages/shared-config/logger';
let browser: Browser | null = null;

export async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    logger.info('Analysis browser launched');
  }
  return browser;
}
