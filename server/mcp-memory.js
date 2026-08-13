const express = require('express');
const router = express.Router();

// 简单内存存储（生产环境建议用数据库）
const memories = {};

router.post('/save', (req, res) => {
  const { userId, content, type = 'conversation', tags = [] } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ error: '缺少 userId 或 content' });
  }
  if (!memories[userId]) memories[userId] = [];
  const entry = { id: Date.now(), content, type, tags, createdAt: new Date().toISOString() };
  memories[userId].push(entry);
  res.json({ success: true, data: entry });
});

router.get('/list', (req, res) => {
  const { userId, limit = 20 } = req.query;
  if (!userId) return res.status(400).json({ error: '缺少 userId' });
  const list = (memories[userId] || []).slice(-limit);
  res.json({ success: true, data: list });
});

module.exports = router;