import React, { useEffect, useState } from 'react';

interface WinBootScreenProps {
  onComplete: () => void;
}

const WinBootScreen: React.FC<WinBootScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000); // Typical boot time simulation
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      backgroundImage: 'url(assets/Wallpaper.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Overlay to darken slightly if needed for readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '0px',
        width: '100%',
        height: '10px',
        backgroundColor: '#333',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <div className="boot-progress-bar" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scrollProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .boot-progress-bar {
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #000080, #0000ff, #000080, transparent);
          animation: scrollProgress 2s linear infinite;
        }
      `}} />
    </div>
  );
};

export default WinBootScreen;
