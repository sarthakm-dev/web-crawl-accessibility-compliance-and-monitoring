import { env } from '@packages/shared-config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';

const REPORTING_SERVICE_URL = env.REPORTING_SERVICE_URL + '/reports';

export const reportsProxy = createProxyMiddleware({
  target: REPORTING_SERVICE_URL,
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
