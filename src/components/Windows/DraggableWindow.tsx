import React, { useRef, useState } from 'react';
import WindowTitlebar from './WindowTitlebar';
import WindowContent from './WindowContent';
import { AppMeta } from '../../data/apps';


interface DraggableWindowProps {
  app: AppMeta;
  onClose: () => void;
  onMinimize: () => void;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ app, onClose, onMinimize }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
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

  return (
    <div
      ref={windowRef}
      className="window resizable active"
      id={app.id}
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div onMouseDown={onMouseDown} style={{ cursor: 'grab' }}>
        <WindowTitlebar iconUrl={app.icon} title={app.title} onClose={onClose} onMinimize={onMinimize} />
      </div>
      <WindowContent app={app} />
    </div>
  );
};

export default DraggableWindow;
