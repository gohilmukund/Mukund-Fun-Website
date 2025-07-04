import React from 'react';
import WindowTitlebar from './WindowTitlebar';
import WindowContent from './WindowContent';
import { AppMeta } from '../../data/apps';

interface WindowProps {
  app: AppMeta;
  onClose: () => void;
}


// Always add the 'active' class so the window is visible
const Window: React.FC<WindowProps> = ({ app, onClose }) => (
  <div className="window resizable active" id={app.id}>
    <WindowTitlebar title={app.title} onClose={onClose} />
    <WindowContent app={app} />
  </div>
);

export default Window;
