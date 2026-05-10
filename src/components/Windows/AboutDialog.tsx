import React from 'react';

interface AboutDialogProps {
  title: string;
  icon: string;
  description: string;
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ title, icon, description, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      backgroundColor: '#C0C0C0',
      border: '1px solid #fff',
      borderRight: '2px solid #000',
      borderBottom: '2px solid #000',
      boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
      zIndex: 2000,
      padding: '2px'
    }}>
      <div className="window-titlebar" style={{ height: '18px', marginBottom: '10px' }}>
        <div className="title">About {title}</div>
        <div className="controls">
          <button className="control-btn close" onClick={onClose}>×</button>
        </div>
      </div>
      
      <div style={{ padding: '10px', display: 'flex', gap: '15px' }}>
        <img src={icon} alt={title} style={{ width: '32px', height: '32px' }} />
        <div style={{ fontSize: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Microsoft® {title}</div>
          <div style={{ marginBottom: '10px' }}>Version 4.10.1998</div>
          <div style={{ marginBottom: '10px' }}>{description}</div>
          <div style={{ fontSize: '10px', color: '#444' }}>
            Copyright © 1981-1998 Microsoft Corp.<br />
            This product is licensed to: Mukund
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <button 
          onClick={onClose}
          style={{
            padding: '4px 20px',
            backgroundColor: '#C0C0C0',
            border: '1px solid #fff',
            borderRight: '2px solid #000',
            borderBottom: '2px solid #000',
            fontSize: '12px'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AboutDialog;
