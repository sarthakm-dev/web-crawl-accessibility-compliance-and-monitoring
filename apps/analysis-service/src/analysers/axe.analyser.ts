import axeSource from 'axe-core';
import { getBrowser } from '../browser/browser';

export const AxeAnalyzer = {
  async analyze(html: string) {
    // Get browser instance
    const browser = await getBrowser();
    // Initialize page
    const page = await browser.newPage();

    try {
      // Load html content
      await page.setContent(html, { waitUntil: 'load' });
      // Configure axe core
      await page.addScriptTag({ content: axeSource.source });
      // Run axe core
      const results = await page.evaluate(async () => {
        return await (window as any).axe.run();
      });

      return results;
    } finally {
      await page.close();
    }
  },
};
