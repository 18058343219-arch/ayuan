const express = require('express');
const axios = require('axios');
const router = express.Router();

const NETEASE_API = 'https://api.imjad.cn/cloudmusic';

router.get('/search', async (req, res) => {
  try {
    const { keyword, limit = 10 } = req.query;
    const response = await axios.get(`${NETEASE_API}/search`, {
      params: { s: keyword, type: 1, limit },
    });
    const songs = response.data.result?.songs || [];
    const formatted = songs.map(s => ({
      id: s.id,
      name: s.name,
      artist: s.artists?.map(a => a.name).join(' / ') || '未知',
      album: s.album?.name || '未知',
      cover: s.album?.picUrl || '',
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/song/url', async (req, res) => {
  try {
    const { id } = req.query;
    const response = await axios.get(`${NETEASE_API}/url`, { params: { id } });
    const data = response.data;
    if (data.data?.[0]) {
      res.json({ success: true, url: data.data[0].url });
    } else {
      res.json({ success: false, url: null });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;