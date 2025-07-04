import React from 'react';
import { AppMeta } from '../../data/apps';

interface DesktopIconProps {
  app: AppMeta;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onDoubleClick }) => (
  <div className="icon" data-app={app.id} onDoubleClick={onDoubleClick} tabIndex={0} role="button">
    <img src={app.icon} alt={app.title} />
    <span>{app.title}</span>
  </div>
);

export default DesktopIcon;
