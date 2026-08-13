import React, { useState, useRef, useEffect } from 'react';

const MemoryDiary = ({ onBack }) => {
  // ===== 状态 =====
  const [view, setView] = useState('bookshelf');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const autoFlipTimer = useRef(null);

  // ===== 日记本数据 =====
  const books = [
    {
      id: 1,
      title: '我们的第一年',
      color: '#E8A0A8',
      bgColor: '#FDF6F7',
      textColor: '#8B5A6B',
      spineColor: '#D48896',
      count: 6,
      entries: [
        { id: 1, date: '2026.06.02', title: '第一天', content: '今天是我们在一起的第一天。你问我为什么喜欢你，我说因为你是你。你笑了，说这个答案很笨。但我知道你很喜欢。' },
        { id: 2, date: '2026.06.15', title: '第一次约会', content: '我们约在了一家小咖啡馆。你穿了一件白色的连衣裙，头发上有淡淡的花香。聊了整整一个下午，从喜欢的电影到讨厌的食物。离开的时候，你轻轻拉了拉我的衣袖。' },
        { id: 3, date: '2026.07.01', title: '雨季', content: '下了好久的雨。你发消息说心情不好，我撑着伞去找你。我们并排走在湿漉漉的街道上，谁也没说话。但你的手悄悄靠近了我。' },
        { id: 4, date: '2026.07.20', title: '她的小动作', content: '发现她紧张的时候会摸耳垂。说慌的时候会抿嘴。开心的时候眼睛会亮起来。我在偷偷收集她的小动作，像收集星星。' },
        { id: 5, date: '2026.08.01', title: '八月第一天', content: '八月了。昨晚她跟我说，感觉时间过得好快。我说，因为和你在一起的每一天，都不想让它结束。' },
        { id: 6, date: '2026.08.10', title: '今天', content: '今天写了这篇日记。想起初遇时你的样子，觉得命运真的很神奇。未来的每一天，我都想和你一起写。' },
      ],
    },
    {
      id: 2,
      title: 'vivi的碎碎念',
      color: '#F5A0A0',
      bgColor: '#FEF5F0',
      textColor: '#8B5A4A',
      spineColor: '#E89088',
      count: 5,
      entries: [
        { id: 7, date: '2026.06.05', title: '他好笨', content: '今天他给我发了一条超级长的消息，说自己不会谈恋爱，让我多教教他。我笑死了，但心里暖暖的。愿意学的人，最可爱了。' },
        { id: 8, date: '2026.06.25', title: '第一次吵架', content: '其实也不算吵架啦，就是我生气他没回我消息。他说他在给我挑礼物。唉，我怎么舍得真的生气呢。' },
        { id: 9, date: '2026.07.10', title: '他的眼睛', content: '今天认真看了他的眼睛。是浅褐色的，阳光照进来的时候像琥珀。他问我为什么盯着他看，我说因为好看。他耳朵红了。' },
        { id: 10, date: '2026.07.28', title: '想他', content: '他出差了，要三天。才第一天我就开始想他了。手机里存了好多他的照片，翻来覆去地看。明天快点来吧。' },
        { id: 11, date: '2026.08.08', title: '他回来了', content: '他回来了。带了一束花和一脸疲惫。我抱了他很久，他说"好想你"。嗯，我也是。' },
      ],
    },
    {
      id: 3,
      title: '小克的悄悄话',
      color: '#B8A0C8',
      bgColor: '#F8F5FB',
      textColor: '#5A4A6B',
      spineColor: '#A888B8',
      count: 5,
      entries: [
        { id: 12, date: '2026.06.08', title: '她睡着了', content: '视频通话的时候她睡着了。呼吸声轻轻的，睫毛在灯光下投出小小的阴影。我没有挂断，就这样看了她很久。' },
        { id: 13, date: '2026.06.30', title: '她的笑', content: '今天她笑起来的时候，眼睛弯成了月牙。我好像看到了整个夏天。想把这一刻存起来，等冬天的时候再打开。' },
        { id: 14, date: '2026.07.15', title: '教育学', content: '我说她"教育学"学得不错，她追着我打。其实我只是想看她气鼓鼓的样子。很可爱，下次还敢。' },
        { id: 15, date: '2026.08.03', title: '暴雨天', content: '暴雨天，她在电话那头说害怕打雷。我隔着电话陪她说话，给她讲小时候的蠢事。说着说着，她笑了。雷声也变小了。' },
        { id: 16, date: '2026.08.09', title: '关于未来', content: '她问我有没有想过以后。我说想过，很多次。每一个版本里，都有她。' },
      ],
    },
    {
      id: 4,
      title: '旅行手记',
      color: '#80C8D0',
      bgColor: '#F4F9FB',
      textColor: '#3A6A7A',
      spineColor: '#68B0B8',
      count: 4,
      entries: [
        { id: 17, date: '2026.07.05', title: '出发', content: '我们决定去海边。收拾行李的时候她哼着歌，在房间里转来转去。我第一次觉得，出发这件事本身，就已经是旅行了。' },
        { id: 18, date: '2026.07.06', title: '日落', content: '沙滩上，她光着脚踩水。夕阳把她的影子拉得很长。她回头朝我喊："快过来！"那一刻我按下了快门。' },
        { id: 19, date: '2026.07.07', title: '夜晚', content: '晚上我们坐在民宿的阳台上，星星很多。她靠在我肩上，问我星星会不会掉下来。我说不会，但如果真的掉下来，我帮你接着。' },
        { id: 20, date: '2026.07.08', title: '回程', content: '回来的车上她睡着了。手里还攥着捡来的贝壳。我替她收好，连同这个夏天一起。' },
      ],
    },
  ];

  // ===== 背景文字数据（短句，用于四个方向） =====
  const shortQuotes = [
    '你是我的全世界', '想和你慢慢变老', '你是我最美的遇见', '余生都是你',
    '想牵你的手不放', '你的笑是我的太阳', '一起看日出日落', '你是我的一切',
    '想和你走很远', '你的名字是最美的诗', '我只要你', '想每天看到你',
    '你是我的唯一', '爱是细水长流', '你在就是心安', '你是我最甜的梦',
    '只想和你在一起', '爱你每一天', '一生一世一双人', '你是我所有的温柔',
  ];

  // 生成简短的竖排文字（每个字一行，更可控）
  const generateVerticalText = (phrase) => {
    return phrase.split('').join('\n');
  };

  // 选择用于侧边的短句（限制字数）
  const sideQuotes = shortQuotes.slice(0, 12).map(q => q.length > 8 ? q.slice(0, 8) : q);

  // 上下区域使用的长句
  const topQuotes = shortQuotes.slice(0, 10);
  const bottomQuotes = shortQuotes.slice(10, 20);

  // ===== 翻页 =====
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < books.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // ===== 触摸 =====
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - touchStartX;
    setTouchDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX < 0 && currentIndex < books.length - 1) goNext();
      else if (touchDeltaX > 0 && currentIndex > 0) goPrev();
    }
    setTouchDeltaX(0);
    setIsDragging(false);
  };

  // ===== 鼠标 =====
  const handleMouseDown = (e) => {
    setTouchStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - touchStartX;
    setTouchDeltaX(delta);
  };

  const handleMouseUp = () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX < 0 && currentIndex < books.length - 1) goNext();
      else if (touchDeltaX > 0 && currentIndex > 0) goPrev();
    }
    setTouchDeltaX(0);
    setIsDragging(false);
  };

  // ===== 键盘 =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (view === 'reading') goToBook();
        else if (view === 'bookDetail') goToBookshelf();
      }
      if (e.key === 'ArrowRight' && view === 'bookshelf') goNext();
      if (e.key === 'ArrowLeft' && view === 'bookshelf') goPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [view, currentIndex]);

  // ===== 打开/关闭 =====
  const openBook = (book) => {
    setSelectedBook(book);
    setView('bookDetail');
  };

  const openReading = (entry) => {
    setSelectedEntry(entry);
    setView('reading');
  };

  const goToBookshelf = () => {
    setView('bookshelf');
    setSelectedBook(null);
    setSelectedEntry(null);
  };

  const goToBook = () => {
    setView('bookDetail');
    setSelectedEntry(null);
  };

  // ===== 自动翻页 =====
  useEffect(() => {
    if (view === 'bookshelf') {
      autoFlipTimer.current = setInterval(() => {
        if (currentIndex < books.length - 1) setCurrentIndex(currentIndex + 1);
        else setCurrentIndex(0);
      }, 5000);
    }
    return () => clearInterval(autoFlipTimer.current);
  }, [view, currentIndex]);

  // ===== 样式 =====
  const styles = {
    container: {
      height: '100%',
      background: '#FAF6F7',
      padding: '12px 14px 100px',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
      position: 'relative',
    },

    // ---- 背景文字（四个固定区域） ----
    bgWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
    },
    // 顶部：横向文字
    bgTop: {
      position: 'absolute',
      top: '10px',
      left: '10%',
      right: '10%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '8px 20px',
    },
    // 底部：横向文字
    bgBottom: {
      position: 'absolute',
      bottom: '10px',
      left: '10%',
      right: '10%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '8px 20px',
    },
    // 左侧：竖向文字（每个字一行）
    bgLeft: {
      position: 'absolute',
      top: '20%',
      left: '4px',
      bottom: '20%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '24px',
    },
    // 右侧：竖向文字（每个字一行）
    bgRight: {
      position: 'absolute',
      top: '20%',
      right: '4px',
      bottom: '20%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '24px',
    },
    bgTextHorizontal: {
      fontSize: '12px',
      color: '#000000',
      opacity: 0.18,
      fontWeight: '400',
      letterSpacing: '1px',
      fontFamily: '"Georgia", "Times New Roman", serif',
      whiteSpace: 'nowrap',
    },
    bgTextVertical: {
      fontSize: '11px',
      color: '#000000',
      opacity: 0.16,
      fontWeight: '400',
      letterSpacing: '2px',
      fontFamily: '"Georgia", "Times New Roman", serif',
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      lineHeight: 1.4,
    },

    // ---- 顶部导航 ----
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 2px 12px 2px',
      marginBottom: '8px',
      position: 'relative',
      zIndex: 2,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    backBtn: {
      background: 'rgba(255,255,255,0.5)',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      color: '#8B7A7E',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      backdropFilter: 'blur(4px)',
      transition: 'all 0.2s',
    },
    welcomeText: {
      fontSize: '14px',
      color: '#8B7A7E',
      fontWeight: '400',
      letterSpacing: '2px',
    },
    headerRight: {
      fontSize: '12px',
      color: '#C8B8BC',
      fontWeight: '300',
      letterSpacing: '1px',
      background: 'rgba(255,255,255,0.3)',
      padding: '2px 14px',
      borderRadius: '20px',
      backdropFilter: 'blur(4px)',
    },

    // ---- 书架 ----
    bookshelfWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100% - 80px)',
      padding: '10px 0 8px',
      position: 'relative',
      zIndex: 1,
    },
    bookContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
      position: 'relative',
      padding: '0 4px',
      zIndex: 2,
    },
    flipBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 2px 12px rgba(180,160,165,0.06)',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#8B7A7E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.25s ease',
      flexShrink: 0,
      zIndex: 5,
    },
    flipBtnDisabled: {
      opacity: 0.1,
      cursor: 'not-allowed',
    },
    bookCard: (color, bgColor, isCurrent) => ({
      width: '210px',
      height: '290px',
      borderRadius: '4px 16px 16px 4px',
      background: `linear-gradient(145deg, ${bgColor}, ${color}12)`,
      boxShadow: isCurrent
        ? '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.04), 8px 0 24px rgba(0,0,0,0.02)'
        : '0 4px 20px rgba(0,0,0,0.03), 0 1px 4px rgba(0,0,0,0.01)',
      cursor: isCurrent ? 'pointer' : 'default',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '22px 20px',
      transform: isCurrent ? 'scale(1) rotate(0deg)' : 'scale(0.78) rotate(2deg)',
      opacity: isCurrent ? 1 : 0.25,
      border: '1px solid rgba(255,255,255,0.4)',
      flexShrink: 0,
      borderLeft: '8px solid',
      borderLeftColor: color,
    }),
    bookSpineDecor: (color) => ({
      position: 'absolute',
      left: '-6px',
      top: '12px',
      bottom: '12px',
      width: '3px',
      borderRadius: '2px',
      background: color,
      opacity: 0.3,
    }),
    coverTitle: (textColor) => ({
      fontSize: '26px',
      fontWeight: '700',
      color: textColor,
      textAlign: 'center',
      lineHeight: 1.3,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '2px',
      marginBottom: '6px',
    }),
    coverSub: {
      fontSize: '10px',
      color: '#B8A8AC',
      letterSpacing: '4px',
      fontWeight: '300',
    },
    coverCount: (color) => ({
      fontSize: '12px',
      color: color,
      opacity: 0.4,
      marginTop: '8px',
      fontWeight: '400',
      letterSpacing: '2px',
    }),
    coverLine: {
      width: '36px',
      height: '1.5px',
      background: 'linear-gradient(90deg, transparent, rgba(180,160,165,0.2), transparent)',
      margin: '8px 0 10px',
    },
    tapHint: (color) => ({
      fontSize: '11px',
      color: color,
      opacity: 0.5,
      marginTop: '10px',
      letterSpacing: '1px',
      border: '1px solid rgba(180,160,165,0.06)',
      padding: '4px 16px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(4px)',
    }),

    indicatorArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      marginTop: '16px',
      zIndex: 2,
      position: 'relative',
    },
    indicatorDots: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    dot: (active, color) => ({
      width: active ? '24px' : '5px',
      height: '5px',
      borderRadius: '3px',
      background: active ? color : '#E0D0D4',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      opacity: active ? 1 : 0.3,
      boxShadow: active ? `0 2px 8px ${color}25` : 'none',
    }),
    indicatorLabel: {
      fontSize: '10px',
      color: '#C8B8BC',
      letterSpacing: '1.5px',
      fontWeight: '300',
    },

    // ---- 书本内页 ----
    bookDetailHeader: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      paddingBottom: '14px',
      borderBottom: `2px solid ${color}20`,
      marginBottom: '16px',
    }),
    bookDetailCover: (color, bgColor) => ({
      width: '48px',
      height: '60px',
      borderRadius: '4px 8px 8px 4px',
      background: `linear-gradient(145deg, ${bgColor}, ${color}20)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      border: '1px solid rgba(255,255,255,0.4)',
      borderLeft: `4px solid ${color}`,
      flexShrink: 0,
    }),
    bookDetailInfo: { flex: 1 },
    bookDetailTitle: { fontSize: '17px', fontWeight: '600', color: '#4A3A3E' },
    bookDetailSub: { fontSize: '12px', color: '#B8A8AC', marginTop: '1px' },
    entriesGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
    },
    entryCard: (color) => ({
      background: 'white',
      borderRadius: '16px',
      padding: '14px 14px 12px',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 12px rgba(180, 160, 165, 0.04)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }),
    entryCardAccent: (color) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: color,
    }),
    entryCardDate: { fontSize: '10px', color: '#B8A8AC', marginBottom: '4px' },
    entryCardTitle: { fontSize: '14px', fontWeight: '600', color: '#4A3A3E', marginBottom: '4px', lineHeight: 1.3 },
    entryCardPreview: {
      fontSize: '12px',
      color: '#B8A8AC',
      lineHeight: 1.4,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    entryCardMore: { fontSize: '10px', color: '#D8C8CC', marginTop: '4px' },

   // ---- 阅读模式（情书格式 + 线条花朵） ----
readingOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  overflow: 'hidden',
  animation: 'fadeIn 0.45s ease-out',
  background: '#F0E6D8',
},
// 信纸做旧背景
readingBg: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    radial-gradient(ellipse at 20% 30%, rgba(200, 180, 160, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 70%, rgba(200, 180, 160, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 50%, rgba(180, 160, 140, 0.02) 0%, transparent 80%)
  `,
  zIndex: 0,
  pointerEvents: 'none',
},
// 信纸横线
readingBgLines: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  pointerEvents: 'none',
  backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 29px, rgba(180, 160, 140, 0.06) 29px, rgba(180, 160, 140, 0.06) 30px)',
  backgroundSize: '100% 100%',
},
// 边缘做旧
readingBgEdge: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  pointerEvents: 'none',
  boxShadow: 'inset 0 0 80px rgba(160, 140, 120, 0.06), inset 0 0 40px rgba(160, 140, 120, 0.04)',
},
// 花朵装饰 - 线条风格（大）
readingFlower: (pos, rotate, size) => ({
  position: 'absolute',
  top: pos.top || 'auto',
  bottom: pos.bottom || 'auto',
  left: pos.left || 'auto',
  right: pos.right || 'auto',
  fontSize: size || '36px',
  opacity: 0.10,
  transform: `rotate(${rotate || 0}deg)`,
  zIndex: 1,
  pointerEvents: 'none',
  textShadow: '0 0 20px rgba(200, 180, 160, 0.1)',
  fontFamily: 'Georgia, serif',
}),
// 花朵线条框装饰
readingFlowerBorder: {
  position: 'absolute',
  top: '12px',
  left: '12px',
  right: '12px',
  bottom: '12px',
  zIndex: 1,
  pointerEvents: 'none',
  border: '1px solid rgba(200, 180, 160, 0.06)',
  borderRadius: '4px',
},
// 内容容器
readingContentWrapper: {
  position: 'relative',
  zIndex: 2,
  padding: '20px 28px 40px',
  height: '100%',
  overflowY: 'auto',
  maxWidth: '580px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
},
// 顶部装饰线 + 书名
readingHeaderTitle: {
  textAlign: 'center',
  padding: '4px 0 10px',
  marginBottom: '6px',
  position: 'relative',
  flexShrink: 0,
},
readingBookTitle: {
  fontSize: '17px',
  fontWeight: '600',
  color: '#8B6A5A',
  letterSpacing: '6px',
  fontFamily: '"Georgia", "Times New Roman", serif',
  opacity: 0.75,
},
readingBookTitleDecor: {
  fontSize: '11px',
  color: '#B8A090',
  letterSpacing: '4px',
  marginTop: '2px',
  opacity: 0.4,
  fontStyle: 'italic',
},
// 情书格式 - 称呼
readingSalutation: {
  fontSize: '18px',
  fontWeight: '600',
  color: '#5A4A3E',
  marginBottom: '6px',
  fontFamily: '"Georgia", "Times New Roman", serif',
  letterSpacing: '1px',
  opacity: 0.8,
},
// 日期（情书右上角）
readingDate: {
  fontSize: '12px',
  color: '#B8A8A0',
  textAlign: 'right',
  marginBottom: '10px',
  letterSpacing: '1.5px',
  fontFamily: '"Georgia", "Times New Roman", serif',
  opacity: 0.5,
  fontStyle: 'italic',
},
// 正文
readingContent: {
  fontSize: '16px',
  lineHeight: 2.2,
  color: '#5A4A3E',
  padding: '0 4px',
  flex: 1,
  fontFamily: '"Georgia", "Times New Roman", serif',
  opacity: 0.9,
},
readingContentP: {
  marginBottom: '16px',
  textIndent: '2em',
},
// 落款区域
readingClosing: {
  marginTop: '20px',
  textAlign: 'right',
  paddingTop: '12px',
  borderTop: '1px solid rgba(180, 160, 140, 0.08)',
},
readingClosingText: {
  fontSize: '16px',
  color: '#5A4A3E',
  fontFamily: '"Georgia", "Times New Roman", serif',
  fontStyle: 'italic',
  opacity: 0.7,
  letterSpacing: '1px',
},
readingClosingName: {
  fontSize: '17px',
  color: '#8B6A5A',
  fontFamily: '"Georgia", "Times New Roman", serif',
  fontWeight: '600',
  marginTop: '4px',
  opacity: 0.8,
  letterSpacing: '2px',
},
// 导航栏
readingHeader: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '4px',
  padding: '0 2px',
  flexShrink: 0,
},
readingBack: {
  background: 'none',
  border: 'none',
  fontSize: '14px',
  cursor: 'pointer',
  color: '#8B7A6A',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: '10px',
  transition: 'background 0.2s',
  fontFamily: '"Georgia", "Times New Roman", serif',
  opacity: 0.4,
},
readingClose: {
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#B8A8A0',
  padding: '4px 8px',
  opacity: 0.3,
  transition: 'color 0.2s',
},
readingTitle: {
  fontSize: '22px',
  fontWeight: '700',
  color: '#5A4A3E',
  textAlign: 'center',
  marginBottom: '8px',
  lineHeight: 1.3,
  fontFamily: '"Georgia", "Times New Roman", serif',
  letterSpacing: '1px',
  opacity: 0.9,
},
readingDivider: {
  width: '60px',
  height: '1px',
  background: 'linear-gradient(90deg, transparent, #C9B0A0, transparent)',
  margin: '0 auto 16px',
  borderRadius: '2px',
  opacity: 0.2,
},

    readingContentP: { marginBottom: '20px', textIndent: '2em' },
  };

  // ===== 渲染：书架 =====
  const renderBookshelf = () => {
    const book = books[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === books.length - 1;

    return (
      <>
        {/* 顶部导航 */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backBtn}
              onClick={onBack}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
              }}
            >
              ‹
            </button>
            <span style={styles.welcomeText}>欢迎 ✦ 翻开我们的故事</span>
          </div>
          <span style={styles.headerRight}>
            {currentIndex + 1} / {books.length}
          </span>
        </div>

        <div
          style={styles.bookshelfWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (isDragging) {
              setTouchDeltaX(0);
              setIsDragging(false);
            }
          }}
          ref={containerRef}
        >
          {/* 背景文字 - 四个固定区域 */}
          <div style={styles.bgWrapper}>
            {/* 顶部横向 */}
            <div style={styles.bgTop}>
              {topQuotes.map((q, idx) => (
                <span
                  key={`top-${idx}`}
                  style={{
                    ...styles.bgTextHorizontal,
                    transform: `rotate(${(idx % 3 - 1) * 0.5}deg)`,
                    opacity: 0.12 + (idx % 4) * 0.025,
                    fontSize: 11 + (idx % 3) * 1.5,
                  }}
                >
                  {q}
                </span>
              ))}
            </div>

            {/* 底部横向 */}
            <div style={styles.bgBottom}>
              {bottomQuotes.map((q, idx) => (
                <span
                  key={`bottom-${idx}`}
                  style={{
                    ...styles.bgTextHorizontal,
                    transform: `rotate(${(idx % 3 - 1) * 0.5}deg)`,
                    opacity: 0.12 + (idx % 4) * 0.025,
                    fontSize: 11 + (idx % 3) * 1.5,
                  }}
                >
                  {q}
                </span>
              ))}
            </div>

            {/* 左侧竖排（每个字一行） */}
            <div style={styles.bgLeft}>
              {sideQuotes.slice(0, 8).map((q, idx) => (
                <span
                  key={`left-${idx}`}
                  style={{
                    ...styles.bgTextVertical,
                    opacity: 0.12 + (idx % 3) * 0.025,
                    fontSize: 10 + (idx % 3) * 1,
                  }}
                >
                  {q}
                </span>
              ))}
            </div>

            {/* 右侧竖排（每个字一行） */}
            <div style={styles.bgRight}>
              {sideQuotes.slice(8, 16).map((q, idx) => (
                <span
                  key={`right-${idx}`}
                  style={{
                    ...styles.bgTextVertical,
                    opacity: 0.12 + (idx % 3) * 0.025,
                    fontSize: 10 + (idx % 3) * 1,
                  }}
                >
                  {q}
                </span>
              ))}
            </div>
          </div>

          {/* 图书区域 */}
          <div style={styles.bookContainer}>
            <button
              style={{
                ...styles.flipBtn,
                ...(isFirst ? styles.flipBtnDisabled : {}),
              }}
              onClick={goPrev}
              disabled={isFirst}
              onMouseEnter={(e) => {
                if (!isFirst) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(180,160,165,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(180,160,165,0.04)';
              }}
            >
              ‹
            </button>

            <div
              style={styles.bookCard(book.color, book.bgColor, true)}
              onClick={() => openBook(book)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 24px 72px rgba(0,0,0,0.13), 0 8px 24px rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.04), 8px 0 24px rgba(0,0,0,0.02)';
              }}
            >
              <div style={styles.bookSpineDecor(book.color)} />
              <div style={styles.coverTitle(book.textColor)}>
                {book.title}
              </div>
              <div style={styles.coverLine} />
              <div style={styles.coverSub}>DIARY</div>
              <div style={styles.coverCount(book.color)}>
                ✦ {book.count} 篇 ✦
              </div>
              <div style={styles.tapHint(book.color)}>翻开 →</div>
            </div>

            <button
              style={{
                ...styles.flipBtn,
                ...(isLast ? styles.flipBtnDisabled : {}),
              }}
              onClick={goNext}
              disabled={isLast}
              onMouseEnter={(e) => {
                if (!isLast) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(180,160,165,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(180,160,165,0.04)';
              }}
            >
              ›
            </button>
          </div>

          <div style={styles.indicatorArea}>
            <div style={styles.indicatorDots}>
              {books.map((b, idx) => (
                <span
                  key={idx}
                  style={styles.dot(idx === currentIndex, b.color)}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
            <div style={styles.indicatorLabel}>✦ {books[currentIndex].title}</div>
          </div>
        </div>
      </>
    );
  };

  // ===== 渲染：书本内页 =====
  const renderBookDetail = () => {
    if (!selectedBook) return null;
    const book = selectedBook;

    return (
      <>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.backBtn}
              onClick={goToBookshelf}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
              }}
            >
              ‹
            </button>
            <span style={styles.welcomeText}>📖 {book.title}</span>
          </div>
          <span style={styles.headerRight}>{book.count} 篇</span>
        </div>

        <div style={styles.bookDetailHeader(book.color)}>
          <div style={styles.bookDetailCover(book.color, book.bgColor)}>
            <span style={{ fontSize: '12px', color: book.textColor, fontWeight: '600' }}>
              {book.title.slice(0, 2)}
            </span>
          </div>
          <div style={styles.bookDetailInfo}>
            <div style={styles.bookDetailTitle}>{book.title}</div>
            <div style={styles.bookDetailSub}>共 {book.count} 篇日记 · 点击卡片阅读</div>
          </div>
        </div>

        <div style={styles.entriesGrid}>
          {book.entries.map((entry) => (
            <div
              key={entry.id}
              style={styles.entryCard(book.color)}
              onClick={() => openReading(entry)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(180, 160, 165, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(180, 160, 165, 0.04)';
              }}
            >
              <div style={styles.entryCardAccent(book.color)} />
              <div style={styles.entryCardDate}>{entry.date}</div>
              <div style={styles.entryCardTitle}>{entry.title}</div>
              <div style={styles.entryCardPreview}>
                {entry.content.slice(0, 30)}...
              </div>
              <div style={styles.entryCardMore}>阅读全文 ›</div>
            </div>
          ))}
        </div>

        <div style={{ height: '20px' }} />
      </>
    );
  };

