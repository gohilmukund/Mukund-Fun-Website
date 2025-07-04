import React from 'react';


interface WindowTitlebarProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
}

const WindowTitlebar: React.FC<WindowTitlebarProps> = ({ title, onClose, onMinimize }) => (
  <div className="window-titlebar">
    <span className="window-title">{title}</span>
    <div className="window-controls">
      <div className="window-minimize window-control-button" onClick={onMinimize} role="button" tabIndex={0}>−</div>
      <div className="window-close window-control-button" onClick={onClose} role="button" tabIndex={0}>✕</div>
    </div>
  </div>
);

export default WindowTitlebar;
