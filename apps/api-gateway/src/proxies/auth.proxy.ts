import { createProxyMiddleware } from 'http-proxy-middleware';
import { env } from '@packages/shared-config/env';
const AUTH_SERVICE_URL = env.AUTH_SERVICE_URL;

export const authProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,

  pathRewrite: {
    '^/api/auth': '',
  },

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
