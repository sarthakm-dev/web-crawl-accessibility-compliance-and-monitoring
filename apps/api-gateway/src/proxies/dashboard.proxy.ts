import { env } from '@packages/shared-config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';

const DASHBOARD_URL = env.REPORTING_SERVICE_URL + '/dashboard';

export const dashboardProxy = createProxyMiddleware({
  target: DASHBOARD_URL,
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
