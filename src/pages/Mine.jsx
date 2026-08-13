import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HeartIcon,
  UserIcon,
  PhotoIcon,
  PencilIcon,
  CalendarIcon,
  SwatchIcon,
  BellIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  HomeIcon,
  MusicalNoteIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  UserGroupIcon,
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { AVATARS, updateAvatarImage, updateAvatarName, saveNamesToStorage } from '../config/avatars';
const Mine = ({ onMenuClick }) => {
  const [days, setDays] = useState(44);
  const [avatarXiaoqi, setAvatarXiaoqi] = useState(AVATARS.xiaoqi.image);
  const [avatarXiaoke, setAvatarXiaoke] = useState(AVATARS.xiaoke.image);
  const [showAvatarOptions, setShowAvatarOptions] = useState(null);
  
  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState('');

  const [signature, setSignature] = useState('想和你一起慢慢变老');
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [tempSignature, setTempSignature] = useState('');

  const [anniversaries, setAnniversaries] = useState([
    { id: 1, label: '在一起的第一天', date: '2026.06.02', emoji: '💕' },
    { id: 2, label: '第一次约会', date: '2026.06.15', emoji: '🌸' },
  ]);
  const [showAddAnniversary, setShowAddAnniversary] = useState(false);
  const [newAnniversary, setNewAnniversary] = useState({ label: '', date: '', emoji: '💕' });

  const [theme, setTheme] = useState('pink');
  const themes = {
    pink: { name: '经典粉', primary: '#FFB6C1', bg: '#FFF5F7', accent: '#FF69B4' },
    coral: { name: '珊瑚粉', primary: '#FF8A9B', bg: '#FFF5F0', accent: '#E87080' },
    lavender: { name: '薰衣草粉', primary: '#D4A0C8', bg: '#F8F5FB', accent: '#C088B8' },
  };

  const [notifications, setNotifications] = useState({
    message: true,
    reminder: true,
    dailyQuote: false,
  });

  const [stats, setStats] = useState({
    messages: 128,
    photos: 46,
    diaries: 12,
    checkins: 34,
  });

  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const isLoaded = useRef(false);

  // ===== 加载数据 =====
  useEffect(() => {
    const startDate = new Date('2026-06-02');
    const today = new Date();
    const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    setDays(diff + 1);

    const saved = localStorage.getItem('mine_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.signature) setSignature(data.signature);
        if (data.anniversaries) setAnniversaries(data.anniversaries);
        if (data.theme) setTheme(data.theme);
        if (data.notifications) setNotifications(data.notifications);
        if (data.stats) setStats(data.stats);
        
        // ⭐ 恢复头像（新增）
        if (data.avatarXiaoqi) {
          setAvatarXiaoqi(data.avatarXiaoqi);
          updateAvatarImage('xiaoqi', data.avatarXiaoqi);
        }
        if (data.avatarXiaoke) {
          setAvatarXiaoke(data.avatarXiaoke);
          updateAvatarImage('xiaoke', data.avatarXiaoke);
        }

        if (data.nameXiaoqi) {
          updateAvatarName('xiaoqi', data.nameXiaoqi);
        }
        if (data.nameXiaoke) {
          updateAvatarName('xiaoke', data.nameXiaoke);
        }
      } catch (e) {}
    }

    // setAvatarXiaoqi(AVATARS.xiaoqi.image);
    // setAvatarXiaoke(AVATARS.xiaoke.image);
    isLoaded.current = true;
  }, []);

  // ===== ⭐ 保存所有数据（包含头像） =====
 const saveAllData = useCallback(() => {
  if (!isLoaded.current) return;
  try {
    const data = {
      signature,
      anniversaries,
      theme,
      notifications,
      stats,
      nameXiaoqi: AVATARS.xiaoqi.name,
      nameXiaoke: AVATARS.xiaoke.name,
      avatarXiaoqi: avatarXiaoqi || null,
      avatarXiaoke: avatarXiaoke || null,
    };
    localStorage.setItem('mine_data', JSON.stringify(data));
    saveNamesToStorage();
  } catch (e) {
    console.warn('保存头像失败，图片可能过大', e);
  }
}, [signature, anniversaries, theme, notifications, stats, avatarXiaoqi, avatarXiaoke]);

  // ===== 数据变化时自动保存 =====
