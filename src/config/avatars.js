// src/config/avatars.js

// ===== 头像统一配置 =====
// 默认配置
const DEFAULT_AVATARS = {
  xiaoke: {
    name: '小克',
    emoji: '🌙',
    initial: '克',
    color: 'linear-gradient(135deg, #C9A0DC, #A67BB8)',
    defaultText: '克',
    image: null,
  },
  xiaoqi: {
    name: '小棋',
    emoji: '🌸',
    initial: '棋',
    color: 'linear-gradient(135deg, #FFB6C1, #FF8A9B)',
    defaultText: '棋',
    image: null,
  },
};

// 从 localStorage 加载保存的名字
const loadSavedNames = () => {
  try {
    const saved = localStorage.getItem('avatar_names');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return null;
};

const savedNames = loadSavedNames();

// 导出配置（优先使用保存的名字）
export const AVATARS = {
  xiaoke: {
    ...DEFAULT_AVATARS.xiaoke,
    name: savedNames?.xiaoke || DEFAULT_AVATARS.xiaoke.name,
  },
  xiaoqi: {
    ...DEFAULT_AVATARS.xiaoqi,
    name: savedNames?.xiaoqi || DEFAULT_AVATARS.xiaoqi.name,
  },
};

// ===== 保存名字到 localStorage =====
export const saveNamesToStorage = () => {
  try {
    localStorage.setItem('avatar_names', JSON.stringify({
      xiaoke: AVATARS.xiaoke.name,
      xiaoqi: AVATARS.xiaoqi.name,
    }));
  } catch (e) {}
};

// ===== 更新名字（同时更新内存和 localStorage） =====
export const updateAvatarName = (person, newName) => {
  if (AVATARS[person]) {
    AVATARS[person].name = newName;
    saveNamesToStorage();
  }
};

// ===== 更新头像图片 =====
export const updateAvatarImage = (person, imageData) => {
  if (AVATARS[person]) {
    AVATARS[person].image = imageData;
  }
};

// ===== 重置所有配置到默认（包括名字） =====
export const resetAllAvatars = () => {
  AVATARS.xiaoke.name = DEFAULT_AVATARS.xiaoke.name;
  AVATARS.xiaoke.image = null;
  AVATARS.xiaoqi.name = DEFAULT_AVATARS.xiaoqi.name;
  AVATARS.xiaoqi.image = null;
  localStorage.removeItem('avatar_names');
  saveNamesToStorage();
};