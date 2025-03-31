const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'https://prod-api.lolz.live',
  changeOrigin: true,
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('host', 'prod-api.lolz.live');
  },
});

module.exports = (req, res) => {
  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        res.status(500).json({ error: 'Proxy Error', details: result.message });
        reject(result);
      } else {
        resolve();
      }
    });
  });
};
