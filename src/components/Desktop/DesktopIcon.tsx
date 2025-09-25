import React from 'react';
import { AppMeta } from '../../data/apps';

interface DesktopIconProps {
  app: AppMeta;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onDoubleClick }) => (
  // onsingleclick make the border appear
  <div className="icon" data-app={app.id} onClick={()=>{
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
      if (icon === document.querySelector(`.icon[data-app='${app.id}']`)) {
        icon.classList.add('selected');
      } else {
        icon.classList.remove('selected');
      }
    });
  }} onDoubleClick={onDoubleClick}  tabIndex={0} role="button">
    <img src={app.icon} alt={app.title} />
    <span>{app.title}</span>
  </div>
);

export default DesktopIcon;
