import { createProxyMiddleware } from 'http-proxy-middleware';

const CRAWL_URL = process.env.CRAWL_MANAGER_URL + '/crawl';

export const crawlProxy = createProxyMiddleware({
  target: CRAWL_URL,
  changeOrigin: true,

  on: {
    proxyReq(proxyReq, req) {
      if (req.headers.cookie) {
        proxyReq.setHeader('cookie', req.headers.cookie);
      }
    },

    proxyRes(proxyRes, _req, res) {
      const cookies = proxyRes.headers['set-cookie'];
      if (cookies) {
        res.setHeader('set-cookie', cookies);
      }
    },
  },
});
