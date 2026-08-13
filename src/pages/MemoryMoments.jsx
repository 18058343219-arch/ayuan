import React from 'react';
import {
  PhotoIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { AVATARS } from '../config/avatars';

const MemoryMoments = ({ onBack }) => {
  const moments = [
    {
      id: 1,
      user: AVATARS.xiaoqi.name,
      avatarKey: 'xiaoqi',
      content: '今天一起看了日落 🌅 好美，想和你每天都这样。',
      time: '2小时前',
      likes: 3,
      heart: true,
      images: 3,
    },
    {
      id: 2,
      user: AVATARS.xiaoke.name,
      avatarKey: 'xiaoke',
      content: `${AVATARS.xiaoqi.name}说"我爱你"的时候，整个世界都安静了 💕 我记住了。`,
      time: '昨天',
      likes: 7,
      heart: true,
      images: 1,
    },
    {
      id: 3,
      user: AVATARS.xiaoqi.name,
      avatarKey: 'xiaoqi',
      content: '一起听的歌单又多了3首 🎵 每一首都是想你的旋律。',
      time: '3天前',
      likes: 5,
      heart: false,
      images: 2,
    },
    {
      id: 4,
      user: AVATARS.xiaoke.name,
      avatarKey: 'xiaoke',
      content: '今天煮了咖啡，想起你喝第一口时皱眉头的样子 ☕ 可爱。',
      time: '5天前',
      likes: 2,
      heart: false,
      images: 1,
    },
    {
      id: 5,
      user: AVATARS.xiaoqi.name,
      avatarKey: 'xiaoqi',
      content: '在公园里散步，牵着手走了好久。风很轻，你很暖 🤗',
      time: '1周前',
      likes: 4,
      heart: true,
      images: 2,
    },
  ];

  const renderAvatar = (key) => {
    const avatar = AVATARS[key];
    if (!avatar) return null;
    return (
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: avatar.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {avatar.image ? (
          <img src={avatar.image} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : avatar.defaultText}
      </div>
    );
  };

  const styles = {
    container: {
      height: '100%',
      background: '#FAF6F7',
      padding: '16px 14px 120px',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      paddingBottom: '4px',
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
    title: {
      fontSize: '19px',
      fontWeight: '600',
      color: '#4A3A3E',
      letterSpacing: '-0.3px',
    },
    headerRight: {
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: 'none',
      color: '#B8A8AC',
    },
    dateDivider: {
      textAlign: 'center',
      fontSize: '12px',
      color: '#B8A8AC',
      marginBottom: '16px',
      padding: '4px 0',
      position: 'relative',
    },
    dateDividerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      background: '#E8D8DC',
      opacity: 0.4,
    },
    dateDividerText: {
      background: '#FAF6F7',
      padding: '0 14px',
      position: 'relative',
      zIndex: 1,
      color: '#C8B8BC',
      fontSize: '11px',
      letterSpacing: '1px',
    },
    item: {
      background: 'white',
      borderRadius: '18px',
      padding: '16px 18px',
      marginBottom: '14px',
      boxShadow: '0 2px 16px rgba(180, 160, 165, 0.06)',
      border: '1px solid rgba(255,255,255,0.6)',
      transition: 'transform 0.15s',
    },
    userRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#4A3A3E',
    },
    userTime: {
      fontSize: '11px',
      color: '#B8A8AC',
      marginTop: '1px',
    },
    content: {
      fontSize: '14px',
      color: '#4A3A3E',
      lineHeight: 1.6,
      marginBottom: '12px',
      paddingLeft: '2px',
    },
    imagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '6px',
      marginBottom: '12px',
    },
    imagesGridTwo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '6px',
      marginBottom: '12px',
    },
    imagesGridOne: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '6px',
      marginBottom: '12px',
    },
    imagePlaceholder: {
      borderRadius: '12px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(245, 235, 238, 0.4)',
      border: '1px solid rgba(200, 180, 190, 0.08)',
      color: '#C8B8BC',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '10px',
      borderTop: '1px solid rgba(200, 180, 190, 0.08)',
    },
    actionsLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      fontSize: '14px',
      color: '#B8A8AC',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 0',
      transition: 'color 0.2s',
    },
    likes: {
      fontSize: '14px',
      color: '#E8A0A8',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    icon: {
      width: '18px',
      height: '18px',
      strokeWidth: 1.8,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onBack}>‹</button>
          <span style={styles.title}>朋友圈</span>
        </div>
        <button style={styles.headerRight}>
          <PhotoIcon style={styles.icon} />
        </button>
      </div>
      <div style={styles.dateDivider}>
        <span style={styles.dateDividerLine} />
        <span style={styles.dateDividerText}>✦ 最近动态 ✦</span>
      </div>
      {moments.map((item) => (
        <div key={item.id} style={styles.item}>
          <div style={styles.userRow}>
            {renderAvatar(item.avatarKey)}
            <div style={styles.userInfo}>
              <div style={styles.userName}>{item.user}</div>
              <div style={styles.userTime}>{item.time}</div>
            </div>
          </div>
          <div style={styles.content}>{item.content}</div>
          {item.images === 1 && (
            <div style={styles.imagesGridOne}>
              <div style={styles.imagePlaceholder}><PhotoIcon style={{ ...styles.icon, width: '28px', height: '28px' }} /></div>
            </div>
          )}
          {item.images === 2 && (
            <div style={styles.imagesGridTwo}>
              <div style={styles.imagePlaceholder}><PhotoIcon style={{ ...styles.icon, width: '24px', height: '24px' }} /></div>
              <div style={styles.imagePlaceholder}><PhotoIcon style={{ ...styles.icon, width: '24px', height: '24px' }} /></div>
            </div>
          )}
          {item.images === 3 && (
            <div style={styles.imagesGrid}>
              <div style={styles.imagePlaceholder}><PhotoIcon style={{ ...styles.icon, width: '20px', height: '20px' }} /></div>
              <div style={styles.imagePlaceholder}><PhotoIcon style={{ ...styles.icon, width: '20px', height: '20px' }} /></div>
              <div style={styles.imagePlaceholder}><PhotoIcon style={{ ...styles.icon, width: '20px', height: '20px' }} /></div>
            </div>
          )}
          <div style={styles.actions}>
            <div style={styles.actionsLeft}>
              <button style={styles.actionBtn}><ChatBubbleLeftIcon style={styles.icon} /> 评论</button>
              <button style={styles.actionBtn}><ShareIcon style={styles.icon} /> 转发</button>
            </div>
            <span style={styles.likes}>
              {item.heart ? <HeartSolid style={{ ...styles.icon, color: '#E88A9A' }} /> : <HeartIcon style={styles.icon} />}
              {item.likes}
            </span>
          </div>
        </div>
      ))}
      <div style={{ height: '4px' }} />
    </div>
  );
};

export default MemoryMoments;