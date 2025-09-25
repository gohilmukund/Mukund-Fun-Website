// To be deleted: src/components/Windows/Window.tsx
import React from 'react';
import WindowTitlebar from './WindowTitlebar';
import WindowContent from './WindowContent';
import { AppMeta } from '../../data/apps';

interface WindowProps {
  app: AppMeta;
  onClose: () => void;
  iconUrl?: string;
}


// Always add the 'active' class so the window is visible
const Window: React.FC<WindowProps> = ({ app, onClose, iconUrl }) => (
  <div className="window resizable active" id={app.id}>
    <WindowTitlebar title={app.title} iconUrl={iconUrl} onClose={onClose} />
    <WindowContent app={app} />
  </div>
);

export default Window;