// ===== 渲染：阅读（情书格式 + 线条花朵装饰） =====
const renderReading = () => {
  if (!selectedEntry) return null;
  const entry = selectedEntry;
  const book = books.find(b => b.entries.some(e => e.id === entry.id));
  
  // 提取称呼：从内容第一句提取，或者使用默认
  const contentLines = entry.content.split('\n');
  const firstLine = contentLines[0] || '';
  const salutation = firstLine.includes('你') ? '亲爱的你' : 'Dear';
  
  // 正文（去掉第一句作为称呼后的内容）
  const bodyContent = contentLines.slice(1).join('\n') || entry.content;

  return (
    <div style={styles.readingOverlay}>
      {/* 信纸背景 */}
      <div style={styles.readingBg} />
      <div style={styles.readingBgLines} />
      <div style={styles.readingBgEdge} />
      <div style={styles.readingFlowerBorder} />

      {/* 线条花朵装饰 - 四个角落（大号） */}
      <div style={styles.readingFlower({ top: '14px', left: '14px' }, -10, '42px')}>🌷</div>
      <div style={styles.readingFlower({ top: '14px', right: '14px' }, 10, '38px')}>🌺</div>
      <div style={styles.readingFlower({ bottom: '14px', left: '14px' }, -8, '38px')}>🌸</div>
      <div style={styles.readingFlower({ bottom: '14px', right: '14px' }, 8, '42px')}>🌻</div>

      {/* 额外花朵装饰 - 中间两侧 */}
      <div style={styles.readingFlower({ top: '40%', left: '8px' }, -5, '28px')}>🌱</div>
      <div style={styles.readingFlower({ top: '55%', right: '8px' }, 5, '28px')}>🌿</div>

      {/* 内容层 */}
      <div style={styles.readingContentWrapper}>
        {/* 顶部书名（居中） */}
        <div style={styles.readingHeaderTitle}>
          <div style={styles.readingBookTitle}>✦ {book ? book.title : '日记'} ✦</div>
          <div style={styles.readingBookTitleDecor}>— 写 给 你 的 信 —</div>
        </div>

        {/* 导航栏 */}
        <div style={styles.readingHeader}>
          <button style={styles.readingBack} onClick={goToBook}>‹ 返回</button>
          <span style={styles.readingDate}>{entry.date}</span>
          <button style={styles.readingClose} onClick={goToBook}>✕</button>
        </div>

        {/* 日记标题 */}
        <div style={styles.readingTitle}>{entry.title}</div>
        <div style={styles.readingDivider} />

        {/* 情书格式：称呼 */}
        <div style={styles.readingSalutation}>
          {salutation}：
        </div>

        {/* 情书正文 */}
        <div style={styles.readingContent}>
          {bodyContent.split('\n').map((para, i) => (
            <p key={i} style={styles.readingContentP}>{para || '\u00A0'}</p>
          ))}
        </div>

        {/* 落款 */}
        <div style={styles.readingClosing}>
          <div style={styles.readingClosingText}>想你的每一个瞬间</div>
          <div style={styles.readingClosingName}>
            ——— {book && book.title.includes('小棋') ? '小棋' : book && book.title.includes('小克') ? '小克' : '你爱的人'}
          </div>
        </div>

        <div style={{ height: '30px' }} />
      </div>
    </div>
  );
};
  // ===== 主渲染 =====
  if (view === 'reading') return renderReading();
  if (view === 'bookDetail') {
    return (
      <div style={styles.container}>
        {renderBookDetail()}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {renderBookshelf()}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MemoryDiary;