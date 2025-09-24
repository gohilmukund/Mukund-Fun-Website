import React from 'react';


interface WindowTitlebarProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  iconUrl?: string;
}

const WindowTitlebar: React.FC<WindowTitlebarProps> = ({ title, onClose, onMinimize, iconUrl }) => (
  <div className="window-titlebar">
    <span className="window-title">{iconUrl && <img height={15} src={iconUrl} />} {title}</span>
    <div className="window-controls">
      <div className="window-minimize window-control-button" onClick={onMinimize} role="button" tabIndex={0}>−</div>
      <div className="window-close window-control-button" onClick={onClose} role="button" tabIndex={0}>✕</div>
    </div>
  </div>
);

export default WindowTitlebar;
