import React, { useRef, useState } from 'react';
import WindowTitlebar from './WindowTitlebar';
import WindowContent from './WindowContent';
import { AppMeta } from '../../data/apps';


interface DraggableWindowProps {
  app: AppMeta;
  onClose: () => void;
  onMinimize: () => void;
  isActive?: boolean;
  onFocus?: () => void;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ app, onClose, onMinimize, isActive, onFocus }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100 + (Math.random() * 50), y: 50 + (Math.random() * 50) });
  const [size, setSize] = useState({ width: 640, height: 400 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    onFocus?.();
    if (!isMaximized && windowRef.current) {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, offset]);

  const windowStyle: React.CSSProperties = isMaximized 
    ? { 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: 'calc(100vh - 30px)', 
        position: 'absolute',
        zIndex: isActive ? 100 : 10
      } 
    : { 
        left: position.x, 
        top: position.y, 
        width: size.width,
        height: size.height,
        position: 'absolute',
        zIndex: isActive ? 100 : 10
      };

  return (
    <div
      ref={windowRef}
      className={`window resizable active ${isActive ? 'focused' : ''}`}
      id={app.id}
      style={windowStyle}
      onClick={() => onFocus?.()}
    >
      <div onMouseDown={onMouseDown} style={{ cursor: isMaximized ? 'default' : 'grab' }}>
        <WindowTitlebar 
          iconUrl={app.icon} 
          title={app.title} 
          onClose={onClose} 
          onMinimize={onMinimize} 
          onMaximize={toggleMaximize}
          isMaximized={isMaximized}
          isActive={isActive} 
        />
      </div>
      <WindowContent app={app} />
    </div>
);
};

export default DraggableWindow;
