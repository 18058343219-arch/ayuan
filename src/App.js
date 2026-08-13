import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Memory from './pages/Memory';
import Together from './pages/Together';
import Mine from './pages/Mine';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const phoneFrameRef = useRef(null);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ===== 动态调整高度（应对键盘弹出） =====
  useEffect(() => {
    const updateHeight = () => {
      if (!phoneFrameRef.current) return;
      const visualHeight = window.visualViewport?.height || window.innerHeight;
      phoneFrameRef.current.style.height = `${visualHeight}px`;
    };

    updateHeight();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
    } else {
      window.addEventListener('resize', updateHeight);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      } else {
        window.removeEventListener('resize', updateHeight);
      }
    };
  }, []);

  const styles = {
    appWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      background: '#f0e6e9',
    },
    phoneFrame: {
      width: '100%',
      maxWidth: '420px',
      // height 由 JS 动态设置
      background: '#FFF5F7',
      borderRadius: '36px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,182,193,0.3)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    },
    content: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    routesWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    navWrapper: {
      flexShrink: 0,
    },
  };

  return (
    <BrowserRouter>
      <div style={styles.appWrapper}>
        <div ref={phoneFrameRef} style={styles.phoneFrame}>
          <div style={styles.content}>
            <div style={styles.routesWrapper}>
              <Routes>
                <Route path="/" element={<Home onMenuClick={openSidebar} />} />
                <Route path="/home" element={<Home onMenuClick={openSidebar} />} />
                <Route path="/memory" element={<Memory onMenuClick={openSidebar} />} />
                <Route path="/together" element={<Together onMenuClick={openSidebar} />} />
                <Route path="/chat" element={<Chat onMenuClick={openSidebar} />} />
                <Route path="/mine" element={<Mine onMenuClick={openSidebar} />} />
              </Routes>
            </div>
          </div>
          <div style={styles.navWrapper}>
            <BottomNav />
          </div>
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </BrowserRouter>
  );
}

export default App;