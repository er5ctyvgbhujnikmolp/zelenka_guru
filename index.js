const { createProxyMiddleware } = require('http-proxy-middleware');

// Create the proxy middleware for Kinopoisk API
const proxy = createProxyMiddleware({
  target: 'https://www.kinopoisk.ru',
  changeOrigin: true,
  pathRewrite: function (path, req) {
    // Check if the path contains a film ID pattern
    const filmIdMatch = path.match(/\/film\/(\d+)/);
    if (filmIdMatch) {
      return `/api/tooltip/film/${filmIdMatch[1]}/`;
    }

    // For the suggest API
    if (path.includes('/suggest')) {
      return '/api/suggest/v2/';
    }

    // Default: keep original path
    return path;
  },
  onProxyReq: (proxyReq, req) => {
    // Set required headers for Kinopoisk API
    proxyReq.setHeader('host', 'www.kinopoisk.ru');
    proxyReq.setHeader('content-type', 'application/json');
    proxyReq.setHeader('x-requested-with', 'XMLHttpRequest');
  },
});

module.exports = (req, res) => {
  return new Promise((resolve, reject) => {
    // Handle different API endpoints
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