import React, { useState, useCallback } from 'react';
import { apps } from './data/apps';
import StartMenu from './components/Taskbar/StartMenu';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';

import './styles/index.css';


const App: React.FC = () => {
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
      />
    </div>
  );
};

export default App;
