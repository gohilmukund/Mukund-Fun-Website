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
    // dragging is handled by document pointer handlers for better responsiveness
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    // We handle dragging via global pointer events attached to document so they work
    // when clippyjs injects DOM outside React tree. This also uses requestAnimationFrame
    // to avoid frequent React state updates for smooth dragging.

    

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

    // Use pointer events on document to start dragging when pointerdown happens on clippy DOM
    useEffect(() => {
        let raf: number | null = null;
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;
        const lastPos = { x: position.x, y: position.y };

        const onPointerDown = (e: PointerEvent) => {
            const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
            const clickedOnClippy = path.some((node: any) => {
                try {
                    if (!node || !node.classList) return false;
                    return node.classList.contains('clippy') || node.classList.contains('clippy-balloon') || node.classList.contains('clippy-container');
                } catch (err) {
                    return false;
                }
            });
            if (!clickedOnClippy) return;
            // right click should open context menu; let contextmenu handler manage it
            if ((e as any).button === 2) return;

            e.preventDefault();
            dragging = true;
            const startX = e.clientX;
            const startY = e.clientY;
            offsetX = startX - lastPos.x;
            offsetY = startY - lastPos.y;

            const onPointerMove = (ev: PointerEvent) => {
                if (!dragging) return;
                const nx = Math.max(0, Math.min(window.innerWidth - 100, ev.clientX - offsetX));
                const ny = Math.max(0, Math.min(window.innerHeight - 100, ev.clientY - offsetY));
                lastPos.x = nx;
                lastPos.y = ny;

                if (raf == null) {
                    raf = requestAnimationFrame(() => {
                        raf = null;
                        if (clippyRef.current && clippyRef.current.moveTo) {
                            clippyRef.current.moveTo(lastPos.x, lastPos.y);
                        }
                    });
                }
            };

            const onPointerUp = () => {
                dragging = false;
                if (raf) { cancelAnimationFrame(raf); raf = null; }
                setPosition({ x: lastPos.x, y: lastPos.y });
                window.removeEventListener('pointermove', onPointerMove, true);
                window.removeEventListener('pointerup', onPointerUp, true);
            };

            window.addEventListener('pointermove', onPointerMove, true);
            window.addEventListener('pointerup', onPointerUp, true);
        };

        document.addEventListener('pointerdown', onPointerDown, true);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true);
            if (raf) { cancelAnimationFrame(raf); }
        };
    }, [position.x, position.y]);

    // Intercept native contextmenu events on the document but only when target is clippy elements
    useEffect(() => {
            const onDocumentContext = (e: MouseEvent) => {
                // use composedPath to handle shadow DOM and nested nodes from clippyjs
                const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
                const matched = path.some((node: any) => {
                    try {
                        if (!node || !node.classList) return false;
                        return node.classList.contains('clippy') || node.classList.contains('clippy-balloon') || node.classList.contains('clippy-container');
                    } catch (err) {
                        return false;
                    }
                });
                if (matched) {
                    e.preventDefault();
                    // stop other listeners (including browser default) as early as possible
                    e.stopImmediatePropagation && (e.stopImmediatePropagation as any)();
                    e.stopPropagation && e.stopPropagation();
                    const me = e as MouseEvent;
                    setContextMenu({ x: me.clientX, y: me.clientY });
                }
            };

        const onDocumentMouseDown = (e: MouseEvent) => {
            const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
            const clickedOnClippy = path.some((node: any) => {
                try {
                    if (!node || !node.classList) return false;
                    return node.classList.contains('clippy') || node.classList.contains('clippy-container') || node.classList.contains('clippy-balloon');
                } catch (err) {
                    return false;
                }
            });
            const clickedOnMenu = path.some((node: any) => {
                try {
                    if (!node || !node.classList) return false;
                    return node.classList.contains('clippy-context-menu');
                } catch (err) {
                    return false;
                }
            });
            if (!clickedOnClippy && !clickedOnMenu) setContextMenu(null);
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
                    cursor: 'grab',
                    userSelect: 'none',
                    pointerEvents: 'all'
                }}
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