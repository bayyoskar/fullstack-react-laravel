const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const proxy = createProxyMiddleware('/api', {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    secure: false,
  });

  app.use(proxy);
};