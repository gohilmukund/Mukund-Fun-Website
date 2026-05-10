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

  // Open a window by app id
  const openWindow = useCallback((appId: string) => {
    setOpenWindows((prev) => prev.includes(appId) ? prev : [...prev, appId]);
    setMinimizedWindows((prev) => prev.filter(id => id !== appId)); // Restore if minimized
    setStartMenuOpen(false);
  }, []);

  // Close a window by app id
  const closeWindow = useCallback((appId: string) => {
    setOpenWindows((prev) => prev.filter(id => id !== appId));
    setMinimizedWindows((prev) => prev.filter(id => id !== appId));
  }, []);

  // Minimize a window by app id
  const minimizeWindow = useCallback((appId: string) => {
    setMinimizedWindows((prev) => prev.includes(appId) ? prev : [...prev, appId]);
  }, []);

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
    <div className="desktop">
      <Desktop
        apps={apps}
        openWindows={openWindows.filter(id => !minimizedWindows.includes(id))}
        onIconDoubleClick={openWindow}
        onWindowClose={closeWindow}
        onWindowMinimize={minimizeWindow}
      />
      <Taskbar
        onStartClick={toggleStartMenu}
        openWindows={openWindows}
        minimizedWindows={minimizedWindows}
        onTaskbarAppClick={openWindow}
        startMenuOpen={startMenuOpen}
      />
      <StartMenu
        open={startMenuOpen}
        apps={apps}
        onAppClick={openWindow}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default App;
