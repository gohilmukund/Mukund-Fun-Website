
import React from 'react';
import { AppMeta } from '../../data/apps';
import DesktopIcon from './DesktopIcon';
import DraggableWindow from '../Windows/DraggableWindow';


interface DesktopProps {
    apps: AppMeta[];
    openWindows: string[];
    onIconDoubleClick: (appId: string) => void;
    onWindowClose: (appId: string) => void;
    onWindowMinimize: (appId: string) => void;
}


const desktopStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(assets/Wallpaper.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    position: 'relative',
    overflow: 'hidden',
};

const Desktop: React.FC<DesktopProps> = ({ apps, openWindows, onIconDoubleClick, onWindowClose, onWindowMinimize }) => (
    <div style={desktopStyle}>
        <div className="desktop-icons" style={{ position: 'relative', zIndex: 1 }}>
            {apps.map(app => (
                <DesktopIcon key={app.id} app={app} onDoubleClick={() => onIconDoubleClick(app.id)} />
            ))}
        </div>
        {openWindows.length > 0 && (
            <div className="windows" >
                {openWindows.map(appId => {
                    const app = apps.find(a => a.id === appId);
                    if (!app) return null;
                    return <DraggableWindow key={app.id} app={app} onClose={() => onWindowClose(app.id)} onMinimize={() => onWindowMinimize(app.id)} />;
                })}
            </div>
        )}
    </div>
);

export default Desktop;
