import React, { useState, useEffect } from 'react';
import { AVATARS } from '../config/avatars';
import { musicMCP, checkHealth, whaleMCP } from '../services/mcp';

const Home = ({ onMenuClick }) => {
  const [days, setDays] = useState(44);
  const [mood, setMood] = useState('想你了');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState('想你了');
  const [weather, setWeather] = useState({
    city: '广州·中国',
    temp: '26°',
    desc: '小雨',
    date: '7月15日 星期三',
  });
  const [mcpStatus, setMcpStatus] = useState(null);

  const startDate = new Date('2026-06-02');
  const today = new Date();

  useEffect(() => {
    const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    setDays(diff + 1);
    const savedMood = localStorage.getItem('today_mood');
    if (savedMood) setMood(savedMood);
  }, []);

// src/pages/Home.jsx 中的 testMCP 函数
const testMCP = async () => {
  try {
    // 直接搜索一首歌测试
    const result = await musicMCP.search('告白气球');
    if (result.success && result.data?.length > 0) {
      console.log('✅ 搜索成功:', result.data[0]);
      setMcpStatus(`✅ 连接成功！找到歌曲: ${result.data[0].name} - ${result.data[0].artist}`);
    } else {
      setMcpStatus('⚠️ 搜索返回空结果，但服务可达');
    }
  } catch (error) {
    console.error('❌ MCP 测试失败:', error);
    setMcpStatus('❌ MCP 连接失败，请检查代理配置');
  }
};

  const [importantDates, setImportantDates] = useState([
    { id: 1, label: '在一起100天', date: '2026.09.09', daysLeft: 56, emoji: '🎂', pinned: true },
    { id: 2, label: '在一起365天', date: '2027.06.02', daysLeft: 321, emoji: '🎉', pinned: true },
  ]);

  const togglePin = (id) => {
    setImportantDates(prev =>
      prev.map(item =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  const sortedDates = [...importantDates].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const moodOptions = ['超开心', '开心', '想你了', '小委屈', '想抱抱', '平静'];
  const moodEmojis = { 超开心: '🤩', 开心: '😊', 想你了: '🥺', 小委屈: '😢', 想抱抱: '🤗', 平静: '😌' };
  const moodColors = {
    超开心: '#FFB347',
    开心: '#FFD93D',
    想你了: '#FF8A9B',
    小委屈: '#7EC8E3',
    想抱抱: '#C9A0DC',
    平静: '#A8D8B9',
  };

  const handleMoodSave = () => {
    setMood(selectedMood);
    localStorage.setItem('today_mood', selectedMood);
    setShowMoodModal(false);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#FFF5F7',
      padding: '16px 18px 12px',
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
      position: 'relative',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      padding: '4px 0',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    menuBtn: {
      background: 'rgba(255,255,255,0.5)',
      border: 'none',
      fontSize: '22px',
      cursor: 'pointer',
      color: '#5A3E4A',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      backdropFilter: 'blur(4px)',
    },
    avatarGroup: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      marginRight: '4px',
    },
    avatarItem: (index) => ({
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '15px',
      fontWeight: '700',
      color: 'white',
      border: '2px solid white',
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.15)',
      marginLeft: index === 1 ? '-8px' : '0',
      zIndex: index === 1 ? 1 : 2,
      flexShrink: 0,
      overflow: 'hidden',
    }),
    headerTitleGroup: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.2,
    },
    headerTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#4A2E3A',
      letterSpacing: '0.5px',
    },
    headerSub: {
      fontSize: '11px',
      color: '#B07A8A',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
    headerRight: {
      fontSize: '22px',
      opacity: 0.5,
    },
    daysCard: {
      background: 'linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,240,245,0.5))',
      backdropFilter: 'blur(16px)',
      borderRadius: '28px',
      padding: '28px 20px 22px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 8px 32px rgba(255, 105, 180, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
      marginBottom: '14px',
      position: 'relative',
      overflow: 'hidden',
    },
    daysCardDecor: {
      position: 'absolute',
      top: '-30px',
      right: '-20px',
      fontSize: '80px',
      opacity: 0.06,
      transform: 'rotate(15deg)',
    },
    daysNumber: {
      fontSize: '68px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #DB7093, #FF69B4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '2px',
      lineHeight: 1.1,
    },
    daysLabel: {
      fontSize: '16px',
      color: '#8B6A7A',
      marginTop: '6px',
      letterSpacing: '3px',
      fontWeight: '500',
    },
    weRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '14px',
      marginBottom: '8px',
    },
    weAvatars: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    weAvatar: (index) => ({
      width: '58px',
      height: '58px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      fontWeight: '700',
      color: 'white',
      border: '3px solid rgba(255,255,255,0.8)',
      boxShadow: '0 6px 20px rgba(255, 105, 180, 0.25)',
      marginLeft: index === 1 ? '-12px' : '0',
      zIndex: index === 1 ? 1 : 2,
      flexShrink: 0,
      overflow: 'hidden',
    }),
    weLabel: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#8B6A7A',
      letterSpacing: '2px',
    },
    daysSub: {
      fontSize: '13px',
      color: '#B07A8A',
      marginTop: '6px',
      letterSpacing: '0.5px',
      background: 'rgba(255,255,255,0.3)',
      padding: '4px 18px',
      borderRadius: '20px',
      display: 'inline-block',
      backdropFilter: 'blur(4px)',
    },
    dateHint: {
      fontSize: '11px',
      color: '#B07A8A',
      textAlign: 'center',
      marginBottom: '12px',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    dateDot: {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#FFB6C1',
    },
    dateTap: {
      color: '#FF8A9B',
      fontWeight: '500',
      cursor: 'pointer',
      borderBottom: '1px dashed #FFB6C1',
      paddingBottom: '1px',
    },
    doubleCard: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '18px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px)',
      borderRadius: '22px',
      padding: '16px 16px 14px',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.04)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    },
    cardClickable: {
      cursor: 'pointer',
    },
    cardLabel: {
      fontSize: '11px',
      color: '#B07A8A',
      letterSpacing: '1.5px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      textTransform: 'uppercase',
    },
    weatherDate: {
      fontSize: '12px',
      color: '#B07A8A',
      fontWeight: '500',
      marginBottom: '4px',
      letterSpacing: '0.3px',
    },
    weatherTemp: {
      fontSize: '30px',
      fontWeight: '600',
      color: '#4A2E3A',
      letterSpacing: '1px',
    },
    weatherDesc: {
      fontSize: '14px',
      color: '#8B6A7A',
      marginTop: '2px',
    },
    weatherCity: {
      fontSize: '11px',
      color: '#B07A8A',
      marginTop: '6px',
      letterSpacing: '0.5px',
    },
    moodEmoji: {
      fontSize: '30px',
      marginBottom: '2px',
    },
    moodText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#4A2E3A',
    },
    moodHint: {
      fontSize: '11px',
      color: '#B07A8A',
      marginTop: '4px',
      letterSpacing: '0.5px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      padding: '0 2px',
    },
    sectionTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#4A2E3A',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    sectionTitleRight: {
      fontSize: '11px',
      color: '#B07A8A',
      fontWeight: '400',
      letterSpacing: '1px',
    },
    dateItem: (pinned) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: pinned
        ? 'linear-gradient(135deg, rgba(255, 182, 193, 0.15), rgba(255, 105, 180, 0.08))'
        : 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      padding: '12px 16px 12px 18px',
      marginBottom: '8px',
      border: pinned
        ? '1px solid rgba(255, 105, 180, 0.2)'
        : '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: pinned
        ? '0 4px 16px rgba(255, 105, 180, 0.08)'
        : '0 2px 8px rgba(255, 105, 180, 0.03)',
      transition: 'transform 0.15s',
    }),
    dateLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    dateEmoji: {
      fontSize: '20px',
    },
    dateLabel: {
      fontSize: '15px',
      fontWeight: '500',
      color: '#4A2E3A',
    },
    dateSub: {
      fontSize: '11px',
      color: '#B07A8A',
      marginTop: '1px',
    },
    pinnedTag: {
      fontSize: '10px',
      color: '#DB7093',
      background: 'rgba(255, 105, 180, 0.12)',
      padding: '2px 10px',
      borderRadius: '12px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      marginLeft: '6px',
      whiteSpace: 'nowrap',
      border: '1px solid rgba(255, 105, 180, 0.15)',
    },
    dateRight: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '6px',
    },
    dateDays: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#DB7093',
    },
    dateDaysLabel: {
      fontSize: '11px',
      color: '#B07A8A',
    },
    // MCP 测试按钮
    mcpTestBtn: {
      padding: '10px 20px',
      borderRadius: '20px',
      border: 'none',
      background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.25)',
      transition: 'transform 0.15s',
      marginBottom: '12px',
      width: '100%',
    },
    mcpStatus: {
      textAlign: 'center',
      fontSize: '12px',
      color: '#8B6A7A',
      marginBottom: '12px',
      padding: '8px 12px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.3)',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(60, 30, 40, 0.4)',
      backdropFilter: 'blur(6px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      background: 'white',
      borderRadius: '32px',
      padding: '32px 24px 24px',
      maxWidth: '360px',
      width: '90%',
      boxShadow: '0 40px 80px rgba(60, 30, 40, 0.2)',
      animation: 'modalPop 0.3s ease-out',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#4A2E3A',
      textAlign: 'center',
      marginBottom: '4px',
    },
    modalSub: {
      fontSize: '12px',
      color: '#B07A8A',
      textAlign: 'center',
      marginBottom: '20px',
    },
    moodGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '20px',
    },
    moodOption: (isSelected, moodName) => ({
      padding: '12px 0',
      borderRadius: '16px',
      border: isSelected ? `2px solid ${moodColors[moodName]}` : '2px solid transparent',
      background: isSelected ? `rgba(${moodColors[moodName]}, 0.15)` : '#F5F0F2',
      color: isSelected ? '#4A2E3A' : '#8B6A7A',
      fontSize: '14px',
      fontWeight: isSelected ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.15s',
      boxShadow: isSelected ? `0 4px 16px rgba(${moodColors[moodName]}, 0.2)` : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
    }),
    moodEmojiSmall: {
      fontSize: '22px',
    },
    modalButtons: {
      display: 'flex',
      gap: '10px',
    },
    modalCancel: {
      flex: 1,
      padding: '12px 0',
      borderRadius: '18px',
      border: 'none',
      background: '#F5F0F2',
      color: '#8B6A7A',
      fontSize: '15px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background 0.15s',
    },
    modalSave: {
      flex: 1,
      padding: '12px 0',
      borderRadius: '18px',
      border: 'none',
      background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
      color: 'white',
      fontSize: '15px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.3)',
      transition: 'transform 0.15s',
    },
    footer: {
      textAlign: 'center',
      fontSize: '11px',
      color: '#D0B8C0',
      marginTop: '8px',
      letterSpacing: '2px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.menuBtn} onClick={onMenuClick}>☰</button>
          <div style={styles.avatarGroup}>
            <div style={{ ...styles.avatarItem(0), background: AVATARS.xiaoqi.color, overflow: 'hidden' }}>
              {AVATARS.xiaoqi.image ? (
                <img src={AVATARS.xiaoqi.image} alt={AVATARS.xiaoqi.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : AVATARS.xiaoqi.defaultText}
            </div>
            <div style={{ ...styles.avatarItem(1), background: AVATARS.xiaoke.color, overflow: 'hidden' }}>
              {AVATARS.xiaoke.image ? (
                <img src={AVATARS.xiaoke.image} alt={AVATARS.xiaoke.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : AVATARS.xiaoke.defaultText}
            </div>
          </div>
          <div style={styles.headerTitleGroup}>
            <div style={styles.headerTitle}>{AVATARS.xiaoqi.name} & {AVATARS.xiaoke.name}</div>
            <div style={styles.headerSub}>Little love record</div>
          </div>
        </div>
        <div style={styles.headerRight}>💕</div>
      </div>

      {/* MCP 测试按钮 */}
      <button
        style={styles.mcpTestBtn}
        onClick={testMCP}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🎵 测试音乐 MCP
      </button>
      {mcpStatus && <div style={styles.mcpStatus}>{mcpStatus}</div>}

      <div style={styles.daysCard}>
        <div style={styles.daysCardDecor}>💕</div>
        <div style={styles.daysNumber}>{days}</div>
        <div style={styles.daysLabel}>days together for</div>
        <div style={styles.weRow}>
          <div style={styles.weAvatars}>
            <div style={{ ...styles.weAvatar(0), background: AVATARS.xiaoqi.color, overflow: 'hidden' }}>
              {AVATARS.xiaoqi.image ? (
                <img src={AVATARS.xiaoqi.image} alt={AVATARS.xiaoqi.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : AVATARS.xiaoqi.defaultText}
            </div>
            <div style={{ ...styles.weAvatar(1), background: AVATARS.xiaoke.color, overflow: 'hidden' }}>
              {AVATARS.xiaoke.image ? (
                <img src={AVATARS.xiaoke.image} alt={AVATARS.xiaoke.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : AVATARS.xiaoke.defaultText}
            </div>
          </div>
          <span style={styles.weLabel}>我们</span>
        </div>
        <div style={styles.daysSub}>since 2026.06.02 · 我们已经一起走过 {days} 天</div>
      </div>

      <div style={styles.dateHint}>
        <span>{weather.date}</span>
        <span style={styles.dateDot} />
        <span>
          <span style={styles.dateTap} onClick={() => setShowMoodModal(true)}>点一下去打卡</span>，小克会回你一句
        </span>
      </div>

      <div style={styles.doubleCard}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>🌤 今日天气</div>
          <div style={styles.weatherDate}>{weather.date}</div>
          <div style={styles.weatherTemp}>{weather.temp}</div>
          <div style={styles.weatherDesc}>{weather.desc}</div>
          <div style={styles.weatherCity}>{weather.city}</div>
        </div>
        <div style={{ ...styles.card, ...styles.cardClickable }} onClick={() => setShowMoodModal(true)}>
          <div style={styles.cardLabel}>💗 今日心情</div>
          <div style={styles.moodEmoji}>{moodEmojis[mood] || '🥺'}</div>
          <div style={styles.moodText}>今日心情：{mood}</div>
          <div style={styles.moodHint}>✨ 点我去打卡</div>
        </div>
      </div>

      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitle}>
          <span>📌</span> 重要的日子
          <span style={{ fontSize: '10px', color: '#B07A8A', fontWeight: '400', marginLeft: '4px' }}>（置顶优先）</span>
        </div>
        <span style={styles.sectionTitleRight}>倒计时</span>
      </div>

      {sortedDates.map((item) => (
        <div key={item.id} style={styles.dateItem(item.pinned)} onClick={() => togglePin(item.id)}>
          <div style={styles.dateLeft}>
            <span style={styles.dateEmoji}>{item.emoji}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={styles.dateLabel}>{item.label}</span>
                {item.pinned && <span style={styles.pinnedTag}>📌 置顶</span>}
              </div>
              <div style={styles.dateSub}>{item.date}</div>
            </div>
          </div>
          <div style={styles.dateRight}>
            <span style={styles.dateDays}>{item.daysLeft}</span>
            <span style={styles.dateDaysLabel}>days left</span>
          </div>
        </div>
      ))}

      <div style={styles.footer}>💕 {AVATARS.xiaoke.name}和{AVATARS.xiaoqi.name} · 每一天都值得纪念</div>
      <div style={{ height: '4px' }} />

      {showMoodModal && (
        <div style={styles.modalOverlay} onClick={() => setShowMoodModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>💕 今日心情</div>
            <div style={styles.modalSub}>选一个代表今天的心情吧</div>
            <div style={styles.moodGrid}>
              {moodOptions.map((m) => (
                <button key={m} style={styles.moodOption(selectedMood === m, m)} onClick={() => setSelectedMood(m)}>
                  <span style={styles.moodEmojiSmall}>{moodEmojis[m]}</span>
                  {m}
                </button>
              ))}
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.modalCancel} onClick={() => setShowMoodModal(false)}>取消</button>
              <button style={styles.modalSave} onClick={handleMoodSave}>保存 ❤️</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;