const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 导入 MCP 模块
const musicMCP = require('./mcp-music');
const memoryMCP = require('./mcp-memory');
const gameMCP = require('./mcp-game');

// 注册路由
app.use('/api/mcp/music', musicMCP);
app.use('/api/mcp/memory', memoryMCP);
app.use('/api/mcp/game', gameMCP);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on http://localhost:${PORT}`);
});