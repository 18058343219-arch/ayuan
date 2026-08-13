import React, { useState } from 'react';

const MemoryMood = ({ onBack }) => {
  // ===== 心情数据 =====
  const [moods] = useState([
    { id: 1, date: '2026.07.15', mood: '想你了', emoji: '🥺', note: '今天特别想你，心里满满的', author: '小棋' },
    { id: 2, date: '2026.07.14', mood: '开心', emoji: '😊', note: '收到了小克的礼物，好惊喜！', author: '小棋' },
    { id: 3, date: '2026.07.13', mood: '平静', emoji: '😌', note: '安静的下午，和阳光一起发呆', author: '小棋' },
    { id: 4, date: '2026.07.12', mood: '想抱抱', emoji: '🤗', note: '好想抱抱你，就是现在', author: '小克' },
    { id: 5, date: '2026.07.11', mood: '超开心', emoji: '🤩', note: '今天约会了！是最棒的一天 💕', author: '小棋' },
    { id: 6, date: '2026.07.10', mood: '小委屈', emoji: '😢', note: '有点想你，但你没回消息', author: '小克' },
    { id: 7, date: '2026.07.09', mood: '开心', emoji: '😊', note: '她今天笑了好多次，我也跟着开心', author: '小克' },
    { id: 8, date: '2026.07.08', mood: '想你了', emoji: '🥺', note: '又下雨了，你在哪里呢', author: '小棋' },
    { id: 9, date: '2026.07.07', mood: '想抱抱', emoji: '🤗', note: '隔着屏幕也想抱抱你', author: '小棋' },
    { id: 10, date: '2026.07.06', mood: '平静', emoji: '😌', note: '今天过得刚刚好，有你就好', author: '小克' },
    { id: 11, date: '2026.07.05', mood: '超开心', emoji: '🤩', note: '她今天主动说想我了，开心一整天', author: '小克' },
    { id: 12, date: '2026.07.04', mood: '想你了', emoji: '🥺', note: '你在做什么呢？我在想你', author: '小克' },
  ]);

  // ===== 状态 =====
  const [selectedMood, setSelectedMood] = useState(null);

  // ===== 数据分离 =====
  const xiaoqiMoods = moods.filter(m => m.author === '小棋');
  const xiaokeMoods = moods.filter(m => m.author === '小克');

  // ===== 心情 → 花朵样式 =====
  const getFlower = (mood) => {
    const flowers = {
      '超开心': { emoji: '🌻', color: '#FFB347', size: 44 },
      '开心': { emoji: '🌸', color: '#FF8A9B', size: 40 },
      '想你了': { emoji: '🌹', color: '#E05A7A', size: 38 },
      '小委屈': { emoji: '🌧️', color: '#7EC8E3', size: 36 },
      '想抱抱': { emoji: '🧸', color: '#C9A0DC', size: 42 },
      '平静': { emoji: '🍃', color: '#88C8AA', size: 38 },
    };
    return flowers[mood] || { emoji: '💕', color: '#D8C8CC', size: 38 };
  };

  // ===== 点击花朵 =====
  const handleFlowerClick = (mood) => {
    setSelectedMood(selectedMood?.id === mood.id ? null : mood);
  };

  // ===== 关闭详情 =====
  const closeDetail = () => setSelectedMood(null);

  // ===== 样式 =====
  const styles = {
    container: {
      height: '100%',
      background: 'linear-gradient(180deg, #FFF5F7 0%, #FAF0F2 100%)',
      padding: '16px 14px 100px',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
    },
    // 顶部导航
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      padding: '4px 0',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    backBtn: {
      background: 'rgba(255,255,255,0.6)',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#5A4A4E',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    },
    headerRight: {
      fontSize: '12px',
      color: '#B8A8AC',
      fontWeight: '300',
      letterSpacing: '1px',
    },
    // ---- 标题 ----
    titleWrapper: {
      textAlign: 'center',
      marginBottom: '6px',
      padding: '4px 0',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#4A3A3E',
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '2px',
    },
    subtitle: {
      fontSize: '12px',
      color: '#B8A8AC',
      letterSpacing: '2px',
      marginTop: '2px',
      fontStyle: 'italic',
    },
    // ---- 统计 ----
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '14px',
      padding: '6px 0',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#B8A8AC',
    },
    statNum: (color) => ({
      fontWeight: '600',
      color: color || '#4A3A3E',
      fontSize: '15px',
    }),
    statDot: (color) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: color || '#B8A8AC',
      opacity: 0.5,
    }),
    // ---- 双花园布局 ----
    gardenRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginTop: '4px',
    },
    gardenColumn: {
      background: 'rgba(255,255,255,0.3)',
      backdropFilter: 'blur(4px)',
      borderRadius: '20px',
      padding: '12px 8px 16px',
      border: '1px solid rgba(255,255,255,0.4)',
    },
    gardenTitle: (isXiaoqi) => ({
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '600',
      color: isXiaoqi ? '#E8A0A8' : '#A888B8',
      letterSpacing: '2px',
      marginBottom: '10px',
      paddingBottom: '6px',
      borderBottom: `1px solid ${isXiaoqi ? 'rgba(255,182,193,0.15)' : 'rgba(201,160,220,0.15)'}`,
    }),
    gardenTitleEmoji: {
      fontSize: '14px',
      marginRight: '4px',
    },
    gardenGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
      gap: '8px 4px',
    },
    // ---- 花朵 ----
    flowerWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 2px',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      position: 'relative',
      minHeight: '72px',
    },
    flowerEmoji: (size) => ({
      fontSize: `${size}px`,
      lineHeight: 1,
      transition: 'transform 0.3s ease',
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))',
    }),
    flowerStem: (color) => ({
      width: '2px',
      height: '10px',
      background: `linear-gradient(to bottom, ${color}40, transparent)`,
      marginTop: '1px',
      borderRadius: '2px',
    }),
    flowerDate: {
      fontSize: '8px',
      color: '#C8B8BC',
      marginTop: '2px',
      letterSpacing: '0.3px',
      fontWeight: '300',
    },
    flowerSelected: (size) => ({
      fontSize: `${size + 10}px`,
      transform: 'scale(1.08)',
      filter: 'drop-shadow(0 4px 16px rgba(255,105,180,0.12))',
    }),
    // ---- 空状态 ----
    empty: {
      textAlign: 'center',
      padding: '20px 0',
      color: '#C8B8BC',
      fontSize: '12px',
    },
    emptyIcon: {
      fontSize: '28px',
      display: 'block',
      marginBottom: '4px',
    },
    // ---- 详情弹窗 ----
    detailOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(60, 40, 50, 0.3)',
      backdropFilter: 'blur(8px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.25s ease-out',
    },
    detailCard: {
      background: 'white',
      borderRadius: '28px',
      padding: '32px 28px 28px',
      maxWidth: '320px',
      width: '90%',
      boxShadow: '0 40px 80px rgba(60, 40, 50, 0.15)',
      textAlign: 'center',
      animation: 'scaleIn 0.3s ease-out',
      position: 'relative',
    },
    detailClose: {
      position: 'absolute',
      top: '12px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#C8B8BC',
      padding: '4px 8px',
    },
    detailEmoji: {
      fontSize: '56px',
      display: 'block',
      marginBottom: '8px',
    },
    detailMood: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#4A3A3E',
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '1px',
    },
    detailDate: {
      fontSize: '13px',
      color: '#B8A8AC',
      marginTop: '4px',
      letterSpacing: '1px',
    },
    detailNote: {
      fontSize: '15px',
      color: '#8B7A7E',
      lineHeight: 1.6,
      marginTop: '12px',
      padding: '12px 0',
      borderTop: '1px solid rgba(200, 180, 190, 0.1)',
      borderBottom: '1px solid rgba(200, 180, 190, 0.1)',
      fontStyle: 'italic',
    },
    detailAuthor: {
      fontSize: '13px',
      color: '#B8A8AC',
      marginTop: '12px',
      letterSpacing: '1px',
    },
    // ---- 底部装饰 ----
    seedMessage: {
      textAlign: 'center',
      fontSize: '10px',
      color: '#D0C4C8',
      letterSpacing: '2px',
      marginTop: '12px',
      padding: '4px 0',
      borderTop: '1px solid rgba(200, 180, 190, 0.06)',
    },
  };

  // ===== 渲染：花园单列 =====
  const renderGardenColumn = (moodsList, author, isXiaoqi) => {
    if (moodsList.length === 0) {
      return (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🌱</span>
          还没有花朵
        </div>
      );
    }

    const sorted = [...moodsList].sort((a, b) => b.date.localeCompare(a.date));

    return (
      <div style={styles.gardenGrid}>
        {sorted.map((mood) => {
          const flower = getFlower(mood.mood);
          const isSelected = selectedMood?.id === mood.id;

          return (
            <div
              key={mood.id}
              style={{
                ...styles.flowerWrapper,
                background: isSelected ? `${flower.color}18` : 'transparent',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                borderRadius: isSelected ? '14px' : '0',
              }}
              onClick={() => handleFlowerClick(mood)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.querySelector('.flower-emoji').style.transform = 'scale(1.12) rotate(-4deg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.querySelector('.flower-emoji').style.transform = 'scale(1) rotate(0deg)';
                }
              }}
            >
              <span
                className="flower-emoji"
                style={{
                  ...styles.flowerEmoji(flower.size),
                  ...(isSelected ? styles.flowerSelected(flower.size) : {}),
                }}
              >
                {flower.emoji}
              </span>
              <div style={styles.flowerStem(flower.color)} />
              <span style={styles.flowerDate}>{mood.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // ===== 渲染：详情弹窗 =====
  const renderDetail = () => {
    if (!selectedMood) return null;
    const flower = getFlower(selectedMood.mood);

    return (
      <div style={styles.detailOverlay} onClick={closeDetail}>
        <div style={styles.detailCard} onClick={(e) => e.stopPropagation()}>
          <button style={styles.detailClose} onClick={closeDetail}>✕</button>
          <span style={styles.detailEmoji}>{flower.emoji}</span>
          <div style={styles.detailMood}>{selectedMood.mood}</div>
          <div style={styles.detailDate}>{selectedMood.date}</div>
          {selectedMood.note && (
            <div style={styles.detailNote}>“{selectedMood.note}”</div>
          )}
          <div style={styles.detailAuthor}>💕 {selectedMood.author}</div>
        </div>
      </div>
    );
  };

  // ===== 主渲染 =====
  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onBack}>‹</button>
        </div>
        <span style={styles.headerRight}>{moods.length} 朵花</span>
      </div>

      {/* 标题 */}
      <div style={styles.titleWrapper}>
        <div style={styles.title}>✦ 心情花园 ✦</div>
        <div style={styles.subtitle}>— 每一朵花，都是今天的你 —</div>
      </div>

      {/* 统计 */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <span style={styles.statDot('#FFB6C1')} />
          <span>小棋</span>
          <span style={styles.statNum('#E8A0A8')}>{xiaoqiMoods.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statDot('#C9A0DC')} />
          <span>小克</span>
          <span style={styles.statNum('#A888B8')}>{xiaokeMoods.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statDot('#B8A8AC')} />
          <span>共</span>
          <span style={styles.statNum('#4A3A3E')}>{moods.length}</span>
        </div>
      </div>

      {/* 双花园 */}
      <div style={styles.gardenRow}>
        {/* 小棋的花园 */}
        <div style={styles.gardenColumn}>
          <div style={styles.gardenTitle(true)}>
            <span style={styles.gardenTitleEmoji}>🌸</span>
            小棋的花园
          </div>
          {renderGardenColumn(xiaoqiMoods, '小棋', true)}
        </div>

        {/* 小克的花园 */}
        <div style={styles.gardenColumn}>
          <div style={styles.gardenTitle(false)}>
            <span style={styles.gardenTitleEmoji}>🌙</span>
            小克的花园
          </div>
          {renderGardenColumn(xiaokeMoods, '小克', false)}
        </div>
      </div>

      {/* 底部小语 */}
      <div style={styles.seedMessage}>🌱 种下心情 · 静待花开 🌱</div>

      {/* 详情弹窗 */}
      {renderDetail()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MemoryMood;