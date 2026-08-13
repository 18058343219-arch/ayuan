import React, { useState } from 'react';

const MemoryCollection = ({ onBack }) => {
  // ===== 收藏夹数据（封面用真实图片堆叠） =====
  const collections = [
    {
      id: 1,
      name: '日落收藏',
      images: [
        'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-7b4ec3cf9b6b?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 2,
      name: '美食手记',
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 3,
      name: '旅行碎片',
      images: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504208434309-cb69f4fe56b0?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 4,
      name: '可爱日常',
      images: [
        'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544568100-847a948585b9?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop',
      ],
    },
    {
      id: 5,
      name: '花与植物',
      images: [
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1532950398729-33f9dfa14e96?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1519531736487-63fbcf96e9d4?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527538079466-b5c2f078c1fe?w=300&h=300&fit=crop',
      ],
    },
  ];

  // ===== 状态 =====
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const openCollection = (collection) => setSelectedCollection(collection);
  const goBack = () => setSelectedCollection(null);
  const openImage = (img) => setSelectedImage(img);
  const closeImage = () => setSelectedImage(null);

  // ===== 样式 =====
  const styles = {
    container: {
      height: '100%',
      background: '#FAF6F7',
      padding: '16px 14px 100px',
      overflowY: 'auto',
      fontFamily: '-apple-system, "PingFang SC", sans-serif',
    },
    // 顶部导航
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '18px',
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
    detailCount: {
      fontSize: '12px',
      color: '#B8A8AC',
      fontWeight: '300',
      letterSpacing: '1px',
    },
    // ---- 主标题美化 ----
    mainTitleWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '16px',
      padding: '4px 0',
      width: '100%',
    },
    mainTitleLine: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(180, 160, 165, 0.2), transparent)',
    },
    mainTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#4A3A3E',
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '2px',
      padding: '0 12px',
      whiteSpace: 'nowrap',
    },
    // ---- 收藏夹网格 ----
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    // ---- 收藏夹卡片（照片堆叠） ----
    collectionCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '16px 14px 14px',
      boxShadow: '0 2px 16px rgba(180, 160, 165, 0.06)',
      border: '1px solid rgba(255,255,255,0.6)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      minHeight: '150px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  // ---- 照片堆叠（更大） ----
photoStack: {
  position: 'relative',
  height: '130px',          // 从 90px 增大到 130px
  marginBottom: '8px',
},
stackPhoto: (index, total) => ({
  position: 'absolute',
  top: `${index * 8}px`,    // 从 6px 增大到 8px，错落更明显
  left: `${10 + index * 28}px`, // 从 22px 增大到 28px
  width: '90px',            // 从 60px 增大到 90px
  height: '90px',
  borderRadius: '12px',
  objectFit: 'cover',
  transform: `rotate(${(index - 1) * 6}deg)`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  border: '2.5px solid white',
  opacity: 0.95,
  transition: 'transform 0.2s',
}),
    collectionName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#4A3A3E',
      letterSpacing: '0.3px',
      marginTop: 'auto',
      paddingTop: '6px',
      borderTop: '1px solid rgba(200, 180, 190, 0.06)',
    },
    collectionCount: {
      fontSize: '11px',
      color: '#B8A8AC',
      fontWeight: '400',
      marginLeft: '4px',
    },
    // ---- 收藏夹详情 ----
    detailTitleWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '16px',
      padding: '4px 0',
      position: 'relative',
    },
    detailTitleLine: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(180, 160, 165, 0.15), transparent)',
    },
    detailTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#4A3A3E',
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '2px',
      padding: '0 12px',
      whiteSpace: 'nowrap',
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
    },
    imageItem: {
      aspectRatio: '1/1',
      borderRadius: '14px',
      background: 'rgba(255,255,255,0.5)',
      border: '1px solid rgba(255,255,255,0.3)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 2px 8px rgba(180, 160, 165, 0.04)',
    },
    // ---- 图片放大查看 ----
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(60, 40, 50, 0.92)',
      backdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.25s ease-out',
    },
    modalContent: {
      position: 'relative',
      maxWidth: '85%',
      maxHeight: '85%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    modalImage: {
      maxWidth: '85vw',
      maxHeight: '80vh',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'scaleIn 0.3s ease-out',
      objectFit: 'contain',
    },
    modalClose: {
      position: 'absolute',
      top: '-16px',
      right: '-16px',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(8px)',
      color: 'white',
      fontSize: '22px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    modalHint: {
      color: 'rgba(255,255,255,0.3)',
      fontSize: '12px',
      marginTop: '16px',
      letterSpacing: '2px',
    },
  };

  // ===== 渲染：收藏夹列表 =====
  const renderCollections = () => (
    <>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onBack}>‹</button>
        </div>
        <span style={styles.detailCount}>{collections.length} 个收藏夹</span>
      </div>

      <div style={styles.mainTitleWrapper}>
        <span style={styles.mainTitleLine} />
        <span style={styles.mainTitle}>✦ 小克收藏 ✦</span>
        <span style={styles.mainTitleLine} />
      </div>

      <div style={styles.grid}>
        {collections.map((collection) => {
          // 取前3张作为封面堆叠
          const coverPhotos = collection.images.slice(0, 3);
          return (
            <div
              key={collection.id}
              style={styles.collectionCard}
              onClick={() => openCollection(collection)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(180, 160, 165, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(180, 160, 165, 0.06)';
              }}
            >
              <div style={styles.photoStack}>
                {coverPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`${collection.name} 封面 ${idx + 1}`}
                    style={styles.stackPhoto(idx, coverPhotos.length)}
                  />
                ))}
              </div>
              <div style={styles.collectionName}>
                {collection.name}
                <span style={styles.collectionCount}>{collection.images.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  // ===== 渲染：收藏夹详情 =====
  const renderDetail = () => {
    if (!selectedCollection) return null;
    const { name, images } = selectedCollection;

    return (
      <>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.backBtn} onClick={goBack}>‹</button>
          </div>
          <span style={styles.detailCount}>{images.length} 张</span>
        </div>

        <div style={styles.detailTitleWrapper}>
          <span style={styles.detailTitleLine} />
          <span style={styles.detailTitle}>✦ {name} ✦</span>
          <span style={styles.detailTitleLine} />
        </div>

        <div style={styles.imageGrid}>
          {images.map((img, idx) => (
            <div
              key={idx}
              style={styles.imageItem}
              onClick={() => openImage(img)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(180, 160, 165, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(180, 160, 165, 0.04)';
              }}
            >
              <img src={img} alt="收藏图片" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </>
    );
  };

  // ===== 渲染：图片放大 =====
  const renderModal = () => {
    if (!selectedImage) return null;
    return (
      <div style={styles.modalOverlay} onClick={closeImage}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button
            style={styles.modalClose}
            onClick={closeImage}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ✕
          </button>
          <img src={selectedImage} alt="放大查看" style={styles.modalImage} />
          <div style={styles.modalHint}>点击任意处关闭</div>
        </div>
      </div>
    );
  };

  // ===== 主渲染 =====
  return (
    <div style={styles.container}>
      {selectedCollection ? renderDetail() : renderCollections()}
      {renderModal()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MemoryCollection;