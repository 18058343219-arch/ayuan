// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/mcp',
    createProxyMiddleware({
      target: 'https://marmalade-okay-shawl.ngrok-free.dev',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api/mcp': '', // 去掉 /api/mcp 前缀，使 /api/mcp/music-mcp/search → /music-mcp/search
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔀 代理请求:', req.url, '→', proxyReq.path);
      },
      onError: (err, req, res) => {
        console.error('❌ 代理错误:', err.message);
        res.status(500).send('代理错误');
      },
    })
  );
};