import React, { useState } from 'react';

interface MyComputerProps {
  onOpenApp?: (appId: string) => void;
}

const MyComputer: React.FC<MyComputerProps> = ({ onOpenApp }) => {
  const [showCDrive, setShowCDrive] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div style={{ padding: 12 }}>
      <h2>My Gemtop</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <div id="c-drive-icon" style={{ display: showCDrive ? 'none' : 'inline-flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowCDrive(true)}>
          <img src="https://storage.googleapis.com/gemini-95-icons/mycomputer.png" alt="C: Drive" style={{ width: 48, height: 48 }} />
          <span>C:</span>
        </div>
        <div id="c-drive-content" style={{ display: showCDrive ? 'block' : 'none', border: '1px solid #888', padding: 8, minWidth: 220 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => onOpenApp && onOpenApp('pdfViewer')}
              title="Mukund's Resume.pdf"
            >
              <img src="/assets/acrobat.jpg" alt="Acrobat Reader" style={{ width: 32, height: 32 }} />
              <span>Mukund's Resume.pdf</span>
            </div>
            <div id="secret-image-icon" style={{ display: showSecret ? 'none' : 'inline-flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowSecret(true)}>
              <img src="https://win98icons.alexmeub.com/icons/png/display_properties-4.png" alt="Secret" style={{ width: 32, height: 32 }} />
              <span>dontshowthistoanyone.jpg</span>
            </div>
          </div>
          {showSecret && (
            <div style={{ marginTop: 8 }}>
              <img id="image-viewer-img" src="https://storage.googleapis.com/gemini-95-icons/%40ammaar%2B%40olacombe.png" alt="dontshowthistoanyone.jpg" style={{ width: 200, border: '2px solid #888' }} />
              <div id="image-viewer-title" style={{ fontSize: 13, marginTop: 4 }}>dontshowthistoanyone.jpg - Image Viewer</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComputer;
