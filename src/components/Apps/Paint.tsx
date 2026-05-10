import React, { useEffect, useRef, useState } from 'react';
import AboutDialog from '../Windows/AboutDialog';
import '@google/genai';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080FF', '#004080', '#4000FF', '#804000',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF0080', '#FF8040'
];

const TOOLS = [
  { id: 'select_free', label: '✂', title: 'Free-Form Select' },
  { id: 'select', label: '⬚', title: 'Select' },
  { id: 'eraser', label: '⌨', title: 'Eraser' },
  { id: 'fill', label: '🪣', title: 'Fill With Color' },
  { id: 'pick', label: '🧪', title: 'Pick Color' },
  { id: 'zoom', label: '🔍', title: 'Magnifier' },
  { id: 'pencil', label: '✏', title: 'Pencil' },
  { id: 'brush', label: '🖌', title: 'Brush' },
  { id: 'airbrush', label: '🌫', title: 'Airbrush' },
  { id: 'text', label: 'A', title: 'Text' },
  { id: 'line', label: '╱', title: 'Line' },
  { id: 'curve', label: '⌇', title: 'Curve' },
  { id: 'rect', label: '▭', title: 'Rectangle' },
  { id: 'poly', label: 'polygon', title: 'Polygon' },
  { id: 'ellipse', label: '◯', title: 'Ellipse' },
  { id: 'roundrect', label: '▢', title: 'Rounded Rectangle' }
];

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [activeTool, setActiveTool] = useState('pencil');
  const [size, setSize] = useState(2);
  const [drawing, setDrawing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [critique, setCritique] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawing(true);
    setLastPos({ x, y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas || !lastPos) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = activeTool === 'eraser' ? 10 : size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPos({ x, y });
  };

  const handlePointerUp = () => {
    setDrawing(false);
    setLastPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const critiqueDrawing = async () => {
    setLoading(true);
    setCritique('Analyzing...');
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = imageDataUrl.split(',')[1];
      const module = await import('@google/genai');
      const GoogleGenAI = module.GoogleGenAI;
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      const gemini = new GoogleGenAI({ apiKey });
      const prompt = 'Critique this drawing with witty sarcasm (1-2 sentences).';
      const imagePart = { inlineData: { data: base64Data, mimeType: 'image/jpeg' } };
      const result = await gemini.models.generateContent({ model: 'gemini-2.0-flash', contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }] });
      const critiqueText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Is this art?';
      setCritique(critiqueText);
    } catch (err: any) {
      setCritique('Critique Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#C0C0C0', position: 'relative' }}>
      {showAbout && (
        <AboutDialog 
          title="Paint" 
          icon="assets/paint.png" 
          description="A versatile drawing program for the creative mind." 
          onClose={() => setShowAbout(false)} 
        />
      )}
      {/* Menu Bar */}
      <div className="window-menu">
        <div className="window-menu-item"><span>File</span></div>
        <div className="window-menu-item"><span>Edit</span></div>
        <div className="window-menu-item"><span>View</span></div>
        <div className="window-menu-item"><span>Image</span></div>
        <div className="window-menu-item"><span>Options</span></div>
        <div className="window-menu-item" onClick={critiqueDrawing}><span>Gemini</span></div>
        <div className="window-menu-item" onClick={() => setShowAbout(true)}><span>Help</span></div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar Toolbar */}
        <div className="paint-sidebar">
          {TOOLS.map(t => (
            <div 
              key={t.id} 
              className={`paint-tool-button ${activeTool === t.id ? 'active' : ''}`}
              onClick={() => setActiveTool(t.id)}
              title={t.title}
            >
              {t.label}
            </div>
          ))}
          {/* Brush Sizes */}
          <div style={{ gridColumn: 'span 2', padding: '4px', borderTop: '1px solid #808080', marginTop: '4px' }}>
            {[1, 2, 5, 10].map(s => (
              <div 
                key={s} 
                onClick={() => setSize(s)}
                style={{ 
                  height: s, 
                  width: '100%', 
                  backgroundColor: size === s ? '#000' : '#808080',
                  margin: '4px 0',
                  cursor: 'pointer'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ flexGrow: 1, padding: '4px', backgroundColor: '#808080', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #000', boxShadow: '2px 2px 0 #000', minWidth: '400px', minHeight: '300px' }}>
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ touchAction: 'none', display: 'block', cursor: 'crosshair' }}
            />
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="paint-palette">
        {/* Current Color Indicator */}
        <div style={{ width: '28px', height: '28px', border: '1px solid #808080', backgroundColor: '#fff', position: 'relative', flexShrink: 0, boxShadow: 'inset 1px 1px 0 #000' }}>
          <div style={{ position: 'absolute', top: 2, left: 2, width: 14, height: 14, backgroundColor: color, border: '1px solid #000', zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, backgroundColor: '#fff', border: '1px solid #000', zIndex: 1 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '1px' }}>
          {COLORS.map(c => (
            <div 
              key={c} 
              className="paint-color-swatch" 
              style={{ backgroundColor: c }} 
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-field" style={{ flexGrow: 1 }}>
          {loading ? 'Gemini is thinking...' : critique ? critique : 'For Help, click Help Topics on the Help Menu.'}
        </div>
        <div className="status-bar-field" style={{ width: '100px' }}>
          {lastPos ? `${Math.round(lastPos.x)},${Math.round(lastPos.y)}` : ''}
        </div>
      </div>
    </div>
  );
};

export default Paint;
