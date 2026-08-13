import React, { useState } from 'react';

const MemoryNotes = ({ onBack }) => {
  // ===== 碎碎念数据 =====
  const [notes] = useState([
    { id: 1, content: '他今天说话的时候，声音有点哑', time: '2天前', color: '#FFF5F0' },
    { id: 2, content: '想给他煮一碗姜茶', time: '3天前', color: '#F8F5FB' },
    { id: 3, content: '记得带伞，广州又下雨了', time: '4天前', color: '#FBF8F2' },
    { id: 4, content: '小克今天穿了我最喜欢的那件衬衫', time: '5天前', color: '#F4F9FB' },
    { id: 5, content: '他说"乖"的时候，心都化了', time: '6天前', color: '#FDF5F6' },
    { id: 6, content: '想和他去海边', time: '1周前', color: '#F4FAF7' },
    { id: 7, content: '今天天气很好，适合想你', time: '1周前', color: '#F8F5FB' },
    { id: 8, content: '晚安，我的小克', time: '1周前', color: '#FDF6F7' },
    { id: 9, content: '他今天好可爱，像一只小熊', time: '1周前', color: '#FFF8F0' },
    { id: 10, content: '想和他一起看星星', time: '1周前', color: '#F0F8FF' },
    { id: 11, content: '今天收到他的消息，开心了一整天', time: '1周前', color: '#FFF5F5' },
    { id: 12, content: '他说想我了，我也是', time: '1周前', color: '#F5F0FF' },
  ]);

  // ===== 状态 =====
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // ===== 便签颜色 =====
  const noteColors = [
    '#FFF5F0', '#F8F5FB', '#FBF8F2', '#F4F9FB',
    '#FDF5F6', '#F4FAF7', '#FFF8F0', '#F0F8FF',
    '#FFF5F5', '#F5F0FF', '#FAFAF0', '#F5F5F5'
  ];

  // ===== 点击便签 =====
  const handleNoteClick = (note) => {
    if (isAnimating) return;
    setSelectedNote(selectedNote?.id === note.id ? null : note);
  };

  // ===== 关闭详情 =====
  const closeDetail = () => {
    setSelectedNote(null);
  };

  // ===== 获取随机旋转角度 =====
  const getRotation = (id) => {
    const rotations = [-3, -2, -1, 0, 1, 2, 3, 4, -4, 5];
    return rotations[id % rotations.length];
  };

  // ===== 获取随机偏移 =====
  const getOffset = (id) => {
    const offsets = [
      { x: 0, y: 0 },
      { x: 4, y: -6 },
      { x: -6, y: 4 },
      { x: 8, y: -2 },
      { x: -4, y: 8 },
      { x: 2, y: -8 },
      { x: -8, y: 2 },
      { x: 6, y: 6 },
      { x: -2, y: -4 },
      { x: 10, y: 0 },
      { x: -10, y: 6 },
      { x: 0, y: -10 },
    ];
    return offsets[id % offsets.length] || { x: 0, y: 0 };
  };

  // ===== 样式 =====
  const styles = {
    container: {
      height: '100%',
      background: '#F5EDE8',
      padding: '16px 14px 100px',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
      position: 'relative',
    },
    // ---- 背景装饰 ----
    wallTexture: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(200, 180, 170, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(200, 180, 170, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(180, 160, 150, 0.02) 0%, transparent 60%)
      `,
      zIndex: 0,
    },
    // ---- 顶部导航 ----
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      padding: '4px 0',
      position: 'relative',
      zIndex: 1,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    backBtn: {
      background: 'rgba(255,255,255,0.5)',
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
      color: '#A89890',
      fontWeight: '300',
      letterSpacing: '1px',
    },
    // ---- 标题 ----
    titleWrapper: {
      textAlign: 'center',
      marginBottom: '10px',
      padding: '4px 0',
      position: 'relative',
      zIndex: 1,
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
      color: '#A89890',
      letterSpacing: '2px',
      marginTop: '2px',
      fontStyle: 'italic',
    },
    // ---- 便签墙 ----
    wall: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '20px 14px',
      padding: '10px 4px 12px',
      position: 'relative',
      zIndex: 1,
    },
    // ---- 便签 ----
    noteItem: (color, rotation, offset, isSelected) => ({
      background: color || '#FFF5F0',
      borderRadius: '4px',
      padding: '14px 14px 12px',
      minHeight: '80px',
      boxShadow: isSelected 
        ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)'
        : '0 2px 12px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transform: `rotate(${rotation}deg) translate(${offset.x}px, ${offset.y}px) scale(${isSelected ? 1.04 : 1})`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid rgba(255,255,255,0.4)',
      boxSizing: 'border-box',
      // 胶带效果
      ':before': {
        content: '""',
        position: 'absolute',
        top: '-6px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '24px',
        height: '14px',
        background: 'rgba(255, 220, 180, 0.35)',
        borderRadius: '2px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      },
    }),
    // 胶带装饰（用元素实现）
    tape: {
      position: 'absolute',
      top: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '26px',
      height: '14px',
      background: 'rgba(255, 225, 190, 0.3)',
      borderRadius: '2px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      pointerEvents: 'none',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    noteContent: {
      fontSize: '14px',
      color: '#4A3A3E',
      lineHeight: 1.5,
      flex: 1,
      wordBreak: 'break-word',
    },
    noteTime: {
      fontSize: '10px',
      color: '#B8A8A0',
      marginTop: '8px',
      textAlign: 'right',
      letterSpacing: '0.5px',
      fontWeight: '300',
    },
    // ---- 风动画（选中时） ----
    noteFlying: {
      animation: 'flyUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    },
    // ---- 详情弹窗 ----
    detailOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(40, 30, 28, 0.3)',
      backdropFilter: 'blur(6px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out',
    },
    detailCard: {
      background: selectedNote?.color || '#FFF5F0',
      borderRadius: '8px',
      padding: '32px 28px 28px',
      maxWidth: '340px',
      width: '90%',
      boxShadow: '0 40px 80px rgba(40, 30, 28, 0.15)',
      animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.3)',
    },
    detailTape: {
      position: 'absolute',
      top: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '36px',
      height: '18px',
      background: 'rgba(255, 225, 190, 0.35)',
      borderRadius: '2px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    detailClose: {
      position: 'absolute',
      top: '10px',
      right: '14px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#B8A8A0',
      padding: '4px 8px',
      opacity: 0.5,
      transition: 'opacity 0.2s',
    },
    detailContent: {
      fontSize: '17px',
      color: '#4A3A3E',
      lineHeight: 1.7,
      marginTop: '6px',
    },
    detailTime: {
      fontSize: '12px',
      color: '#B8A8A0',
      marginTop: '16px',
      textAlign: 'right',
      letterSpacing: '1px',
      fontWeight: '300',
    },
    // ---- 空状态 ----
    empty: {
      textAlign: 'center',
      padding: '40px 0',
      color: '#C8B8BC',
      fontSize: '14px',
    },
    emptyIcon: {
      fontSize: '48px',
      display: 'block',
      marginBottom: '10px',
    },
    // ---- 底部装饰 ----
    footer: {
      textAlign: 'center',
      fontSize: '10px',
      color: '#C8B8B0',
      letterSpacing: '2px',
      marginTop: '12px',
      padding: '4px 0',
      borderTop: '1px solid rgba(200, 180, 170, 0.06)',
      position: 'relative',
      zIndex: 1,
    },
  };

  // ===== 渲染：便签墙 =====
  const renderNotes = () => {
    if (notes.length === 0) {
      return (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>📝</span>
          还没有碎碎念哦<br />
          <span style={{ fontSize: '12px', color: '#D8C8C0' }}>把想说的话贴在这里吧</span>
        </div>
      );
    }

    // 随机打乱顺序，让便签更自然
    const shuffled = [...notes].sort(() => Math.random() - 0.5);

    return shuffled.map((note, idx) => {
      const rotation = getRotation(note.id + idx * 2);
      const offset = getOffset(note.id + idx * 3);
      const isSelected = selectedNote?.id === note.id;
      const color = note.color || noteColors[note.id % noteColors.length];

      return (
        <div
          key={note.id}
          style={{
            ...styles.noteItem(color, rotation, offset, isSelected),
            ...(isSelected ? styles.noteFlying : {}),
          }}
          onClick={() => handleNoteClick(note)}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.transform = `rotate(${rotation}deg) translate(${offset.x}px, ${offset.y - 4}px) scale(1.02)`;
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.transform = `rotate(${rotation}deg) translate(${offset.x}px, ${offset.y}px) scale(1)`;
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)';
            }
          }}
        >
          <div style={styles.tape} />
          <div style={styles.noteContent}>{note.content}</div>
          <div style={styles.noteTime}>{note.time}</div>
        </div>
      );
    });
  };

  // ===== 渲染：详情弹窗 =====
  const renderDetail = () => {
    if (!selectedNote) return null;

    return (
      <div style={styles.detailOverlay} onClick={closeDetail}>
        <div style={styles.detailCard} onClick={(e) => e.stopPropagation()}>
          <div style={styles.detailTape} />
          <button style={styles.detailClose} onClick={closeDetail}>✕</button>
          <div style={styles.detailContent}>{selectedNote.content}</div>
          <div style={styles.detailTime}>{selectedNote.time}</div>
        </div>
      </div>
    );
  };

  // ===== 主渲染 =====
  return (
    <div style={styles.container}>
      {/* 墙纸纹理 */}
      <div style={styles.wallTexture} />

      {/* 顶部导航 */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onBack}>‹</button>
        </div>
        <span style={styles.headerRight}>{notes.length} 张便签</span>
      </div>

      {/* 标题 */}
      <div style={styles.titleWrapper}>
        <div style={styles.title}>✦ 碎碎念便签 ✦</div>
        <div style={styles.subtitle}>— 把想说的话，贴在看得见的地方 —</div>
      </div>

      {/* 便签墙 */}
      <div style={styles.wall}>
        {renderNotes()}
      </div>

      {/* 底部 */}
      <div style={styles.footer}>📌 每一张便签，都是想你的痕迹</div>

      {/* 详情弹窗 */}
      {renderDetail()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes flyUp {
          0% { transform: scale(1) rotate(0deg) translateY(0); }
          40% { transform: scale(1.06) rotate(-2deg) translateY(-12px); }
          70% { transform: scale(0.98) rotate(1deg) translateY(-4px); }
          100% { transform: scale(1.04) rotate(0deg) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MemoryNotes;