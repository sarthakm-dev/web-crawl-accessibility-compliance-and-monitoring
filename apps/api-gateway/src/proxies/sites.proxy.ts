import { createProxyMiddleware } from 'http-proxy-middleware';

const SITE_URL = process.env.CRAWL_MANAGER_URL + '/sites';

export const sitesProxy = createProxyMiddleware({
  target: SITE_URL,
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
