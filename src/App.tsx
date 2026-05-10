import React, { useState, useCallback } from 'react';
import { apps } from './data/apps';
import StartMenu from './components/Taskbar/StartMenu';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import { soundService } from './services/soundService';

import './styles/index.css';


import BIOSScreen from './components/Boot/BIOSScreen';
import WinBootScreen from './components/Boot/WinBootScreen';
import LoginScreen from './components/Boot/LoginScreen';

const App: React.FC = () => {
  // State for boot sequence: 'bios' | 'booting' | 'login' | 'ready'
  const [bootState, setBootState] = useState<'bios' | 'booting' | 'login' | 'ready'>(() => {
    const hasBooted = localStorage.getItem('hasBootedBefore');
    return hasBooted ? 'ready' : 'bios';
  });

  // Play startup sound when ready
  React.useEffect(() => {
    if (bootState === 'ready') {
      soundService.playStartupSound();
    }
  }, [bootState]);

  // State for open windows (array of app ids)
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  // State for minimized windows (array of app ids)
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  // State for start menu visibility
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  // State for the currently active/focused window
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  // Open a window by app id
  const openWindow = useCallback((appId: string) => {
    setOpenWindows((prev) => prev.includes(appId) ? prev : [...prev, appId]);
    setMinimizedWindows((prev) => prev.filter(id => id !== appId)); // Restore if minimized
    setStartMenuOpen(false);
    setActiveAppId(appId); // Set as active
  }, []);

  // Close a window by app id
  const closeWindow = useCallback((appId: string) => {
    setOpenWindows((prev) => prev.filter(id => id !== appId));
    setMinimizedWindows((prev) => prev.filter(id => id !== appId));
    if (activeAppId === appId) setActiveAppId(null);
  }, [activeAppId]);

  // Minimize a window by app id
  const minimizeWindow = useCallback((appId: string) => {
    setMinimizedWindows((prev) => prev.includes(appId) ? prev : [...prev, appId]);
    if (activeAppId === appId) setActiveAppId(null);
  }, [activeAppId]);

  // Toggle start menu
  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen((open) => !open);
  }, []);

  // Handle Restart
  const handleRestart = useCallback(() => {
    localStorage.removeItem('hasBootedBefore');
    setBootState('bios');
    setOpenWindows([]);
    setMinimizedWindows([]);
    setStartMenuOpen(false);
    setActiveAppId(null);
  }, []);

  const onBIOSComplete = () => {
    setBootState('booting');
  };

  const onBootComplete = () => {
    setBootState('login');
  };

  const onLoginComplete = (username: string) => {
    localStorage.setItem('hasBootedBefore', 'true');
    setBootState('ready');
    // Optionally use the username
  };

  const renderContent = () => {
    if (bootState === 'bios') {
      return <BIOSScreen onComplete={onBIOSComplete} />;
    }

    if (bootState === 'booting') {
      return <WinBootScreen onComplete={onBootComplete} />;
    }

    if (bootState === 'login') {
      return <LoginScreen onLogin={onLoginComplete} />;
    }

    return (
      <>
        <Desktop
          apps={apps}
          openWindows={openWindows.filter(id => !minimizedWindows.includes(id))}
          onIconDoubleClick={openWindow}
          onWindowClose={closeWindow}
          onWindowMinimize={minimizeWindow}
          activeAppId={activeAppId}
          onWindowFocus={setActiveAppId}
        />
        <Taskbar
          onStartClick={toggleStartMenu}
          openWindows={openWindows}
          minimizedWindows={minimizedWindows}
          onTaskbarAppClick={(id) => {
            if (minimizedWindows.includes(id) || activeAppId !== id) {
              openWindow(id);
            } else {
              minimizeWindow(id);
            }
          }}
          startMenuOpen={startMenuOpen}
          activeAppId={activeAppId}
        />
        <StartMenu
          open={startMenuOpen}
          apps={apps}
          onAppClick={openWindow}
          onRestart={handleRestart}
        />
      </>
    );
  };

  return (
    <div className="desktop">
      {/* Global CRT Overlay */}
      <div className="crt-overlay" />
      {renderContent()}
    </div>
  );
};

export default App;
