// src/config/mcp.js

// ===== 你真实的 MCP 服务器地址 =====
const MCP_BASE = 'https://marmalade-okay-shawl.ngrok-free.dev';

// ===== 音乐 MCP =====
export const musicMCP = {
  // 工具1：搜索歌曲
  search: (keyword) =>
    fetch(`${MCP_BASE}/music-mcp/search?keyword=${encodeURIComponent(keyword)}`)
      .then(r => r.json()),
  
  // 工具2：获取歌曲播放 URL
  getSongUrl: (id) =>
    fetch(`${MCP_BASE}/music-mcp/url?id=${id}`)
      .then(r => r.json()),
  
  // 工具3：获取歌曲详情
  getSongDetail: (id) =>
    fetch(`${MCP_BASE}/music-mcp/detail?id=${id}`)
      .then(r => r.json()),
  
  // 工具4：获取推荐歌单
  getPlaylists: () =>
    fetch(`${MCP_BASE}/music-mcp/playlists`)
      .then(r => r.json()),
  
  // 工具5：获取歌单详情
  getPlaylistDetail: (id) =>
    fetch(`${MCP_BASE}/music-mcp/playlist/${id}`)
      .then(r => r.json()),
  
  // 工具6：获取歌词
  getLyrics: (id) =>
    fetch(`${MCP_BASE}/music-mcp/lyrics?id=${id}`)
      .then(r => r.json()),
  
  // 工具7：获取热门评论
  getComments: (id) =>
    fetch(`${MCP_BASE}/music-mcp/comments?id=${id}`)
      .then(r => r.json()),
  
  // 工具8：获取歌手信息
  getArtist: (id) =>
    fetch(`${MCP_BASE}/music-mcp/artist?id=${id}`)
      .then(r => r.json()),
  
  // 工具9：获取相似歌曲
  getSimilar: (id) =>
    fetch(`${MCP_BASE}/music-mcp/similar?id=${id}`)
      .then(r => r.json()),
};

// ===== Whale-listen MCP（鲸鱼音效） =====
export const whaleMCP = {
  // 工具1：获取音效列表
  getEffects: () =>
    fetch(`${MCP_BASE}/whale-mcp/effects`)
      .then(r => r.json()),
  
  // 工具2：获取音效详情
  getEffectDetail: (id) =>
    fetch(`${MCP_BASE}/whale-mcp/effect/${id}`)
      .then(r => r.json()),
  
  // 工具3：播放音效
  playEffect: (id) =>
    fetch(`${MCP_BASE}/whale-mcp/play/${id}`)
      .then(r => r.json()),
};

// ===== 记忆 MCP（目前掉了，先保留，重启后可用） =====
export const memoryMCP = {
  save: (userId, content, type = 'conversation') =>
    fetch(`${MCP_BASE}/mcp/memory/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content, type }),
    }).then(r => r.json()),
  
  list: (userId) =>
    fetch(`${MCP_BASE}/mcp/memory/list?userId=${userId}`)
      .then(r => r.json()),
  
  search: (userId, keyword) =>
    fetch(`${MCP_BASE}/mcp/memory/search?userId=${userId}&keyword=${encodeURIComponent(keyword)}`)
      .then(r => r.json()),
};

// ===== 通用状态检查 =====
export const checkMCPStatus = async () => {
  try {
    const response = await fetch(`${MCP_BASE}/health`);
    return response.json();
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};