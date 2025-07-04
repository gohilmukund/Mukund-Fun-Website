

import React, { useRef } from 'react';

const PdfViewer: React.FC<{ file: string; title?: string }> = ({ file, title }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = title || 'document.pdf';
    link.click();
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, borderBottom: '1px solid #888', background: '#e0e0e0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/assets/acrobat.jpg" alt="Acrobat Reader" style={{ width: 20, height: 20, marginRight: 8, verticalAlign: 'middle' }} />
        <span style={{ flex: 1 }}>{title || 'PDF Viewer'}</span>
        <button onClick={handleDownload} style={{ marginRight: 4 }}>⬇ Download</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'auto' }}>
        <iframe
          ref={iframeRef}
          src={file}
          title={title || 'PDF'}
          style={{ flex: 1, width: '100%', height: '100%', border: 'none', minHeight: 400 }}
        />
        <div style={{ padding: 16 }}>
          <p>PDF preview is not supported in this browser. <a href={file} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
