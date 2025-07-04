


interface TaskbarProps {
  onStartClick: () => void;
  openWindows: string[];
  minimizedWindows: string[];
  onTaskbarAppClick: (appId: string) => void;
  startMenuOpen?: boolean;
}

import React, { useEffect, useState } from 'react';

import { apps } from '../../data/apps';

const Taskbar: React.FC<TaskbarProps> = ({ onStartClick, openWindows, minimizedWindows, onTaskbarAppClick, startMenuOpen }) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div id="taskbar">
      <button
        id="start-button"
        onClick={onStartClick}
        className={startMenuOpen ? 'active' : ''}
        aria-pressed={startMenuOpen}
      >
        <img src="/assets/Start.png" alt="Start" style={{ width: 60, height: 20 }} />
      </button>
      <div id="taskbar-apps">
        {openWindows.map(appId => {
          const app = apps.find(a => a.id === appId);
          if (!app) return null;
          const isMinimized = minimizedWindows.includes(appId);
          return (
            <div
              key={appId}
              className={`taskbar-app${isMinimized ? ' minimized' : ''}`}
              onClick={() => onTaskbarAppClick(appId)}
              tabIndex={0}
              style={{ outline: 'none' }}
            >
              <img src={app.icon} alt={app.title} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.title}</span>
            </div>
          );
        })}
      </div>
      <div id="taskbar-clock">{timeString}</div>
    </div>
  );
};

export default Taskbar;
