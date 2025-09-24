import React, { useRef, useState, useEffect } from 'react';
import { Clippy } from './clippy';
import type { Clippy as ClippyType } from './clippy.d';
import type { Animation } from './clippy.d';
import ContextMenu from './ContextMenu';
import { load } from './service';

const AVAILABLE_AGENTS = [
    "Clippy",
    "F1",
    "Genie",
    "Genius",
    "Links",
    "Merlin",
    "Peedy",
    "Rocky",
    "Rover"
] as const;

interface DraggableClippyProps {
    onLoad?: (clippy: ClippyType) => void;
}

const DraggableClippy: React.FC<DraggableClippyProps> = ({ onLoad }) => {
    const clippyRef = useRef<ClippyType | null>(null);
    const [position, setPosition] = useState({ x: window.innerWidth - 150, y: window.innerHeight - 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 2) { // Right click
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY });
            return;
        }
        
        e.preventDefault();
        if (clippyRef.current) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    

    const getAvailableAnimations = (): Animation[] => {
        if (clippyRef.current && clippyRef.current.animations) {
            return clippyRef.current.animations() as Animation[];
        }
        return [];
    };

    const playRandomAnimation = () => {
        if (clippyRef.current) {
            const animations = getAvailableAnimations();
            if (animations.length > 0) {
                const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                clippyRef.current.play(randomAnim);
            }
        }
    };

    const changeAgent = async (agentName: string) => {
        try {
            // unload existing agent to remove its DOM
            // (service.unload will be called via Clippy component cleanup if needed)
            const old = clippyRef.current as any;
            if (old && typeof old.hide === 'function') old.hide();
            const newAgent = await load(agentName);
            clippyRef.current = newAgent;
            if (clippyRef.current && clippyRef.current.moveTo) {
                clippyRef.current.moveTo(position.x, position.y);
            }
            if (clippyRef.current && clippyRef.current.show) clippyRef.current.show();
            if (clippyRef.current && clippyRef.current.play) clippyRef.current.play('Greeting');
            if (onLoad && clippyRef.current) onLoad(clippyRef.current);
        } catch (err) {
            console.error('changeAgent error', err);
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

    // Intercept native contextmenu events on the document but only when target is clippy elements
    useEffect(() => {
        const onDocumentContext = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            if (target.closest && (
                target.closest('.clippy') || target.closest('.clippy-container') || target.closest('.clippy-balloon')
            )) {
                e.preventDefault();
                e.stopPropagation();
                const me = e as MouseEvent;
                setContextMenu({ x: me.clientX, y: me.clientY });
            }
        };

        const onDocumentMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            // if user clicks outside clippy, close menu
            if (!target.closest || !target.closest('.clippy-container')) {
                setContextMenu(null);
            }
        };

        // use capture so we can intercept before browser shows menu
        document.addEventListener('contextmenu', onDocumentContext, true);
        document.addEventListener('mousedown', onDocumentMouseDown, true);

        return () => {
            document.removeEventListener('contextmenu', onDocumentContext, true);
            document.removeEventListener('mousedown', onDocumentMouseDown, true);
        };
    }, []);

    const menuItems = [
        {
            label: 'Change Agent',
            submenu: AVAILABLE_AGENTS.map(agent => ({
                label: agent,
                action: () => changeAgent(agent)
            }))
        },
        {
            label: 'Next Animation',
            action: playRandomAnimation
        }
    ];

    return (
        <>
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
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({ x: e.clientX, y: e.clientY });
                }}
            >
                <div className="clippy-container">
                    {/* Render a single Clippy instance managed by the Clippy component; do not change its "name" prop dynamically to avoid double-loading DOM nodes. */}
                    <Clippy ref={clippyRef} onLoad={handleLoad} />
                </div>
            </div>
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    menuItems={menuItems}
                />
            )}
        </>
    );
};

export default DraggableClippy;