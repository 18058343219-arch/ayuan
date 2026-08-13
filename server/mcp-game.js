const express = require('express');
const router = express.Router();

const questions = [
  { id: 1, question: '我们第一次见面是在哪里？' },
  { id: 2, question: '我最喜欢的颜色是什么？' },
  { id: 3, question: '我们在一起多少天了？' },
  { id: 4, question: '我最喜欢吃的东西是什么？' },
];

const games = {};

router.get('/quiz/start', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: '缺少 sessionId' });
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  const gameId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  games[gameId] = { sessionId, questions: selected, currentIndex: 0, score: 0, answers: [] };
  res.json({ success: true, gameId, total: selected.length, first: selected[0] });
});

router.post('/quiz/answer', (req, res) => {
  const { gameId, questionId, answer } = req.body;
  const game = games[gameId];
  if (!game) return res.status(404).json({ error: '游戏未找到' });
  const isCorrect = answer && answer.length > 1;
  if (isCorrect) game.score += 1;
  game.currentIndex += 1;
  const finished = game.currentIndex >= game.questions.length;
  res.json({
    success: true,
    isCorrect,
    finished,
    score: game.score,
    total: game.questions.length,
    next: finished ? null : game.questions[game.currentIndex],
  });
});

module.exports = router;