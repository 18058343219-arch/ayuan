import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
useEffect(() => {
  let startX = 0;
  let startY = 0;
  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    if (!isOpen) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -50) {
      onClose();
    }
  };
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  return () => {
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
  };
}, [isOpen, onClose]);
  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 禁止body滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const menuItems = [
    { icon: '🏠', label: '主页', path: '/home' },
    { icon: '💬', label: '聊天', path: '/chat' },
    { icon: '📖', label: '日记', path: '/memory' },
    { icon: '🎵', label: '一起听', path: '/together' },
    { icon: '📅', label: '纪念日', path: '/anniversary' },
    { icon: '📋', label: '每日清单', path: '/daily' },
    { icon: '🌸', label: '经期记录', path: '/period' },
    { icon: '⚙️', label: '设置', path: '/mine' },
  ];

  const stats = [
    { label: '消息数', value: '128' },
    { label: '照片', value: '46' },
    { label: '日记', value: '12' },
    { label: '在一起', value: '44天' },
  ];

  // 样式
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 999,
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
      transition: 'opacity 0.3s ease',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '300px',
      maxWidth: '85vw',
      background: 'linear-gradient(180deg, #FFF5F7 0%, #FFE8EE 100%)',
      boxShadow: '4px 0 40px rgba(255, 105, 180, 0.15)',
      zIndex: 1000,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRight: '1px solid rgba(255, 182, 193, 0.2)',
    },
    // 顶部用户信息
    userSection: {
      padding: '24px 20px 16px',
      background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(255, 105, 180, 0.05))',
      borderBottom: '1px solid rgba(255, 182, 193, 0.15)',
      flexShrink: 0,
    },
    userRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    avatarLarge: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FFB6C1, #DB7093)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '22px',
      fontWeight: 'bold',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.3)',
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#5A3E4A',
    },
    userSub: {
      fontSize: '12px',
      color: '#FF8FA3',
      marginTop: '2px',
    },
    closeBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.5)',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#8B5A6B',
      transition: 'background 0.2s',
      flexShrink: 0,
    },
    // 统计数据
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '4px',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.3)',
      borderBottom: '1px solid rgba(255, 182, 193, 0.1)',
      flexShrink: 0,
    },
    statItem: {
      textAlign: 'center',
    },
    statValue: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#DB7093',
    },
    statLabel: {
      fontSize: '10px',
      color: '#B07A8A',
      marginTop: '1px',
    },
    // 菜单列表
    menuList: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 0 20px',
    },
    menuItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '12px 20px',
      textDecoration: 'none',
      color: isActive ? '#DB7093' : '#5A3E4A',
      background: isActive ? 'rgba(255, 182, 193, 0.2)' : 'transparent',
      borderLeft: isActive ? '3px solid #FF69B4' : '3px solid transparent',
      transition: 'background 0.15s, color 0.15s',
      fontSize: '15px',
      fontWeight: isActive ? '600' : '400',
    }),
    menuIcon: {
      fontSize: '20px',
      width: '28px',
      textAlign: 'center',
    },
    // 底部
    footer: {
      padding: '16px 20px',
      borderTop: '1px solid rgba(255, 182, 193, 0.1)',
      fontSize: '11px',
      color: '#B07A8A',
      textAlign: 'center',
      flexShrink: 0,
      background: 'rgba(255,255,255,0.2)',
    },
    version: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      alignItems: 'center',
    },
  };

  return (
    <>
      {/* 遮罩层 */}
      <div style={styles.overlay} onClick={onClose} />

      {/* 侧边栏 */}
      <div ref={sidebarRef} style={styles.sidebar}>
        {/* 顶部：用户信息 */}
        <div style={styles.userSection}>
          <div style={styles.userRow}>
            <div style={styles.avatarLarge}>💕</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>小棋 & 小克</div>
              <div style={styles.userSub}>💕 在一起 44 天</div>
            </div>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* 统计数据 */}
        <div style={styles.statsSection}>
          {stats.map((item, idx) => (
            <div key={idx} style={styles.statItem}>
              <div style={styles.statValue}>{item.value}</div>
              <div style={styles.statLabel}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* 菜单列表 */}
        <div style={styles.menuList}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => styles.menuItem(isActive)}
              onClick={onClose}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* 底部 */}
        <div style={styles.footer}>
          <div style={styles.version}>
            <span>❤️ Vivi & Abyss</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;