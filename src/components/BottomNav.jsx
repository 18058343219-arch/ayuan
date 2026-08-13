import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  HeartIcon,
  MusicalNoteIcon,
  ChatBubbleLeftIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const BottomNav = () => {
  const links = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/memory', label: 'Memory', icon: BookOpenIcon },
    { path: '/chat', label: 'Chat', icon: HeartIcon },
    { path: '/together', label: 'Together', icon: MusicalNoteIcon },
    { path: '/mine', label: 'Mine', icon: UserIcon },
  ];

  const coralPink = '#FF8A9B';
  const coralPinkLight = 'rgba(255, 138, 155, 0.5)';
  const coralPinkShadow = 'rgba(255, 138, 155, 0.3)';

  const styles = {
    nav: {
      flexShrink: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 182, 193, 0.25)',
      padding: '6px 8px 10px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      position: 'relative',
    },
    link: (isActive) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2px',
      textDecoration: 'none',
      color: isActive ? coralPink : 'rgba(255, 182, 193, 0.5)',
      transition: 'color 0.2s',
      padding: '4px 0',
      width: '56px',
    }),
    icon: {
      width: '24px',
      height: '24px',
      strokeWidth: 1.8,
    },
    label: {
      fontSize: '9px',
      fontWeight: 600,
      letterSpacing: '0.3px',
    },
    centerButton: (isActive) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      marginTop: '-18px',
    }),
    heartWrapper: (isActive) => ({
      width: '54px',
      height: '54px',
      borderRadius: '50%',
      background: isActive ? `linear-gradient(135deg, ${coralPink}, #E87080)` : 'rgba(255, 138, 155, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isActive ? `0 4px 20px ${coralPinkShadow}` : 'none',
      transition: 'all 0.3s',
    }),
    heartIcon: {
      width: '28px',
      height: '28px',
      strokeWidth: 1.8,
    },
  };

  return (
    <nav style={styles.nav}>
      {links.map((item) => {
        const isCenter = item.path === '/chat';
        const IconComponent = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) =>
              isCenter ? styles.centerButton(isActive) : styles.link(isActive)
            }
          >
            {({ isActive }) => (
              <>
                {isCenter ? (
                  <div style={styles.heartWrapper(isActive)}>
                    {isActive ? (
                      <HeartSolid
                        style={{ ...styles.heartIcon, color: 'white' }}
                      />
                    ) : (
                      <HeartIcon
                        style={{ ...styles.heartIcon, color: coralPink }}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <IconComponent
                      style={{
                        ...styles.icon,
                        color: isActive ? coralPink : 'rgba(255, 182, 193, 0.5)',
                      }}
                    />
                    <span style={styles.label}>{item.label}</span>
                  </>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;