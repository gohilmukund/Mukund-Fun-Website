import React, { useRef, useState } from 'react';
import '@google/genai';

const Chrome: React.FC = () => {
  const [url, setUrl] = useState('https://web.archive.org/web/19990428171538/http://google.com/');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function handleGo() {
    let fullUrl = input.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) fullUrl = 'https://' + fullUrl;
    setLoading(true);
    setHtml(null);
    try {
      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;
      // @ts-ignore
      const module = await import('@google/genai');
      // @ts-ignore
      const GoogleGenAI = module.GoogleGenAI;
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      // @ts-ignore
      const gemini = new GoogleGenAI({ apiKey });
      const websitePrompt = `Create a complete 90s-style website for the domain "${domain}". MUST include: 1 relevant image, garish 90s styling (neon, comic sans, tables), content specific to "${domain}", scrolling marquee, retro emoji/ascii, blinking text, visitor counter (9000+), "Under Construction" signs. Fun, humorous, 1996 feel. Image MUST match theme. No modern design.`;
      // @ts-ignore
      const result = await gemini.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: [{ role: 'user', parts: [{ text: websitePrompt }] }],
        config: { temperature: 0.9, responseModalities: ['TEXT', 'IMAGE'] },
      });
      let htmlContent = '';
      const images: string[] = [];
      const candidate = result.candidates && result.candidates[0];
      if (candidate && candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) htmlContent += part.text.replace(/```html|```/g, '').trim();
          else if (part.inlineData?.data) images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
        }
      }
      if (!htmlContent.includes('<html')) {
        htmlContent = `<!DOCTYPE html><html><head><title>${domain}</title><style>body{font-family:\"Comic Sans MS\";background:lime;color:blue;}marquee{background:yellow;color:red;}img{max-width:80%; display:block; margin:10px auto; border: 3px ridge gray;}</style></head><body><marquee>Welcome to ${domain}!</marquee><h1>${domain}</h1><div>${htmlContent}</div></body></html>`;
      }
      if (images.length > 0) {
        if (!htmlContent.includes('<img src="data:')) {
          htmlContent = htmlContent.replace(/(<\/h1>)/i, `$1\n<img src="${images[0]}" alt="Site Image">`);
        }
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
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: 0 }}>Chrome</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          className="browser-address-bar"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter a URL..."
          style={{ flex: 1, fontSize: 15, padding: 6 }}
        />
        <button className="browser-go-button" onClick={handleGo} style={{ fontSize: 15, padding: '6px 16px' }}>Go</button>
      </div>
      <div className="browser-loading" style={{ minHeight: 24, marginBottom: 8 }}>{loading && 'Connecting...'}</div>
      <div style={{ flex: 1, minHeight: 200, border: '2px inset #888', background: '#fff', position: 'relative' }}>
        {html ? (
          <iframe
            id="browser-frame"
            ref={iframeRef}
            srcDoc={html}
            title="AI Browser"
            style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
          />
        ) : (
          <iframe
            id="browser-frame"
            ref={iframeRef}
            src={url}
            title="AI Browser"
            style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
          />
        )}
      </div>
    </div>
  );
};

export default Chrome;
