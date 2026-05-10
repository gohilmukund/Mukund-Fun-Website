import React from 'react';

const CP_ITEMS = [
  { id: 'accessibility', title: 'Accessibility Options', icon: 'https://win98icons.alexmeub.com/icons/png/accessibility-4.png' },
  { id: 'add_remove', title: 'Add/Remove Programs', icon: 'https://win98icons.alexmeub.com/icons/png/appwizard-4.png' },
  { id: 'datetime', title: 'Date/Time', icon: 'https://win98icons.alexmeub.com/icons/png/date_date_time-4.png' },
  { id: 'display', title: 'Display', icon: 'https://win98icons.alexmeub.com/icons/png/display_properties-4.png' },
  { id: 'keyboard', title: 'Keyboard', icon: 'https://win98icons.alexmeub.com/icons/png/keyboard-4.png' },
  { id: 'mouse', title: 'Mouse', icon: 'https://win98icons.alexmeub.com/icons/png/mouse-4.png' },
  { id: 'multimedia', title: 'Multimedia', icon: 'https://win98icons.alexmeub.com/icons/png/multimedia-4.png' },
  { id: 'network', title: 'Network', icon: 'https://win98icons.alexmeub.com/icons/png/network-4.png' },
  { id: 'passwords', title: 'Passwords', icon: 'https://win98icons.alexmeub.com/icons/png/keys-4.png' },
  { id: 'printers', title: 'Printers', icon: 'https://win98icons.alexmeub.com/icons/png/printer-4.png' },
  { id: 'regional', title: 'Regional Settings', icon: 'https://win98icons.alexmeub.com/icons/png/international-4.png' },
  { id: 'sounds', title: 'Sounds', icon: 'https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-4.png' },
  { id: 'system', title: 'System', icon: 'https://win98icons.alexmeub.com/icons/png/system_properties-4.png' }
];

const ControlPanel: React.FC = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#D4D0C8' }}>
      {/* Menu Bar */}
      <div className="window-menu">
        <div className="window-menu-item"><span>F</span>ile</div>
        <div className="window-menu-item"><span>E</span>dit</div>
        <div className="window-menu-item"><span>V</span>iew</div>
        <div className="window-menu-item"><span>G</span>o</div>
        <div className="window-menu-item"><span>F</span>avorites</div>
        <div className="window-menu-item"><span>H</span>elp</div>
      </div>

      {/* Toolbar */}
      <div className="explorer-toolbar">
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">⬅</span>
          <span className="explorer-toolbar-text">Back</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">➡</span>
          <span className="explorer-toolbar-text">Forward</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">⬆</span>
          <span className="explorer-toolbar-text">Up</span>
        </div>
      </div>

      {/* Address Bar */}
      <div className="explorer-address-bar">
        <span className="explorer-address-label">Address</span>
        <div className="explorer-address-input" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://win98icons.alexmeub.com/icons/png/control_panel-4.png" style={{ width: '14px', height: '14px', marginRight: '5px' }} alt="cp" />
          Control Panel
        </div>
      </div>

      {/* Main Content Area */}
      <div className="explorer-main">
        {CP_ITEMS.map(item => (
          <div key={item.id} className="explorer-item">
            <img src={item.icon} alt={item.title} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="explorer-status-bar">
        <div style={{ flexGrow: 1 }}>{CP_ITEMS.length} object(s)</div>
      </div>
    </div>
  );
};

export default ControlPanel;
