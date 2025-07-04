import React from 'react';

import { AppMeta } from '../../data/apps';

interface StartMenuProps {
  open: boolean;
  apps: AppMeta[];
  onAppClick: (appId: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ open, apps, onAppClick }) => {
  // Always render the start menu, but toggle the .active class for visibility
  return (
    <div className={`start-menu${open ? ' active' : ''}`} id="start-menu">
      <div className="start-menu-banner">
        {/* <img src="/icon.png" alt="Windows 95" className="start-menu-banner-logo" /> */}
        <span className="start-menu-banner-text">Windows 95</span>
      </div>
      <div className="start-menu-items">
        {apps.map(app => (
          <div
            key={app.id}
            className="start-menu-item"
            data-app={app.id}
            onClick={() => onAppClick(app.id)}
            role="menuitem"
            tabIndex={0}
          >
            <img src={app.icon} alt="" className="start-menu-item-icon" />
            <span className="start-menu-item-label">{app.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartMenu;
