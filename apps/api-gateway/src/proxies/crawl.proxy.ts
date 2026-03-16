import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from '@packages/shared-config/env';
const CRAWL_URL = env.CRAWL_MANAGER_URL + '/crawl';

export const crawlProxy = createProxyMiddleware({
  target: CRAWL_URL,
  changeOrigin: true,

  on: {
    // get cookie headers
    proxyReq(proxyReq, req) {
      if (req.headers.cookie) {
        proxyReq.setHeader('cookie', req.headers.cookie);
      }
    },
    // set cookie headers for authorization
    proxyRes(proxyRes, _req, res) {
      const cookies = proxyRes.headers['set-cookie'];
      if (cookies) {
        res.setHeader('set-cookie', cookies);
      }
    },
  },
});
