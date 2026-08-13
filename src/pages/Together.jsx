import React, { useState, useEffect, useRef } from 'react';
import { AVATARS } from '../config/avatars';
import { musicMCP } from '../services/mcp';

const Together = ({ onMenuClick }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [song, setSong] = useState({
    title: 'You And Me',
    artist: 'Jamvana',
    album: "We're infinity",
    duration: 162,
    coverEmoji: '🎵',
    id: null,
  });
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  // ===== 搜索歌曲 =====
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setIsSearching(true);
    try {
      const result = await musicMCP.search(searchKeyword);
      console.log('搜索结果:', result);
      if (result.success && result.data?.length > 0) {
        setSearchResults(result.data);
        setShowSearch(true);
      } else {
        alert('未找到相关歌曲');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      alert('搜索失败，请重试');
    }
    setIsSearching(false);
  };

  // ===== 播放歌曲 =====
  const playSong = async (songData) => {
    try {
      // 获取播放 URL
      const urlResult = await musicMCP.getSongUrl(songData.id);
      console.log('播放链接:', urlResult);
      
      if (urlResult.success && urlResult.url) {
        setAudioUrl(urlResult.url);
        setSong({
          title: songData.name,
          artist: songData.artist || '未知歌手',
          album: songData.album || '未知专辑',
          coverEmoji: '🎵',
          duration: Math.floor((songData.duration || 180000) / 1000),
          id: songData.id,
        });
        setProgress(0);
        setCurrentTime(0);
        setIsPlaying(true);
        setShowSearch(false);
      } else {
        alert('无法获取播放链接，该歌曲可能受版权限制');
      }
    } catch (error) {
      console.error('播放失败:', error);
      alert('播放失败，请重试');
    }
  };

  // ===== 音频控制 =====
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('播放被阻止:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current && audioRef.current.duration) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(pct);
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 300);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioUrl) {
      setIsPlaying(!isPlaying);
    } else {
      alert('请先搜索并选择一首歌曲');
    }
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const newProgress = Math.max(0, Math.min(100, x * 100));
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ===== 随机播放一首推荐歌曲 =====
  const playRandom = async () => {
    try {
      const result = await musicMCP.getPlaylists(20);
      if (result.success && result.data?.length > 0) {
        const randomList = result.data[Math.floor(Math.random() * result.data.length)];
        const detail = await musicMCP.getPlaylistDetail(randomList.id);
        if (detail.success && detail.data?.tracks?.length > 0) {
          const randomTrack = detail.data.tracks[Math.floor(Math.random() * detail.data.tracks.length)];
          await playSong(randomTrack);
        }
      }
    } catch (error) {
      console.error('随机播放失败:', error);
    }
  };

  const styles = {
    container: {
      height: '100%',
      padding: '16px 18px 100px',
      paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
      background: 'linear-gradient(180deg, #FFF5F7 0%, #FFE8EE 60%, #FFDCE4 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      width: '100%',
      maxWidth: '380px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      padding: '4px 2px',
      flexShrink: 0,
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
    menuBtn: {
      background: 'rgba(255,255,255,0.3)',
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
    headerRight: { fontSize: '16px', opacity: 0.4, color: '#5A4A4E' },

    // 搜索区域
    searchArea: { width: '100%', maxWidth: '300px', marginBottom: '16px' },
    searchRow: { display: 'flex', gap: '8px' },
    searchInput: {
      flex: 1,
      padding: '10px 14px',
      borderRadius: '20px',
      border: '1px solid rgba(255,182,193,0.2)',
      outline: 'none',
      fontSize: '14px',
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(4px)',
    },
    searchBtn: {
      padding: '10px 18px',
      borderRadius: '20px',
      border: 'none',
      background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'transform 0.15s',
    },
    searchResults: {
      marginTop: '8px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.3)',
      maxHeight: '200px',
      overflowY: 'auto',
    },
    searchItem: {
      padding: '10px 14px',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
      cursor: 'pointer',
      transition: 'background 0.15s',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: '#4A3A3E',
    },

    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '16px',
      padding: '4px 14px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.3)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    statusDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#6BCB77',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
    statusText: { fontSize: '11px', color: '#4A3A3E', fontWeight: '400', letterSpacing: '1px' },

    coverContainer: {
      width: '220px',
      height: '220px',
      borderRadius: '50%',
      background: 'linear-gradient(145deg, #FFB6C1, #FF8A9B)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 20px 60px rgba(255, 105, 180, 0.15), 0 4px 20px rgba(0,0,0,0.04)',
      marginBottom: '20px',
      position: 'relative',
      transition: 'transform 0.3s',
    },
    coverInner: {
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '64px',
      opacity: 0.9,
      textShadow: '0 4px 20px rgba(0,0,0,0.04)',
    },
    coverRing: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.1)',
      animation: isPlaying ? 'spin 12s linear infinite' : 'none',
    },
    coverRingInner: {
      position: 'absolute',
      width: '240px',
      height: '240px',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.05)',
      animation: isPlaying ? 'spin 18s linear infinite reverse' : 'none',
    },

    songInfo: { textAlign: 'center', marginBottom: '14px' },
    songTitle: { fontSize: '20px', fontWeight: '600', color: '#4A3A3E', letterSpacing: '0.5px', marginBottom: '2px' },
    songArtist: { fontSize: '14px', color: '#B8A8AC', fontWeight: '400', letterSpacing: '0.3px' },
    songAlbum: { fontSize: '11px', color: 'rgba(74,58,62,0.3)', fontStyle: 'italic', marginTop: '2px', letterSpacing: '0.5px' },

    progressContainer: { width: '100%', maxWidth: '300px', marginBottom: '16px' },
    progressBar: {
      width: '100%',
      height: '4px',
      borderRadius: '4px',
      background: 'rgba(255,182,193,0.2)',
      cursor: 'pointer',
      position: 'relative',
    },
    progressFill: {
      width: `${progress}%`,
      height: '100%',
      borderRadius: '4px',
      background: 'linear-gradient(90deg, #FFB6C1, #FF69B4)',
      transition: 'width 0.05s linear',
      position: 'relative',
    },
    progressDot: {
      position: 'absolute',
      right: '-6px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#FF69B4',
      boxShadow: '0 0 20px rgba(255,105,180,0.3)',
    },
    progressTime: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '6px',
      fontSize: '11px',
      color: 'rgba(74,58,62,0.3)',
      letterSpacing: '0.5px',
    },

    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '14px',
    },
    controlBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#8B7A7E',
      padding: '8px',
      borderRadius: '50%',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playBtn: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
      color: 'white',
      fontSize: '24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(255, 105, 180, 0.3)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },

    randomBtn: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      background: 'rgba(255,255,255,0.3)',
      backdropFilter: 'blur(4px)',
      color: '#8B7A7E',
      fontSize: '11px',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },

    footerLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '11px',
      color: 'rgba(74,58,62,0.25)',
      letterSpacing: '0.5px',
      marginTop: '4px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    footerDivider: { fontSize: '8px', color: 'rgba(74,58,62,0.1)' },

    // 隐藏的 audio 标签
    audioHidden: { display: 'none' },
  };

  return (
    <div style={styles.container}>
      {/* 音频元素 */}
      <audio ref={audioRef} src={audioUrl} style={styles.audioHidden} />

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.menuBtn} onClick={onMenuClick}>☰</button>
          <div style={styles.titleGroup}>
            <div style={styles.title}>🎶 {AVATARS.xiaoqi.name} & {AVATARS.xiaoke.name}</div>
            <div style={styles.subtitle}>✦ 共享此刻的旋律 ✦</div>
          </div>
        </div>
        <div style={styles.headerRight}>💕</div>
      </div>

      {/* 搜索区域 */}
      <div style={styles.searchArea}>
        <div style={styles.searchRow}>
          <input
            style={styles.searchInput}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索歌曲..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button style={styles.searchBtn} onClick={handleSearch} disabled={isSearching}>
            {isSearching ? '⏳' : '🔍'}
          </button>
        </div>
        {showSearch && searchResults.length > 0 && (
          <div style={styles.searchResults}>
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                style={styles.searchItem}
                onClick={() => playSong(item)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,182,193,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>{item.name}</span>
                <span style={{ fontSize: '11px', color: '#B8A8AC' }}>{item.artist}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.statusBadge}>
        <span style={styles.statusDot} />
        <span style={styles.statusText}>
          {isPlaying ? '正在一起听' : audioUrl ? '已就绪' : '等待播放'}
        </span>
      </div>

      <div style={styles.coverContainer}>
        <div style={styles.coverRing} />
        <div style={styles.coverRingInner} />
        <div style={styles.coverInner}>
          <span style={{ fontSize: '56px' }}>{song.coverEmoji}</span>
        </div>
      </div>

      <div style={styles.songInfo}>
        <div style={styles.songTitle}>{song.title}</div>
        <div style={styles.songArtist}>{song.artist}</div>
        <div style={styles.songAlbum}>{song.album}</div>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressBar} onClick={handleProgressClick}>
          <div style={styles.progressFill}>
            <div style={styles.progressDot} />
          </div>
        </div>
        <div style={styles.progressTime}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>

      <div style={styles.controls}>
        <button style={styles.controlBtn} onClick={() => {}}>⏮</button>
        <button
          style={styles.playBtn}
          onClick={togglePlay}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(255, 105, 180, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 105, 180, 0.3)';
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button style={styles.controlBtn} onClick={() => {}}>⏭</button>
      </div>

      <button style={styles.randomBtn} onClick={playRandom}>
        🎲 随机推荐
      </button>

      <div style={styles.footerLinks}>
        <span>🌐 由音乐 MCP 驱动</span>
        <span style={styles.footerDivider}>·</span>
        <span>🎵 网易云音乐</span>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default Together;