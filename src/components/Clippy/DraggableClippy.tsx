import React, { useRef, useState, useEffect } from 'react';
import { Clippy } from './clippy';
import type { Clippy as ClippyType } from './clippy.d';

interface DraggableClippyProps {
    onLoad?: (clippy: ClippyType) => void;
}

const DraggableClippy: React.FC<DraggableClippyProps> = ({ onLoad }) => {
    const clippyRef = useRef<ClippyType | null>(null);
    const [position, setPosition] = useState({ x: window.innerWidth - 150, y: window.innerHeight - 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (clippyRef.current) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleLoad = () => {
        if (clippyRef.current && clippyRef.current.moveTo) {
            clippyRef.current.moveTo(position.x, position.y);
            if (onLoad) onLoad(clippyRef.current);
        }
    };

    // Add mousemove event to window for smoother dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging && clippyRef.current) {
                const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
                const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
                
                setPosition({ x: newX, y: newY });
                if (clippyRef.current.moveTo) {
                    clippyRef.current.moveTo(newX, newY);
                }
            }
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragOffset]);

    return (
        <div
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 999999,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                pointerEvents: 'all'
            }}
            onMouseDown={handleMouseDown}
        >
            <Clippy ref={clippyRef} onLoad={handleLoad} name="Clippy" />
        </div>
    );
};

export default DraggableClippy;