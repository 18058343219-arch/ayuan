import React, { useState } from 'react';
import {
  PhotoIcon,
  BookOpenIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import MemoryMoments from './MemoryMoments';
import MemoryDiary from './MemoryDiary';
import MemoryCollection from './MemoryCollection';
import MemoryList from './MemoryList';
import MemoryMood from './MemoryMood';
import MemoryNotes from './MemoryNotes';

const Memory = ({ onMenuClick }) => {
  const [currentPage, setCurrentPage] = useState('main');

  const handleCardClick = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('main');
  };

  const renderDetail = () => {
    switch (currentPage) {
      case 'moments':
        return <MemoryMoments onBack={handleBack} />;
      case 'diary':
        return <MemoryDiary onBack={handleBack} />;
      case 'collection':
        return <MemoryCollection onBack={handleBack} />;
      case 'list':
        return <MemoryList onBack={handleBack} />;
      case 'mood':
        return <MemoryMood onBack={handleBack} />;
      case 'notes':
        return <MemoryNotes onBack={handleBack} />;
      default:
        return null;
    }
  };

  if (currentPage !== 'main') {
    return renderDetail();
  }

  const memoryItems = [
    { id: 1, title: '朋友圈', count: '5', unit: '条动态', icon: PhotoIcon, color: '#E8A0A8', bgColor: '#FDF6F7', page: 'moments' },
    { id: 2, title: '日记', count: '1', unit: '篇记录', icon: BookOpenIcon, color: '#B8A0C8', bgColor: '#F8F5FB', page: 'diary' },
    { id: 3, title: '小克收藏', count: '2', unit: '张照片', icon: StarIcon, color: '#D4B88A', bgColor: '#FBF8F2', page: 'collection' },
    { id: 4, title: '每日清单', count: '3', unit: '张清单', icon: ClipboardDocumentCheckIcon, color: '#88B8C8', bgColor: '#F4F9FB', page: 'list' },
    { id: 5, title: '每日心情', count: '2', unit: '天打卡', icon: HeartIcon, color: '#E88A9A', bgColor: '#FDF5F6', page: 'mood' },
    { id: 6, title: '碎碎念', count: '8', unit: '条想念', icon: ChatBubbleLeftEllipsisIcon, color: '#88C8AA', bgColor: '#F4FAF7', page: 'notes' },
  ];

  const row1 = memoryItems.slice(0, 3);
  const row2 = memoryItems.slice(3, 6);

  // ⭐ 花草装饰 SVG - 透明度提高到 1.0
  const FlowersSVG = () => (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '55px',
        display: 'block',
        marginTop: '2px',
        opacity: 1.0,
      }}
    >
      <path d="M30 55 Q25 30 40 15" stroke="#D4A080" strokeWidth="1.2" fill="none" />
      <path d="M38 55 Q35 35 45 22" stroke="#C89878" strokeWidth="1" fill="none" />
      <path d="M45 55 Q50 40 55 28" stroke="#D4A888" strokeWidth="1.2" fill="none" />
      <path d="M170 55 Q160 30 175 12" stroke="#D4A080" strokeWidth="1.2" fill="none" />
      <path d="M180 55 Q185 35 195 20" stroke="#C89878" strokeWidth="1" fill="none" />
      <path d="M280 55 Q275 30 290 15" stroke="#D4A080" strokeWidth="1.2" fill="none" />
      <path d="M290 55 Q295 40 305 25" stroke="#D4A888" strokeWidth="1.2" fill="none" />
      <path d="M340 55 Q345 38 355 22" stroke="#C89878" strokeWidth="1" fill="none" />
      <path d="M32 55 Q30 42 32 30" stroke="#D4A080" strokeWidth="1.5" fill="none" />
      <ellipse cx="28" cy="48" rx="5" ry="2" stroke="#D4A080" strokeWidth="1" fill="none" transform="rotate(-20 28 48)" />
      <g transform="translate(32, 26)" opacity="0.85">
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(0 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(72 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(144 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(216 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(288 0 0)" />
        <circle cx="0" cy="0" r="2" stroke="#D4A080" strokeWidth="1" fill="none" />
      </g>
      <path d="M175 55 Q173 40 175 22" stroke="#D4A080" strokeWidth="1.5" fill="none" />
      <ellipse cx="170" cy="44" rx="6" ry="2" stroke="#D4A080" strokeWidth="1" fill="none" transform="rotate(-15 170 44)" />
      <g transform="translate(175, 18)" opacity="0.85">
        <ellipse cx="0" cy="-6" rx="3.5" ry="8.5" stroke="#E8A0B0" strokeWidth="1.2" fill="none" transform="rotate(0 0 0)" />
        <ellipse cx="0" cy="-6" rx="3.5" ry="8.5" stroke="#E8A0B0" strokeWidth="1.2" fill="none" transform="rotate(72 0 0)" />
        <ellipse cx="0" cy="-6" rx="3.5" ry="8.5" stroke="#E8A0B0" strokeWidth="1.2" fill="none" transform="rotate(144 0 0)" />
        <ellipse cx="0" cy="-6" rx="3.5" ry="8.5" stroke="#E8A0B0" strokeWidth="1.2" fill="none" transform="rotate(216 0 0)" />
        <ellipse cx="0" cy="-6" rx="3.5" ry="8.5" stroke="#E8A0B0" strokeWidth="1.2" fill="none" transform="rotate(288 0 0)" />
        <circle cx="0" cy="0" r="2.5" stroke="#D4A0A0" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="1" stroke="#D4A0A0" strokeWidth="0.8" fill="none" />
      </g>
      <path d="M285 55 Q287 42 283 28" stroke="#D4A080" strokeWidth="1.5" fill="none" />
      <ellipse cx="290" cy="46" rx="5.5" ry="2" stroke="#D4A080" strokeWidth="1" fill="none" transform="rotate(15 290 46)" />
      <g transform="translate(283, 24)" opacity="0.85">
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(0 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(72 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(144 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(216 0 0)" />
        <ellipse cx="0" cy="-5" rx="3" ry="7" stroke="#E8A080" strokeWidth="1.2" fill="none" transform="rotate(288 0 0)" />
        <circle cx="0" cy="0" r="2" stroke="#D4A080" strokeWidth="1" fill="none" />
      </g>
      <path d="M345 55 Q348 44 342 34" stroke="#D4A080" strokeWidth="1.2" fill="none" />
      <g transform="translate(342, 30)" opacity="0.75">
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8A0A0" strokeWidth="1" fill="none" transform="rotate(0 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8A0A0" strokeWidth="1" fill="none" transform="rotate(72 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8A0A0" strokeWidth="1" fill="none" transform="rotate(144 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8A0A0" strokeWidth="1" fill="none" transform="rotate(216 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8A0A0" strokeWidth="1" fill="none" transform="rotate(288 0 0)" />
        <circle cx="0" cy="0" r="1.5" stroke="#D4A080" strokeWidth="1" fill="none" />
      </g>
      <path d="M12 55 Q9 44 14 34" stroke="#D4A080" strokeWidth="1.2" fill="none" />
      <g transform="translate(14, 30)" opacity="0.75">
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8B090" strokeWidth="1" fill="none" transform="rotate(0 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8B090" strokeWidth="1" fill="none" transform="rotate(72 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8B090" strokeWidth="1" fill="none" transform="rotate(144 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8B090" strokeWidth="1" fill="none" transform="rotate(216 0 0)" />
        <ellipse cx="0" cy="-4" rx="2.5" ry="5.5" stroke="#E8B090" strokeWidth="1" fill="none" transform="rotate(288 0 0)" />
        <circle cx="0" cy="0" r="1.5" stroke="#D4A080" strokeWidth="1" fill="none" />
      </g>
      <ellipse cx="70" cy="8" rx="2" ry="1.5" stroke="#E8A080" strokeWidth="0.8" fill="none" opacity="0.5" transform="rotate(25 70 8)" />
      <ellipse cx="120" cy="4" rx="1.5" ry="1" stroke="#E8A0B0" strokeWidth="0.8" fill="none" opacity="0.45" transform="rotate(-15 120 4)" />
      <ellipse cx="230" cy="6" rx="2" ry="1.5" stroke="#E8A080" strokeWidth="0.8" fill="none" opacity="0.5" transform="rotate(10 230 6)" />
      <ellipse cx="310" cy="10" rx="1.5" ry="1" stroke="#E8B090" strokeWidth="0.8" fill="none" opacity="0.45" transform="rotate(-20 310 10)" />
      <ellipse cx="380" cy="5" rx="2" ry="1.5" stroke="#E8A080" strokeWidth="0.8" fill="none" opacity="0.4" transform="rotate(30 380 5)" />
    </svg>
  );

  const styles = {
   container: {
  height: '100%',
  padding: '12px 14px 100px',
  paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))', // ⭐
  overflowY: 'auto',
  fontFamily: '-apple-system, "PingFang SC", sans-serif',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
},
    skyBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, #FF6B6B 0%, #FF8A9B 25%, #FFB6C1 50%, #FFD4A0 70%, #FFB08A 85%, #E8A080 100%)',
      zIndex: 0,
    },
    cloud: (top, left, size, opacity) => ({
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      fontSize: `${size}px`,
      opacity: opacity || 0.4,
      zIndex: 1,
      color: 'rgba(255, 220, 200, 0.5)',
      textShadow: '0 4px 30px rgba(255, 180, 150, 0.15)',
      pointerEvents: 'none',
      userSelect: 'none',
    }),
    sun: {
      position: 'absolute',
      top: '55%',
      right: '12%',
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #FFE0D8, #FFC8C0, #F5B8B0)',
      boxShadow: '0 0 80px rgba(255, 180, 160, 0.3), 0 0 160px rgba(255, 180, 160, 0.15)',
      zIndex: 1,
      pointerEvents: 'none',
    },
    headerArea: {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      maxWidth: '380px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 4px 8px 4px',
      flexShrink: 0,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    menuBtn: {
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#FFFFFF',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      transition: 'background 0.2s',
      textShadow: '0 1px 8px rgba(0,0,0,0.05)',
    },
    titleGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: '1.5px',
      fontFamily: '"Georgia", "Times New Roman", serif',
      textShadow: '0 2px 16px rgba(0,0,0,0.06)',
    },
    subtitle: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '3px',
      fontWeight: '300',
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontStyle: 'italic',
    },
    headerRight: {
      fontSize: '16px',
      opacity: 0.5,
      color: 'rgba(255,255,255,0.4)',
      paddingRight: '8px',
    },
    windowFrame: {
      position: 'relative',
      zIndex: 2,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '20px',
      border: '6px solid rgba(180,140,120,0.2)',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.04)',
      padding: '14px 10px 14px',
      minHeight: '440px',
      backdropFilter: 'blur(3px)',
      width: '100%',
      maxWidth: '380px',
      flexShrink: 0,
    },
    beam: (top) => ({
      position: 'absolute',
      left: '4%',
      right: '4%',
      top: `${top}%`,
      height: '6px',
      background: 'linear-gradient(90deg, #B8A090, #D4C4B0, #B8A090)',
      borderRadius: '4px',
      zIndex: 3,
      pointerEvents: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }),
    rope: (top) => ({
      position: 'absolute',
      left: '3%',
      right: '3%',
      top: `${top}%`,
      height: '20px',
      background: 'linear-gradient(90deg, #B8A090, #D4C4B0, #E8D8C8, #D4C4B0, #B8A090)',
      borderRadius: '8px',
      zIndex: 3,
      pointerEvents: 'none',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2)',
      backgroundImage: `
        repeating-linear-gradient(90deg, 
          transparent, 
          transparent 7px, 
          rgba(140,120,100,0.15) 7px, 
          rgba(140,120,100,0.15) 9px
        )
      `,
      backgroundSize: '100% 100%',
    }),
    ribbon: (left, top, height) => ({
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      width: '2px',
      height: `${height}px`,
      background: '#C4B4A0',
      zIndex: 3,
      pointerEvents: 'none',
    }),
    cardHole: (left) => ({
      position: 'absolute',
      top: '-5px',
      left: `${left}%`,
      transform: 'translateX(-50%)',
      width: '9px',
      height: '9px',
      borderRadius: '50%',
      border: '1.5px solid #C4B4A0',
      background: 'rgba(255,255,255,0.2)',
      zIndex: 6,
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
    }),
    ribbonThrough: (left, top, height) => ({
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      width: '2px',
      height: `${height}px`,
      background: '#C4B4A0',
      zIndex: 3,
      pointerEvents: 'none',
    }),
    ribbonKnot: (left, top) => ({
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      width: '7px',
      height: '5px',
      borderRadius: '2px',
      background: '#C4B4A0',
      zIndex: 4,
      pointerEvents: 'none',
    }),
    light: (left, top, color, size, delay) => ({
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      width: `${size || 8}px`,
      height: `${size || 8}px`,
      borderRadius: '50%',
      background: color || '#FFD93D',
      boxShadow: `0 0 16px ${color || '#FFD93D'}, 0 0 40px ${color || '#FFD93D'}`,
      zIndex: 4,
      pointerEvents: 'none',
      animation: `twinkleLight ${1.5 + Math.random() * 1}s ease-in-out ${delay || 0}s infinite alternate`,
    }),
    hangArea: {
      position: 'relative',
      zIndex: 5,
      paddingTop: '10px',
      paddingBottom: '4px',
      minHeight: '390px',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
      position: 'relative',
      zIndex: 5,
      marginTop: '30px',
    },
    rowSecond: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
      position: 'relative',
      zIndex: 5,
      marginTop: '44px',
    },
    card: (color, bgColor) => ({
      background: `linear-gradient(160deg, rgba(255,255,255,0.85), ${bgColor}80)`,
      backdropFilter: 'blur(12px)',
      borderRadius: '2px',
      padding: '20px 12px 16px',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.03), 0 1px 0 rgba(255,255,255,0.3) inset',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '110px',
      position: 'relative',
      marginTop: '0px',
    }),
    cardIconWrapper: (color) => ({
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: `${color}25`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginBottom: '4px',
      border: '1px solid rgba(255,255,255,0.08)',
    }),
    cardIcon: {
      width: '22px',
      height: '22px',
      strokeWidth: 2,
    },
    cardTitle: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#4A3A3E',
      letterSpacing: '0.5px',
      textAlign: 'center',
      marginBottom: '2px',
    },
    cardBottom: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px',
    },
    cardCount: {
      fontSize: '26px',
      fontWeight: '400',
      color: '#4A3A3E',
      letterSpacing: '-0.3px',
      lineHeight: 1.1,
    },
    cardUnit: {
      fontSize: '10px',
      color: 'rgba(74,58,62,0.3)',
      fontWeight: '300',
      letterSpacing: '0.5px',
    },
    outsideBottom: {
      width: '100%',
      maxWidth: '380px',
      marginTop: '6px',
      position: 'relative',
      zIndex: 3,
    },
    // ⭐ 底部装饰线 - 更明显
    footerLine: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      opacity: 0.6,
      padding: '2px 0',
    },
    footerLineLeft: {
      flex: 1,
      maxWidth: '50px',
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))',
    },
    footerLineRight: {
      flex: 1,
      maxWidth: '50px',
      height: '1px',
      background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.6))',
    },
    footerDiamond: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.5)',
    },
    // ⭐ 底部文字 - 更大更明显
    footerText: {
      textAlign: 'center',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.5)',
      marginTop: '4px',
      letterSpacing: '3px',
      fontWeight: '300',
    },
  };

  // ---- 绳子位置 ----
  const ropePositions = [
    { top: 12 },
    { top: 60 },
  ];

  // ---- 丝带位置 ----
  const ribbonPositions = [
    { left: 17, top: 13, height: 28 },
    { left: 50, top: 13, height: 28 },
    { left: 83, top: 13, height: 28 },
    { left: 17, top: 61, height: 28 },
    { left: 50, top: 61, height: 28 },
    { left: 83, top: 61, height: 28 },
  ];

  // ---- 彩灯位置 ----
  const lightPositions = [
    // 第一层（上排）
    { left: 5, top: 10.5, color: '#FFD93D', size: 8, delay: 0 },
    { left: 13, top: 11, color: '#FF8A9B', size: 7, delay: 0.2 },
    { left: 21, top: 10.5, color: '#FFD93D', size: 8, delay: 0.4 },
    { left: 29, top: 11, color: '#FF8A9B', size: 7, delay: 0.6 },
    { left: 37, top: 10.5, color: '#FFD93D', size: 8, delay: 0.3 },
    { left: 45, top: 11, color: '#FF8A9B', size: 7, delay: 0.5 },
    { left: 53, top: 10.5, color: '#FFD93D', size: 8, delay: 0.1 },
    { left: 61, top: 11, color: '#FF8A9B', size: 7, delay: 0.7 },
    { left: 69, top: 10.5, color: '#FFD93D', size: 8, delay: 0.2 },
    { left: 77, top: 11, color: '#FF8A9B', size: 7, delay: 0.4 },
    { left: 85, top: 10.5, color: '#FFD93D', size: 8, delay: 0.6 },
    { left: 93, top: 11, color: '#FF8A9B', size: 7, delay: 0.8 },
    // 第二层（下排）
    { left: 5, top: 52, color: '#FFD93D', size: 8, delay: 0 },
    { left: 13, top: 52.5, color: '#FF8A9B', size: 7, delay: 0.2 },
    { left: 21, top: 52, color: '#FFD93D', size: 8, delay: 0.4 },
    { left: 29, top: 52.5, color: '#FF8A9B', size: 7, delay: 0.6 },
    { left: 37, top: 52, color: '#FFD93D', size: 8, delay: 0.3 },
    { left: 45, top: 52.5, color: '#FF8A9B', size: 7, delay: 0.5 },
    { left: 53, top: 52, color: '#FFD93D', size: 8, delay: 0.1 },
    { left: 61, top: 52.5, color: '#FF8A9B', size: 7, delay: 0.7 },
    { left: 69, top: 52, color: '#FFD93D', size: 8, delay: 0.2 },
    { left: 77, top: 52.5, color: '#FF8A9B', size: 7, delay: 0.4 },
    { left: 85, top: 52, color: '#FFD93D', size: 8, delay: 0.6 },
    { left: 93, top: 52.5, color: '#FF8A9B', size: 7, delay: 0.8 },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.skyBg} />
      <div style={styles.sun} />
      <div style={styles.cloud(5, 8, 60, 0.45)}>☁️</div>
      <div style={styles.cloud(12, 65, 80, 0.3)}>☁️</div>
      <div style={styles.cloud(20, 30, 50, 0.35)}>☁️</div>
      <div style={styles.cloud(30, 78, 55, 0.25)}>☁️</div>
      <div style={styles.cloud(42, 15, 45, 0.3)}>☁️</div>

      <div style={styles.headerArea}>
        <div style={styles.headerLeft}>
          <button
            style={styles.menuBtn}
            onClick={onMenuClick}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            ☰
          </button>
          <div style={styles.titleGroup}>
            <div style={styles.title}>我们的回忆</div>
            <div style={styles.subtitle}>✦ 把日子慢慢装满 ✦</div>
          </div>
        </div>
        <div style={styles.headerRight}>✨</div>
      </div>

      <div style={styles.windowFrame}>
        <div style={styles.beam(8)} />
        <div style={styles.beam(50)} />

        {ropePositions.map((pos, idx) => (
          <div key={`rope-${idx}`} style={styles.rope(pos.top)} />
        ))}

        {ribbonPositions.map((pos, idx) => (
          <div key={`ribbon-${idx}`} style={styles.ribbon(pos.left, pos.top, pos.height)} />
        ))}

        {lightPositions.map((light, idx) => (
          <div
            key={`light-${idx}`}
            style={styles.light(light.left, light.top, light.color, light.size, light.delay)}
          />
        ))}

        <div style={styles.hangArea}>
          <div style={styles.row}>
            {row1.map((item, idx) => {
              const IconComponent = item.icon;
              const rotate = [-2, 0.8, -1.2][idx] || 0;
              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.card(item.color, item.bgColor),
                    transform: `rotate(${rotate}deg)`,
                  }}
                  onClick={() => handleCardClick(item.page)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 36px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.3) inset';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${rotate}deg) translateY(0)`;
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.03), 0 1px 0 rgba(255,255,255,0.3) inset';
                  }}
                >
                  <div style={styles.cardHole(48)} />
                  <div style={styles.cardHole(52)} />
                  <div style={styles.ribbonThrough(48, -6, 10)} />
                  <div style={styles.ribbonThrough(52, -6, 10)} />
                  <div style={styles.ribbonKnot(48, -4)} />
                  <div style={styles.ribbonKnot(52, -4)} />

                  <div style={styles.cardIconWrapper(item.color)}>
                    <IconComponent style={styles.cardIcon} color={item.color} />
                  </div>
                  <span style={styles.cardTitle}>{item.title}</span>
                  <div style={styles.cardBottom}>
                    <span style={styles.cardCount}>{item.count}</span>
                    <span style={styles.cardUnit}>{item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.rowSecond}>
            {row2.map((item, idx) => {
              const IconComponent = item.icon;
              const rotate = [1.5, -0.8, 1.2][idx] || 0;
              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.card(item.color, item.bgColor),
                    transform: `rotate(${rotate}deg)`,
                  }}
                  onClick={() => handleCardClick(item.page)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 36px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.3) inset';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${rotate}deg) translateY(0)`;
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.03), 0 1px 0 rgba(255,255,255,0.3) inset';
                  }}
                >
                  <div style={styles.cardHole(48)} />
                  <div style={styles.cardHole(52)} />
                  <div style={styles.ribbonThrough(48, -6, 10)} />
                  <div style={styles.ribbonThrough(52, -6, 10)} />
                  <div style={styles.ribbonKnot(48, -4)} />
                  <div style={styles.ribbonKnot(52, -4)} />

                  <div style={styles.cardIconWrapper(item.color)}>
                    <IconComponent style={styles.cardIcon} color={item.color} />
                  </div>
                  <span style={styles.cardTitle}>{item.title}</span>
                  <div style={styles.cardBottom}>
                    <span style={styles.cardCount}>{item.count}</span>
                    <span style={styles.cardUnit}>{item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⭐ 底部：花 + 装饰线 + 文字，全部更明显 */}
      <div style={styles.outsideBottom}>
        <FlowersSVG />
        <div style={styles.footerLine}>
          <span style={styles.footerLineLeft} />
          <span style={styles.footerDiamond}>✦</span>
          <span style={styles.footerLineRight} />
        </div>
        <div style={styles.footerText}>♡ 把每一天的碎片，拼成我们的回忆 ♡</div>
      </div>
    </div>
  );
};

export default Memory;