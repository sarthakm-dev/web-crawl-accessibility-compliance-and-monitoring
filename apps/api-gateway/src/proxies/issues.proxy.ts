import { createProxyMiddleware } from 'http-proxy-middleware';

const ISSUE_URL = process.env.CRAWL_MANAGER_URL + '/issues';

export const issuesProxy = createProxyMiddleware({
  target: ISSUE_URL,
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
