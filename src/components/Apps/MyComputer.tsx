import React from 'react';

interface MyComputerProps {
  onOpenApp?: (appId: string) => void;
}

const ITEMS = [
  { id: 'floppy', title: '3½ Floppy (A:)', icon: 'https://win98icons.alexmeub.com/icons/png/floppy_35-0.png' },
  { id: 'cdrive', title: '(C:)', icon: 'https://win98icons.alexmeub.com/icons/png/hard_disk-4.png' },
  { id: 'dvd', title: '(D:)', icon: 'https://win98icons.alexmeub.com/icons/png/cd_drive-4.png' },
  { id: 'control_panel', title: 'Control Panel', icon: 'https://win98icons.alexmeub.com/icons/png/control_panel-4.png' },
  { id: 'printers', title: 'Printers', icon: 'https://win98icons.alexmeub.com/icons/png/printer-4.png' },
  { id: 'dialup', title: 'Dial-Up Networking', icon: 'https://win98icons.alexmeub.com/icons/png/network_connection_control_panel-4.png' },
  { id: 'pdfViewer', title: "Mukund's Resume.pdf", icon: 'assets/acrobat.jpg' }
];

const MyComputer: React.FC<MyComputerProps> = ({ onOpenApp }) => {
  const handleItemClick = (id: string) => {
    if (id === 'pdfViewer' || id === 'control_panel') {
      onOpenApp && onOpenApp(id);
    } else {
      alert(`Accessing ${id}... (Mock)`);
    }
  };

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
        <div className="explorer-toolbar-divider" style={{ width: '2px', backgroundColor: '#808080', margin: '2px 4px' }}></div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">✂</span>
          <span className="explorer-toolbar-text">Cut</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">📋</span>
          <span className="explorer-toolbar-text">Copy</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">📥</span>
          <span className="explorer-toolbar-text">Paste</span>
        </div>
      </div>

      {/* Address Bar */}
      <div className="explorer-address-bar">
        <span className="explorer-address-label">Address</span>
        <div className="explorer-address-input" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="assets/mycomputer.png" style={{ width: '14px', height: '14px', marginRight: '5px' }} alt="pc" />
          My Computer
        </div>
      </div>

      {/* Main Content Area */}
      <div className="explorer-main">
        {ITEMS.map(item => (
          <div key={item.id} className="explorer-item" onDoubleClick={() => handleItemClick(item.id)} onClick={() => {}}>
            <img src={item.icon} alt={item.title} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="explorer-status-bar">
        <div style={{ flexGrow: 1 }}>{ITEMS.length} object(s)</div>
        <div style={{ width: '150px', borderLeft: '1px solid #808080', paddingLeft: '5px', display: 'flex', alignItems: 'center' }}>
          My Computer
        </div>
      </div>
    </div>
  );
};

export default MyComputer;
