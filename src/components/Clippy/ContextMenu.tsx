import React from 'react';
import { Agents } from './clippy.d';

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
    const [activeSubmenu, setActiveSubmenu] = React.useState<number | null>(null);

    const handleItemClick = (item: MenuItem) => {
        if (item.action) {
            item.action();
        }
        onClose();
    };

    return (
        <div style={{ ...menuStyle, left: x, top: y }} onMouseLeave={onClose}>
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