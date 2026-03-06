import puppeteer, { Browser } from 'puppeteer';

let browser: Browser | null = null;

export async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Analysis browser launched');
  }
  return browser;
}
