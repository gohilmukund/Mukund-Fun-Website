import React, { useState, useRef } from 'react';
import AboutDialog from '../Windows/AboutDialog';
import '@google/genai';

const Notepad: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ ln: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateCursorPos = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = text.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorPos({
      ln: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Gemini API integration
  async function generateStory() {
    setLoading(true);
    setError(null);
    const currentText = text;
    const statusMsg = "\n\nGenerating story... Please wait...\n\n";
    setText(currentText + statusMsg);
    try {
      const module = await import('@google/genai');
      const GoogleGenAI = module.GoogleGenAI;
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      const gemini = new GoogleGenAI({ apiKey });
      const prompt = "Write me a short creative story (250-300 words) with an unexpected twist ending. Make it engaging and suitable for all ages.";
      const result = await gemini.models.generateContentStream({ model: 'gemini-2.5-flash', contents: prompt });
      let story = currentText + "\n\n";
      for await (const chunk of result) {
        story += chunk.text || '';
        setText(story);
        if (textareaRef.current) textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
      setText(story + "\n\n");
    } catch (err: any) {
      setError(err.message || 'Failed to generate story.');
      setText(currentText + "\n\nError: " + (err.message || 'Failed to generate story.') + "\n\n");
    } finally {
      setLoading(false);
      if (textareaRef.current) textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus: Record<string, string[]> = {
    'File': ['New', 'Open...', 'Save', 'Save As...', 'Page Setup...', 'Print...', 'Exit'],
    'Edit': ['Undo', 'Cut', 'Copy', 'Paste', 'Delete', 'Select All', 'Time/Date'],
    'Search': ['Find...', 'Find Next'],
    'Gemini': ['Generate Story', 'Summarize Text', 'Analyze Sentiment'],
    'Help': ['Help Topics', 'About Notepad']
  };

  const handleMenuClick = (menu: string) => {
    if (menu === 'Gemini') {
      // Just for this demo, clicking Gemini directly triggers the story for now
      // unless we want a real dropdown for it too.
      // But let's follow the user's request for "all menus".
    }
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = (item: string) => {
    if (item === 'Generate Story') generateStory();
    if (item === 'About Notepad') setShowAbout(true);
    if (item === 'Exit') { /* handle exit */ }
    setActiveMenu(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#C0C0C0', position: 'relative' }}>
      {showAbout && (
        <AboutDialog 
          title="Notepad" 
          icon="assets/notepad.png" 
          description="A simple text editor for the Windows 95 experience." 
          onClose={() => setShowAbout(false)} 
        />
      )}
      <div className="window-menu" onMouseLeave={() => setActiveMenu(null)}>
        {Object.keys(menus).map(menu => (
          <div key={menu} className="window-menu-item" onClick={() => handleMenuClick(menu)} style={{ position: 'relative' }}>
            <span>{menu}</span>
            {activeMenu === menu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#C0C0C0',
                border: '1px solid #000',
                boxShadow: '2px 2px 0 #000',
                zIndex: 1000,
                minWidth: '120px',
                padding: '2px'
              }}>
                {menus[menu].map(item => (
                  <div 
                    key={item} 
                    className="dropdown-item" 
                    onClick={() => handleMenuItemClick(item)}
                    style={{
                      padding: '2px 10px',
                      fontSize: '11px',
                      cursor: 'default',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ flexGrow: 1, padding: '1px', backgroundColor: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); updateCursorPos(); }}
          onKeyUp={updateCursorPos}
          onClick={updateCursorPos}
          className="notepad-textarea"
          style={{ 
            width: '100%', 
            height: '100%', 
            resize: 'none', 
            fontFamily: '"Courier New", Courier, monospace', 
            fontSize: '14px',
            border: 'none',
            outline: 'none',
            padding: '5px',
            boxSizing: 'border-box'
          }}
          placeholder="Type your notes here..."
          disabled={loading}
        />
      </div>

      <div className="status-bar">
        <div className="status-bar-field">
          {loading ? 'Generating story via Gemini...' : error ? `Error: ${error}` : ''}
        </div>
        <div className="status-bar-field">
          Ln {cursorPos.ln}, Col {cursorPos.col}
        </div>
      </div>
    </div>
  );
};

export default Notepad;