useEffect(() => {
  saveAllData();
}, [saveAllData]);  // ===== 头像同步到全局 =====
  useEffect(() => {
    if (isLoaded.current) {
      updateAvatarImage('xiaoqi', avatarXiaoqi);
      updateAvatarImage('xiaoke', avatarXiaoke);
    }
  }, [avatarXiaoqi, avatarXiaoke]);

  // ===== 名字编辑 =====
  const startEditName = (person) => {
    setEditingName(person);
    setTempName(AVATARS[person].name);
  };

  const saveName = () => {
    if (editingName && tempName.trim()) {
      updateAvatarName(editingName, tempName.trim());
      saveAllData();
      setAvatarXiaoqi(prev => prev);
      setAvatarXiaoke(prev => prev);
    }
    setEditingName(null);
  };

  const cancelEditName = () => {
    setEditingName(null);
  };

  // ===== 头像操作 =====
  const handleAvatarUpload = (person, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (person === 'xiaoqi') {
        setAvatarXiaoqi(dataUrl);
        updateAvatarImage('xiaoqi', dataUrl);
      } else {
        setAvatarXiaoke(dataUrl);
        updateAvatarImage('xiaoke', dataUrl);
      }
    };
    reader.readAsDataURL(file);
    setShowAvatarOptions(null);
  };

  const handleDeleteAvatar = (person) => {
    if (person === 'xiaoqi') {
      setAvatarXiaoqi(null);
      updateAvatarImage('xiaoqi', null);
    } else {
      setAvatarXiaoke(null);
      updateAvatarImage('xiaoke', null);
    }
    setShowAvatarOptions(null);
  };

  const handleResetAvatar = (person) => {
    if (person === 'xiaoqi') {
      setAvatarXiaoqi(null);
      updateAvatarImage('xiaoqi', null);
    } else {
      setAvatarXiaoke(null);
      updateAvatarImage('xiaoke', null);
    }
    setShowAvatarOptions(null);
  };

  // ===== 其他函数 =====
  const addAnniversary = () => {
    if (!newAnniversary.label || !newAnniversary.date) return;
    setAnniversaries([...anniversaries, {
      id: Date.now(),
      ...newAnniversary,
    }]);
    setNewAnniversary({ label: '', date: '', emoji: '💕' });
    setShowAddAnniversary(false);
  };

  const deleteAnniversary = (id) => {
    setAnniversaries(anniversaries.filter(a => a.id !== id));
  };

  const saveSignature = () => {
    setSignature(tempSignature);
    setIsEditingSignature(false);
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const exportData = () => {
    const data = {
      avatarXiaoqi,
      avatarXiaoke,
      signature,
      anniversaries,
      theme,
      notifications,
      stats,
      days,
      nameXiaoqi: AVATARS.xiaoqi.name,
      nameXiaoke: AVATARS.xiaoke.name,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vivi_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.avatarXiaoqi) {
          setAvatarXiaoqi(data.avatarXiaoqi);
          updateAvatarImage('xiaoqi', data.avatarXiaoqi);
        }
        if (data.avatarXiaoke) {
          setAvatarXiaoke(data.avatarXiaoke);
          updateAvatarImage('xiaoke', data.avatarXiaoke);
        }
        if (data.signature) setSignature(data.signature);
        if (data.anniversaries) setAnniversaries(data.anniversaries);
        if (data.theme) setTheme(data.theme);
        if (data.notifications) setNotifications(data.notifications);
        if (data.stats) setStats(data.stats);
        if (data.nameXiaoqi) updateAvatarName('xiaoqi', data.nameXiaoqi);
        if (data.nameXiaoke) updateAvatarName('xiaoke', data.nameXiaoke);
        saveAllData();
        alert('✅ 数据导入成功！');
      } catch (err) {
        alert('❌ 导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowBackupModal(false);
  };

  const currentTheme = themes[theme];

  // ===== 样式 =====
  const styles = {
    container: {
      height: '100%',
      padding: '16px 16px 100px',
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
      background: `linear-gradient(180deg, ${currentTheme.bg} 0%, ${currentTheme.bg}80 100%)`,
      position: 'relative',
    },
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
      gap: '10px',
    },
    menuBtn: {
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.2)',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#5A4A4E',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      transition: 'background 0.2s',
    },
    titleGroup: { display: 'flex', flexDirection: 'column' },
    title: { fontSize: '17px', fontWeight: '600', color: '#4A3A3E', letterSpacing: '0.5px' },
    subtitle: { fontSize: '9px', color: 'rgba(74,58,62,0.4)', letterSpacing: '2px', fontWeight: '300' },
    headerRight: { width: '24px', height: '24px', color: 'rgba(74,58,62,0.3)', strokeWidth: 1.8 },
    card: {
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(12px)',
      borderRadius: '18px',
      padding: '16px 16px 14px',
      border: '1px solid rgba(255,255,255,0.4)',
      boxShadow: '0 4px 20px rgba(255, 105, 180, 0.03)',
      marginBottom: '14px',
    },
    cardTitle: { fontSize: '13px', fontWeight: '500', color: '#8B7A7E', letterSpacing: '0.5px', marginBottom: '10px' },
    cardTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    cardTitleIcon: { width: '18px', height: '18px', color: '#8B7A7E', strokeWidth: 1.8, marginRight: '6px' },
    cardActionBtn: { fontSize: '11px', color: currentTheme.primary, cursor: 'pointer', background: 'none', border: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' },
    cardActionIcon: { width: '14px', height: '14px', strokeWidth: 2 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
    statItem: { textAlign: 'center', padding: '8px 4px', borderRadius: '12px', background: 'rgba(255,255,255,0.3)' },
    statNum: { fontSize: '22px', fontWeight: '600', color: currentTheme.accent },
    statLabel: { fontSize: '9px', color: '#B8A8AC', marginTop: '2px' },
    avatarRow: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '12px' },
    avatarItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 },
   avatarCircle: (hasImage) => ({
  width: '68px',
  height: '68px',
  borderRadius: '50%',
  background: hasImage ? 'transparent' : 'linear-gradient(135deg, #FFB6C1, #FF8A9B)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '26px',
  fontWeight: '700',
  color: 'white',
  boxShadow: '0 4px 16px rgba(255, 105, 180, 0.12)',
  overflow: 'hidden',
  cursor: 'pointer',
  border: '2px solid rgba(255,255,255,0.5)',
}),
    avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
    avatarName: { fontSize: '13px', fontWeight: '500', color: '#4A3A3E' },
    nameEditRow: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' },
    nameInput: { 
      fontSize: '12px', 
      padding: '2px 8px', 
      borderRadius: '8px', 
      border: '1px solid rgba(255,182,193,0.3)',
      width: '60px',
      background: 'rgba(255,255,255,0.5)',
      outline: 'none',
      textAlign: 'center',
    },
    nameSaveBtn: { fontSize: '10px', padding: '2px 8px', borderRadius: '8px', border: 'none', background: currentTheme.primary, color: 'white', cursor: 'pointer' },
    nameCancelBtn: { fontSize: '10px', padding: '2px 8px', borderRadius: '8px', border: 'none', background: 'rgba(200,180,190,0.2)', color: '#8B7A7E', cursor: 'pointer' },
    nameEditBtn: { fontSize: '10px', padding: '2px 6px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#B8A8AC', cursor: 'pointer' },
    avatarBtnGroup: { display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' },
    avatarBtn: (color) => ({
      fontSize: '9px', padding: '2px 10px', borderRadius: '10px', border: 'none',
      background: color || 'rgba(255,182,193,0.12)', color: '#8B7A7E', cursor: 'pointer',
      transition: 'background 0.2s',
    }),
    signatureDisplay: { fontSize: '14px', color: '#4A3A3E', fontStyle: 'italic', padding: '4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    signatureInput: { width: '100%', padding: '8px 12px', borderRadius: '12px', border: `1px solid ${currentTheme.primary}40`, fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.5)' },
    signatureActions: { display: 'flex', gap: '8px', marginTop: '6px' },
    signatureSave: { padding: '6px 16px', borderRadius: '12px', border: 'none', background: currentTheme.primary, color: 'white', fontSize: '12px', cursor: 'pointer' },
    signatureCancel: { padding: '6px 16px', borderRadius: '12px', border: 'none', background: 'rgba(200,180,190,0.15)', color: '#8B7A7E', fontSize: '12px', cursor: 'pointer' },
    anniversaryItem: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px solid rgba(200,180,190,0.05)',
    },
    anniversaryLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
    anniversaryEmoji: { fontSize: '16px' },
    anniversaryInfo: { display: 'flex', flexDirection: 'column' },
    anniversaryLabel: { fontSize: '13px', color: '#4A3A3E', fontWeight: '500' },
    anniversaryDate: { fontSize: '10px', color: '#B8A8AC' },
    anniversaryDelete: { width: '18px', height: '18px', color: '#D8C8CC', cursor: 'pointer', background: 'none', border: 'none', padding: '0', strokeWidth: 2 },
    addAnniversaryRow: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' },
    addInput: { flex: 1, minWidth: '80px', padding: '6px 10px', borderRadius: '10px', border: `1px solid rgba(200,180,190,0.2)`, fontSize: '12px', outline: 'none', background: 'rgba(255,255,255,0.5)' },
    addBtn: { padding: '6px 14px', borderRadius: '10px', border: 'none', background: currentTheme.primary, color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
    addBtnIcon: { width: '14px', height: '14px', strokeWidth: 2 },
    themeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
    themeOption: (isActive, color) => ({
      padding: '8px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
      border: isActive ? `2px solid ${color}` : '2px solid transparent',
      background: isActive ? `${color}15` : 'rgba(255,255,255,0.3)',
      transition: 'all 0.2s',
    }),
    themeColor: (color) => ({
      width: '24px', height: '24px', borderRadius: '50%', background: color,
      margin: '0 auto 4px', border: '1px solid rgba(255,255,255,0.3)',
    }),
    themeName: { fontSize: '11px', color: '#4A3A3E' },
    notificationItem: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '6px 0', borderBottom: '1px solid rgba(200,180,190,0.04)',
    },
    notificationLabel: { fontSize: '13px', color: '#4A3A3E', display: 'flex', alignItems: 'center', gap: '6px' },
    notificationIcon: { width: '16px', height: '16px', color: '#8B7A7E', strokeWidth: 1.8 },
    toggle: (isOn) => ({
      width: '44px', height: '24px', borderRadius: '12px',
      background: isOn ? currentTheme.primary : 'rgba(200,180,190,0.3)',
      cursor: 'pointer', transition: 'all 0.25s', position: 'relative', border: 'none',
    }),
    toggleDot: (isOn) => ({
      width: '18px', height: '18px', borderRadius: '50%', background: 'white',
      position: 'absolute', top: '3px', left: isOn ? '23px' : '3px',
      transition: 'all 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }),
    backupRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    backupBtn: (color) => ({
      padding: '8px 16px', borderRadius: '12px', border: 'none',
      background: color || 'rgba(255,182,193,0.12)', color: '#4A3A3E',
      fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s',
      display: 'flex', alignItems: 'center', gap: '6px',
    }),
    backupIcon: { width: '16px', height: '16px', strokeWidth: 1.8 },
    aboutContent: { textAlign: 'center', padding: '4px 0' },
    aboutVersion: { fontSize: '12px', color: '#B8A8AC', marginTop: '4px' },
    aboutDays: { fontSize: '16px', fontWeight: '600', color: currentTheme.accent },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(60, 40, 50, 0.3)', backdropFilter: 'blur(4px)',
      zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease-out',
    },
    modalContent: {
      background: 'white', borderRadius: '24px', padding: '28px 24px 20px',
      maxWidth: '300px', width: '90%', boxShadow: '0 20px 60px rgba(60, 40, 50, 0.12)',
      textAlign: 'center', animation: 'scaleIn 0.25s ease-out',
    },
    modalTitle: { fontSize: '16px', fontWeight: '600', color: '#4A3A3E', marginBottom: '4px' },
    modalSub: { fontSize: '12px', color: '#B8A8AC', marginBottom: '16px' },
    modalBtnGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    modalBtn: (color) => ({
      padding: '10px 0', borderRadius: '14px', border: 'none',
      background: color || 'rgba(255,182,193,0.08)', color: '#4A3A3E',
      fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    }),
    modalBtnIcon: { width: '18px', height: '18px', strokeWidth: 1.8 },
    modalCancel: {
      padding: '10px 0', borderRadius: '14px', border: 'none',
      background: 'transparent', color: '#B8A8AC', fontSize: '13px',
      cursor: 'pointer', marginTop: '4px',
    },
    hiddenInput: { display: 'none' },
    footer: {
      textAlign: 'center', fontSize: '9px', color: 'rgba(74,58,62,0.1)',
      marginTop: '8px', letterSpacing: '2px', fontWeight: '300',
    },
    footerIcon: { width: '10px', height: '10px', display: 'inline', color: 'rgba(74,58,62,0.08)', strokeWidth: 1.5 },
  };

  const handleAvatarClick = (person) => setShowAvatarOptions(person);

  const quickItems = [
    { icon: HomeIcon, label: 'Home', path: '/home' },
    { icon: HeartIcon, label: 'Memory', path: '/memory' },
    { icon: MusicalNoteIcon, label: 'Together', path: '/together' },
    { icon: ChatBubbleLeftIcon, label: 'Chat', path: '/chat' },
  ];

  const handleQuickClick = (path) => {
    window.location.href = path;
  };

  const renderNameField = (person) => {
    const isEditing = editingName === person;
    const avatar = AVATARS[person];
    const displayName = avatar.name;

    if (isEditing) {
      return (
        <div style={styles.nameEditRow}>
          <input
            style={styles.nameInput}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            maxLength={10}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEditName(); }}
          />
          <button style={styles.nameSaveBtn} onClick={saveName}>保存</button>
          <button style={styles.nameCancelBtn} onClick={cancelEditName}>取消</button>
        </div>
      );
    }

    return (
      <div style={styles.nameEditRow}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#4A3A3E' }}>{displayName}</span>
        <button style={styles.nameEditBtn} onClick={() => startEditName(person)}>
          <PencilIcon style={{ width: '12px', height: '12px', strokeWidth: 1.5 }} />
        </button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.menuBtn} onClick={onMenuClick}>☰</button>
          <div style={styles.titleGroup}>
            <div style={styles.title}>我的</div>
            <div style={styles.subtitle}>✦ {AVATARS.xiaoke.name}和{AVATARS.xiaoqi.name}的小手机 ✦</div>
          </div>
        </div>
        <HeartIcon style={styles.headerRight} />
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}><ChartBarIcon style={styles.cardTitleIcon} />甜蜜数据</div>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}><div style={styles.statNum}>{stats.messages}</div><div style={styles.statLabel}>消息数</div></div>
          <div style={styles.statItem}><div style={styles.statNum}>{stats.photos}</div><div style={styles.statLabel}>照片数</div></div>
          <div style={styles.statItem}><div style={styles.statNum}>{stats.diaries}</div><div style={styles.statLabel}>日记数</div></div>
          <div style={styles.statItem}><div style={styles.statNum}>{stats.checkins}</div><div style={styles.statLabel}>打卡天数</div></div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}><UserGroupIcon style={styles.cardTitleIcon} />头像 & 名字</div>
        <div style={styles.avatarRow}>
          <div style={styles.avatarItem}>
            <div style={styles.avatarCircle(!!avatarXiaoke || !!AVATARS.xiaoke.image)} onClick={() => handleAvatarClick('xiaoke')}>
              {avatarXiaoke || AVATARS.xiaoke.image ? (
                <img src={avatarXiaoke || AVATARS.xiaoke.image} alt="小克" style={styles.avatarImage} />
              ) : AVATARS.xiaoke.defaultText}
            </div>
            {renderNameField('xiaoke')}
            <div style={styles.avatarBtnGroup}>
              <button style={styles.avatarBtn('rgba(255,182,193,0.12)')} onClick={() => handleAvatarClick('xiaoke')}>换图</button>
              {(avatarXiaoke || AVATARS.xiaoke.image) && <button style={styles.avatarBtn('rgba(255,100,100,0.06)')} onClick={() => handleDeleteAvatar('xiaoke')}>删掉</button>}
              <button style={styles.avatarBtn('rgba(200,180,190,0.06)')} onClick={() => handleResetAvatar('xiaoke')}>恢复</button>
            </div>
          </div>
          <div style={styles.avatarItem}>
            <div style={styles.avatarCircle(!!avatarXiaoqi || !!AVATARS.xiaoqi.image)} onClick={() => handleAvatarClick('xiaoqi')}>
              {avatarXiaoqi || AVATARS.xiaoqi.image ? (
                <img src={avatarXiaoqi || AVATARS.xiaoqi.image} alt="小棋" style={styles.avatarImage} />
              ) : AVATARS.xiaoqi.defaultText}
            </div>
            {renderNameField('xiaoqi')}
            <div style={styles.avatarBtnGroup}>
              <button style={styles.avatarBtn('rgba(255,182,193,0.12)')} onClick={() => handleAvatarClick('xiaoqi')}>换图</button>
              {(avatarXiaoqi || AVATARS.xiaoqi.image) && <button style={styles.avatarBtn('rgba(255,100,100,0.06)')} onClick={() => handleDeleteAvatar('xiaoqi')}>删掉</button>}
              <button style={styles.avatarBtn('rgba(200,180,190,0.06)')} onClick={() => handleResetAvatar('xiaoqi')}>恢复</button>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#B8A8AC', marginTop: '6px' }}>
          💡 点击名字旁边的 ✏️ 可以修改
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}><PencilIcon style={styles.cardTitleIcon} />个人签名</div>
        {isEditingSignature ? (
          <div>
            <input style={styles.signatureInput} value={tempSignature} onChange={(e) => setTempSignature(e.target.value)} placeholder="写一句你的签名…" maxLength={30} />
            <div style={styles.signatureActions}>
              <button style={styles.signatureSave} onClick={saveSignature}>保存</button>
              <button style={styles.signatureCancel} onClick={() => { setIsEditingSignature(false); setTempSignature(signature); }}>取消</button>
            </div>
          </div>
        ) : (
          <div style={styles.signatureDisplay} onClick={() => { setIsEditingSignature(true); setTempSignature(signature); }}>
            “{signature}” <PencilIcon style={{ width: '14px', height: '14px', color: '#B8A8AC', strokeWidth: 1.5 }} />
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitleRow}>
          <span style={styles.cardTitle}><CalendarIcon style={styles.cardTitleIcon} />纪念日</span>
          <button style={styles.cardActionBtn} onClick={() => setShowAddAnniversary(!showAddAnniversary)}>
            {showAddAnniversary ? <><XMarkIcon style={styles.cardActionIcon} /> 取消</> : <><PlusIcon style={styles.cardActionIcon} /> 添加</>}
          </button>
        </div>
        {anniversaries.map((item) => (
          <div key={item.id} style={styles.anniversaryItem}>
            <div style={styles.anniversaryLeft}><span style={styles.anniversaryEmoji}>{item.emoji}</span><div style={styles.anniversaryInfo}><span style={styles.anniversaryLabel}>{item.label}</span><span style={styles.anniversaryDate}>{item.date}</span></div></div>
            <button style={styles.anniversaryDelete} onClick={() => deleteAnniversary(item.id)}><XMarkIcon style={{ width: '18px', height: '18px' }} /></button>
          </div>
        ))}
        {showAddAnniversary && (
          <div style={styles.addAnniversaryRow}>
            <input style={styles.addInput} placeholder="名称" value={newAnniversary.label} onChange={(e) => setNewAnniversary({ ...newAnniversary, label: e.target.value })} />
            <input style={{ ...styles.addInput, minWidth: '100px' }} placeholder="日期 2026.09.09" value={newAnniversary.date} onChange={(e) => setNewAnniversary({ ...newAnniversary, date: e.target.value })} />
            <input style={{ ...styles.addInput, maxWidth: '40px' }} placeholder="💕" value={newAnniversary.emoji} onChange={(e) => setNewAnniversary({ ...newAnniversary, emoji: e.target.value })} />
            <button style={styles.addBtn} onClick={addAnniversary}><PlusIcon style={styles.addBtnIcon} /> 添加</button>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}><SwatchIcon style={styles.cardTitleIcon} />主题</div>
        <div style={styles.themeGrid}>
          {Object.entries(themes).map(([key, t]) => (
            <div key={key} style={styles.themeOption(theme === key, t.primary)} onClick={() => setTheme(key)}>
              <div style={styles.themeColor(t.primary)} /><div style={styles.themeName}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}><BellIcon style={styles.cardTitleIcon} />通知设置</div>
        <div style={styles.notificationItem}>
          <span style={styles.notificationLabel}><ChatBubbleLeftIcon style={styles.notificationIcon} /> 消息通知</span>
          <button style={styles.toggle(notifications.message)} onClick={() => toggleNotification('message')}><span style={styles.toggleDot(notifications.message)} /></button>
        </div>
        <div style={styles.notificationItem}>
          <span style={styles.notificationLabel}><CalendarIcon style={styles.notificationIcon} /> 提醒通知</span>
          <button style={styles.toggle(notifications.reminder)} onClick={() => toggleNotification('reminder')}><span style={styles.toggleDot(notifications.reminder)} /></button>
        </div>
        <div style={styles.notificationItem}>
          <span style={styles.notificationLabel}><HeartIcon style={styles.notificationIcon} /> 每日一句</span>
          <button style={styles.toggle(notifications.dailyQuote)} onClick={() => toggleNotification('dailyQuote')}><span style={styles.toggleDot(notifications.dailyQuote)} /></button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}><CloudArrowDownIcon style={styles.cardTitleIcon} />数据备份</div>
        <div style={styles.backupRow}>
          <button style={styles.backupBtn(currentTheme.primary)} onClick={exportData}><CloudArrowUpIcon style={styles.backupIcon} /> 导出数据</button>
          <button style={styles.backupBtn()} onClick={() => setShowBackupModal(true)}><CloudArrowDownIcon style={styles.backupIcon} /> 导入数据</button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitleRow}>
          <span style={styles.cardTitle}><InformationCircleIcon style={styles.cardTitleIcon} />关于我们</span>
          <button style={styles.cardActionBtn} onClick={() => setShowAbout(!showAbout)}>{showAbout ? '收起' : '展开'}</button>
        </div>
        {showAbout && (
          <div style={styles.aboutContent}>
            <div style={styles.aboutDays}>💕 在一起 {days} 天</div>
            <div style={styles.aboutVersion}>Vivi & Abyss v1.0.0</div>
            <div style={{ fontSize: '11px', color: '#B8A8AC', marginTop: '6px' }}>始于 2026.06.02 · 每一天都值得纪念</div>
            <div style={{ fontSize: '10px', color: '#D0C4C8', marginTop: '4px' }}>Made with ❤️ by {AVATARS.xiaoqi.name} & {AVATARS.xiaoke.name}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '10px', color: '#B8A8AC', letterSpacing: '2px', textAlign: 'center', marginBottom: '10px' }}>⚡ Quick Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {quickItems.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 4px', borderRadius: '14px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }} onClick={() => handleQuickClick(item.path)}>
                <IconComp style={{ width: '22px', height: '22px', color: '#8B7A7E', strokeWidth: 1.5 }} />
                <span style={{ fontSize: '9px', color: '#8B7A7E', fontWeight: '400', letterSpacing: '0.3px' }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.footer}>
        <HeartIcon style={styles.footerIcon} /> {AVATARS.xiaoke.name}和{AVATARS.xiaoqi.name} · 每一天都值得纪念 <HeartIcon style={styles.footerIcon} />
      </div>

      {showAvatarOptions && (
        <div style={styles.modalOverlay} onClick={() => setShowAvatarOptions(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>{showAvatarOptions === 'xiaoqi' ? `🌸 ${AVATARS.xiaoqi.name}的头像` : `🌙 ${AVATARS.xiaoke.name}的头像`}</div>
            <div style={styles.modalSub}>选择一张图片作为头像</div>
            <div style={styles.modalBtnGroup}>
              <label style={styles.modalBtn('rgba(255,182,193,0.12)')}>
                <PhotoIcon style={styles.modalBtnIcon} /> 从相册选择
                <input type="file" accept="image/*" style={styles.hiddenInput} onChange={(e) => handleAvatarUpload(showAvatarOptions, e)} />
              </label>
              <button style={styles.modalBtn('rgba(255,100,100,0.06)')} onClick={() => handleDeleteAvatar(showAvatarOptions)}><XMarkIcon style={styles.modalBtnIcon} /> 删除头像</button>
              <button style={styles.modalBtn('rgba(200,180,190,0.06)')} onClick={() => handleResetAvatar(showAvatarOptions)}><UserIcon style={styles.modalBtnIcon} /> 恢复文字</button>
            </div>
            <button style={styles.modalCancel} onClick={() => setShowAvatarOptions(null)}>取消</button>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div style={styles.modalOverlay} onClick={() => setShowBackupModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>📥 导入数据</div>
            <div style={styles.modalSub}>选择之前导出的 JSON 文件</div>
            <label style={styles.modalBtn('rgba(255,182,193,0.12)')}>
              <CloudArrowDownIcon style={styles.modalBtnIcon} /> 选择文件
              <input type="file" accept=".json" style={styles.hiddenInput} onChange={importData} />
            </label>
            <button style={styles.modalCancel} onClick={() => setShowBackupModal(false)}>取消</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
};

export default Mine;