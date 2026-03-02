import axeSource from 'axe-core';
import { getBrowser } from '../browser/browser';

export const AxeAnalyzer = {
  async analyze(html: string) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'load' });
      await page.addScriptTag({ content: axeSource.source });

      const results = await page.evaluate(async () => {
        return await (window as any).axe.run();
      });

      return results;
    } finally {
      await page.close();
    }
  },
};
