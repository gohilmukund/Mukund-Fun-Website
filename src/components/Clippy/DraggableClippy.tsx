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
    openWindow?: (appId: string, props?: any) => void;
}

const DraggableClippy: React.FC<DraggableClippyProps> = ({ onLoad, openWindow }) => {
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

    // Direct DOM manipulation for ultra-responsive dragging
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isDragging = false;
        let initialX = 0;
        let initialY = 0;
        let currentX = position.x;
        let currentY = position.y;
        let rafId: number | null = null;

        function directMove(x: number, y: number) {
            container.style.transform = `translate3d(${x}px,${y}px,0)`;
        }

        function onPointerDown(e: PointerEvent) {
            console.log('Clippy pointer down', e);
            if (e.button !== 0 || !e.isPrimary) return; // left click only
            if (!(e.target as HTMLElement).closest('.clippy-container')) return;

            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            initialX = e.clientX - position.x;
            initialY = e.clientY - position.y;
            currentX = position.x;
            currentY = position.y;

            container.style.cursor = 'grabbing';
            container.style.transition = 'none';
            container.setPointerCapture(e.pointerId);
        }

        function onPointerMove(e: PointerEvent) {
            if (!isDragging || !e.isPrimary) return;

            const x = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - initialX));
            const y = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - initialY));

            // Immediate visual feedback
            directMove(x, y);

            // Throttle React state & clippy updates
            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    rafId = null;
                    currentX = x;
                    currentY = y;
                    if (clippyRef.current?.moveTo) {
                        clippyRef.current.moveTo(x, y);
                    }
                    setPosition({ x, y });
                });
            }
        }

        function onPointerUp(e: PointerEvent) {
            if (!isDragging || !e.isPrimary) return;

            isDragging = false;
            container.style.cursor = 'grab';
            container.releasePointerCapture(e.pointerId);

            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            // Final position update
            setPosition({ x: currentX, y: currentY });
        }

        // Attach events directly to container for better performance
        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerup', onPointerUp);
        container.addEventListener('pointercancel', onPointerUp);

        return () => {
            container.removeEventListener('pointerdown', onPointerDown);
            container.removeEventListener('pointermove', onPointerMove);
            container.removeEventListener('pointerup', onPointerUp);
            container.removeEventListener('pointercancel', onPointerUp);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [position]);

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
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 999999,
                    pointerEvents: 'none', // let clippyjs handle pointer events
                    // border: '2px solid red', // DEBUG: can remove if not needed
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextMenu({ x: e.clientX, y: e.clientY });
                }}
            >
                <div className="clippy-container">
                    <Clippy 
                        ref={clippyRef} 
                        onLoad={handleLoad} 
                        openGeminiWindow={(question, response) => {
                            if (openWindow) {
                                openWindow('Gemini', { initialQuestion: question, initialResponse: response });
                            }
                        }}
                    />
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