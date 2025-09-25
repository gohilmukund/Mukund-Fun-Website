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
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: window.innerWidth - 150, y: window.innerHeight - 150 });
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const positionRef = useRef(position); // For sync access in RAF
    
    // Update ref when state changes
    useEffect(() => {
        positionRef.current = position;
    }, [position]);

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

    // Use pointer events and capture for reliable, smooth dragging
    useEffect(() => {
        let raf: number | null = null;
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;
        const lastPos = { x: position.x, y: position.y };
        let target: Element | null = null;

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
            target = e.target as Element;
            
            // right click opens context menu
            if (e.button === 2) return;

            e.preventDefault();
            e.stopPropagation();

            // use pointer capture so we get all pointer events even if cursor leaves the element
            target.setPointerCapture(e.pointerId);

            dragging = true;
            const startX = e.clientX;
            const startY = e.clientY;
            offsetX = startX - lastPos.x;
            offsetY = startY - lastPos.y;
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!dragging) return;
            
            const nx = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - offsetX));
            const ny = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - offsetY));
            
            if (nx !== lastPos.x || ny !== lastPos.y) {
                lastPos.x = nx;
                lastPos.y = ny;
                
                // Update React state immediately for smooth transform
                setPosition({ x: nx, y: ny });
                
                // Use RAF only for the clippyjs update which is less critical
                if (raf == null) {
                    raf = requestAnimationFrame(() => {
                        raf = null;
                        if (clippyRef.current?.moveTo) {
                            clippyRef.current.moveTo(lastPos.x, lastPos.y);
                        }
                    });
                }
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!dragging) return;
            
            if (target) {
                target.releasePointerCapture(e.pointerId);
            }
            
            target = null;
            dragging = false;
            
            if (raf) {
                cancelAnimationFrame(raf);
                raf = null;
            }
        };

        // use capture phase and attach to document for reliability
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('pointermove', onPointerMove, true);
        document.addEventListener('pointerup', onPointerUp, true);
        document.addEventListener('pointercancel', onPointerUp, true);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true);
            document.removeEventListener('pointermove', onPointerMove, true);
            document.removeEventListener('pointerup', onPointerUp, true);
            document.removeEventListener('pointercancel', onPointerUp, true);
            if (raf) {
                cancelAnimationFrame(raf);
            }
        };
    }, []); // no dependencies needed - we use lastPos instead of position state

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
                ref={containerRef}
                style={{
                    position: 'fixed',
                    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    zIndex: 999999,
                    cursor: 'grab',
                    userSelect: 'none',
                    pointerEvents: 'all',
                    willChange: 'transform',
                    transition: 'none',
                    touchAction: 'none'
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({ x: e.clientX, y: e.clientY });
                }}
            >
                <div className="clippy-container">
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