// src/services/mcp.js

// ===== 开发环境使用代理 =====
const BASE_URL = '/api/mcp';

// ===== 通用请求封装 =====
const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `请求失败: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('MCP 请求失败:', error);
    throw error;
  }
};

// ========================================
// 1. 音乐 MCP
// ========================================
export const musicMCP = {
  search: (keyword, limit = 10) =>
    request(`${BASE_URL}/music-mcp/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`),

  getSongUrl: (id) =>
    request(`${BASE_URL}/music-mcp/url?id=${id}`),

  getSongDetail: (id) =>
    request(`${BASE_URL}/music-mcp/detail?id=${id}`),

  getPlaylists: (limit = 10) =>
    request(`${BASE_URL}/music-mcp/playlists?limit=${limit}`),

  getPlaylistDetail: (id) =>
    request(`${BASE_URL}/music-mcp/playlist/${id}`),

  getLyrics: (id) =>
    request(`${BASE_URL}/music-mcp/lyrics?id=${id}`),

  getComments: (id, limit = 10) =>
    request(`${BASE_URL}/music-mcp/comments?id=${id}&limit=${limit}`),

  getArtist: (id) =>
    request(`${BASE_URL}/music-mcp/artist?id=${id}`),

  getSimilar: (id) =>
    request(`${BASE_URL}/music-mcp/similar?id=${id}`),
};

// ========================================
// 2. Whale-listen MCP
// ========================================
export const whaleMCP = {
  getEffects: () =>
    request(`${BASE_URL}/whale-mcp/effects`),

  getEffectDetail: (id) =>
    request(`${BASE_URL}/whale-mcp/effect/${id}`),

  playEffect: (id) =>
    request(`${BASE_URL}/whale-mcp/play/${id}`, { method: 'POST' }),
};

// ========================================
// 3. 记忆 MCP
// ========================================
export const memoryMCP = {
  save: (userId, content, type = 'conversation', tags = []) =>
    request(`${BASE_URL}/mcp/memory/save`, {
      method: 'POST',
      body: JSON.stringify({ userId, content, type, tags }),
    }),

  list: (userId, limit = 20) =>
    request(`${BASE_URL}/mcp/memory/list?userId=${userId}&limit=${limit}`),

  search: (userId, keyword) =>
    request(`${BASE_URL}/mcp/memory/search?userId=${userId}&keyword=${encodeURIComponent(keyword)}`),

  delete: (id, userId) =>
    request(`${BASE_URL}/mcp/memory/delete/${id}?userId=${userId}`, {
      method: 'DELETE',
    }),
};

// ========================================
// 健康检查（改为测试搜索，因为 /health 可能不存在）
// ========================================
export const testConnection = () =>
  musicMCP.search('test').then(() => true).catch(() => false);