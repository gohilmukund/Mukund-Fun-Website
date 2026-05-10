import React, { useState, useEffect } from 'react';
import { soundService } from '../../services/soundService';

interface BIOSScreenProps {
  onComplete: () => void;
}

const BIOSScreen: React.FC<BIOSScreenProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  const biosText = [
    "Award Modular BIOS v4.51PG, An Energy Star Ally",
    "Copyright (C) 1984-97, Award Software, Inc.",
    "",
    "TX Pentium system BIOS Ver. TX3-4 10/28/1997",
    "",
    "PENTIUM-MMX CPU at 166MHz",
    "Memory Test :   32768K OK",
    "",
    "Award Plug and Play BIOS Extension v1.0A",
    "Copyright (C) 1997, Award Software, Inc.",
    "   Detecting IDE Primary Master ... None",
    "   Detecting IDE Primary Slave  ... None",
    "   Detecting IDE Secondary Master... None",
    "   Detecting IDE Secondary Slave ... None",
    "",
    "Keyboard error or no keyboard present",
    "",
    "-",
    "",
    "",
    "",
    "Press F1 to continue, DEL to enter SETUP",
    "09/22/97-i430TX-ALi5135-2A59ISE9C-00"
  ];

  useEffect(() => {
    soundService.playBIOSBeep(); // Play beep on start
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < biosText.length) {
        setLines(prev => [...prev, biosText[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 2000); 
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#c0c0c0', // Slightly dimmed white/gray
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '18px',
      height: '100vh',
      width: '100vw',
      padding: '40px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      lineHeight: '1.2'
    }}>
      {/* Energy Star Logo */}
      <div style={{ position: 'absolute', top: '40px', right: '60px', textAlign: 'center' }}>
        <div style={{ color: '#fff', fontSize: '40px', borderTop: '2px solid #fff', borderLeft: '2px solid #fff', padding: '5px', lineHeight: '0.8' }}>
          <div style={{ textAlign: 'left', fontSize: '12px' }}>EPA</div>
          <div style={{ color: '#ffff00', fontStyle: 'italic', fontWeight: 'bold' }}>energy</div>
          <div style={{ fontSize: '40px', color: '#ffff00', marginTop: '-15px' }}>★</div>
        </div>
        <div style={{ backgroundColor: '#00ff00', color: '#000', fontSize: '10px', padding: '2px', fontWeight: 'bold' }}>
          EPA POLLUTION PREVENTER
        </div>
      </div>
      
      {lines.map((line, i) => (
        <div key={i} style={{ minHeight: '1.2em' }}>{line}</div>
      ))}
    </div>
  );
};

export default BIOSScreen;
