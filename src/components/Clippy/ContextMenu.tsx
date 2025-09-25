import React, { useState, useRef, useLayoutEffect } from 'react';

interface MenuItem {
    label: string;
    action?: () => void;
    submenu?: MenuItem[];
}

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    menuItems: MenuItem[];
}

const menuStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: '#c0c0c0',
    border: '2px outset #fff',
    zIndex: 1000000,
    fontFamily: '"Microsoft Sans Serif", sans-serif',
    fontSize: '14px',
    minWidth: '150px',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
};

const itemStyle: React.CSSProperties = {
    padding: '4px 16px',
    cursor: 'pointer',
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, menuItems }) => {
    const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

    const handleItemClick = (item: MenuItem) => {
        if (item.action) {
            item.action();
        }
        onClose();
    };

    // Measure and clamp/flip so the menu stays inside the viewport
    useLayoutEffect(() => {
        const el = menuRef.current;
        // start with requested coordinates
        let left = x;
        let top = y;
        if (el) {
            const rect = el.getBoundingClientRect();
            const margin = 8; // small gap from edges
            // horizontal
            if (left + rect.width + margin > window.innerWidth) {
                left = Math.max(margin, window.innerWidth - rect.width - margin);
            }
            // vertical
            if (top + rect.height + margin > window.innerHeight) {
                top = Math.max(margin, window.innerHeight - rect.height - margin);
            }
        }
        setPos({ left, top });
    }, [x, y, menuItems]);

    return (
        <div
            ref={menuRef}
            className="clippy-context-menu"
            style={{ ...menuStyle, left: pos ? pos.left : -9999, top: pos ? pos.top : -9999, visibility: pos ? 'visible' : 'hidden' }}
            onMouseLeave={onClose}
        >
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    style={itemStyle}
                    onMouseEnter={() => item.submenu && setActiveSubmenu(index)}
                    onClick={() => handleItemClick(item)}
                >
                    {item.label}
                    {item.submenu && activeSubmenu === index && (
                        <div style={{ ...menuStyle, position: 'absolute', left: '100%', top: 0 }}>
                            {item.submenu.map((subItem, subIndex) => (
                                <div
                                    key={subIndex}
                                    style={itemStyle}
                                    onClick={() => handleItemClick(subItem)}
                                >
                                    {subItem.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ContextMenu;