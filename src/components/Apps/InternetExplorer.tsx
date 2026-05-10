import React, { useRef, useState } from 'react';
import AboutDialog from '../Windows/AboutDialog';
import '@google/genai';

const InternetExplorer: React.FC = () => {
  const [url, setUrl] = useState('https://web.archive.org/web/19990428171538/http://google.com/');
  const [input, setInput] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function handleGo() {
    let fullUrl = input.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) fullUrl = 'https://' + fullUrl;
    setLoading(true);
    setHtml(null);
    try {
      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;
      const module = await import('@google/genai');
      const GoogleGenAI = module.GoogleGenAI;
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      const gemini = new GoogleGenAI({ apiKey });
      const websitePrompt = `Create a complete 90s-style website for the domain "${domain}". MUST include: 1 relevant image, garish 90s styling (neon, comic sans, tables), content specific to "${domain}", scrolling marquee, retro emoji/ascii, blinking text, visitor counter (9000+), "Under Construction" signs. Fun, humorous, 1996 feel. Image MUST match theme. No modern design.`;
      const result = await gemini.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: websitePrompt }] }],
      });
      let htmlContent = '';
      const candidate = result.candidates && result.candidates[0];
      if (candidate && candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) htmlContent += part.text.replace(/```html|```/g, '').trim();
        }
      }
      if (!htmlContent.includes('<html')) {
        htmlContent = `<!DOCTYPE html><html><head><title>${domain}</title><style>body{font-family:"Comic Sans MS";background:lime;color:blue;}marquee{background:yellow;color:red;}</style></head><body><marquee>Welcome to ${domain}!</marquee><h1>${domain}</h1><div>${htmlContent}</div></body></html>`;
      }
      setHtml(htmlContent);
      setUrl(fullUrl);
    } catch (e: any) {
      setHtml(`<html><body>Error generating site: ${e.message}</body></html>`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#D4D0C8', position: 'relative' }}>
      {showAbout && (
        <AboutDialog 
          title="Internet Explorer" 
          icon="assets/intexp.png" 
          description="Microsoft Internet Explorer 4.0. The best way to experience the web in 1998." 
          onClose={() => setShowAbout(false)} 
        />
      )}
      
      {/* Menu Bar */}
      <div className="window-menu">
        <div className="window-menu-item"><span>F</span>ile</div>
        <div className="window-menu-item"><span>E</span>dit</div>
        <div className="window-menu-item"><span>V</span>iew</div>
        <div className="window-menu-item"><span>G</span>o</div>
        <div className="window-menu-item"><span>F</span>avorites</div>
        <div className="window-menu-item" onClick={() => setShowAbout(true)}><span>H</span>elp</div>
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
          <span className="explorer-toolbar-icon">✖</span>
          <span className="explorer-toolbar-text">Stop</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">🔄</span>
          <span className="explorer-toolbar-text">Refresh</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">🏠</span>
          <span className="explorer-toolbar-text">Home</span>
        </div>
        <div className="explorer-toolbar-divider" style={{ width: '2px', backgroundColor: '#808080', margin: '2px 4px' }}></div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">🔍</span>
          <span className="explorer-toolbar-text">Search</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">⭐</span>
          <span className="explorer-toolbar-text">Favorites</span>
        </div>
        <div className="explorer-toolbar-btn">
          <span className="explorer-toolbar-icon">📜</span>
          <span className="explorer-toolbar-text">History</span>
        </div>
      </div>

      {/* Address Bar */}
      <div className="explorer-address-bar">
        <span className="explorer-address-label">Address</span>
        <input
          className="explorer-address-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
        />
        <div className="wmp-btn" style={{ width: '40px', height: '20px', fontSize: '11px' }} onClick={handleGo}>Go</div>
        <div className="ie-throbber" style={{ marginLeft: '10px' }}>
          <img src="assets/intexp.png" style={{ width: '20px', height: '20px' }} className={loading ? 'loading' : ''} alt="logo" />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, backgroundColor: '#fff', border: '2px inset #808080', margin: '2px', position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <span>Finding site...</span>
          </div>
        )}
        {html ? (
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="AI Browser"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            title="AI Browser"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="explorer-status-bar">
        <div style={{ flexGrow: 1 }}>{loading ? 'Opening page...' : 'Done'}</div>
        <div style={{ width: '150px', borderLeft: '1px solid #808080', paddingLeft: '5px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '5px' }}>🌍</span> Internet zone
        </div>
      </div>
    </div>
  );
};

export default InternetExplorer;
