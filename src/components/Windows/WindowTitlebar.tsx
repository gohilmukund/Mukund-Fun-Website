import React from 'react';


interface WindowTitlebarProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  iconUrl?: string;
  isActive?: boolean;
}

const WindowTitlebar: React.FC<WindowTitlebarProps> = ({ title, onClose, onMinimize, onMaximize, isMaximized, iconUrl, isActive }) => (
  <div className={`window-titlebar ${isActive ? '' : 'inactive'}`}>
    <span className="window-title">{iconUrl && <img height={15} src={iconUrl} style={{ marginRight: '5px' }} />} {title}</span>
    <div className="window-controls">
      <button className="window-minimize window-control-button" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>_</button>
      <button className="window-maximize window-control-button" onClick={(e) => { e.stopPropagation(); onMaximize(); }}>
        {isMaximized ? '❐' : '☐'}
      </button>
      <button className="window-close window-control-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
    </div>
  </div>
);

export default WindowTitlebar;
