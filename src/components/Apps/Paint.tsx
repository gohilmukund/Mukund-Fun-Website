import React, { useEffect, useRef, useState } from 'react';
import '@google/genai';

const COLORS = [
  { name: 'Black', value: 'black' },
  { name: 'Red', value: 'red' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'White (Eraser)', value: 'white' },
];
const SIZES = [2, 5, 10];

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('black');
  const [size, setSize] = useState(2);
  const [drawing, setDrawing] = useState(false);
  const [critique, setCritique] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Resize canvas to fit parent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight - 40;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Drawing logic
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
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
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

  // AI Critique
  const critiqueDrawing = async () => {
    setLoading(true);
    setCritique('Analyzing...');
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = imageDataUrl.split(',')[1];
      // @ts-ignore
      const module = await import('@google/genai');
      // @ts-ignore
      const GoogleGenAI = module.GoogleGenAI;
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      // @ts-ignore
      const gemini = new GoogleGenAI({ apiKey });
      const prompt = 'Critique this drawing with witty sarcasm (1-2 sentences).';
      const imagePart = { inlineData: { data: base64Data, mimeType: 'image/jpeg' } };
      // @ts-ignore
      const result = await gemini.models.generateContent({ model: 'gemini-2.5-pro-exp-03-25', contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }] });
      const critiqueText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Is this art?';
      setCritique(critiqueText);
    } catch (err: any) {
      setCritique('Critique Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="paint-toolbar" style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
        {COLORS.map(c => (
          <button
            key={c.value}
            className={`paint-color-swatch${color === c.value ? ' active' : ''}`}
            style={{ background: c.value, color: c.value === 'white' ? '#333' : '#fff', border: color === c.value ? '2px solid #000' : '1px solid #888', width: 28, height: 28 }}
            onClick={() => setColor(c.value)}
            data-color={c.value}
          >
            {c.name}
          </button>
        ))}
        {SIZES.map(s => (
          <button
            key={s}
            className={`paint-size-button${size === s ? ' active' : ''}`}
            style={{ border: size === s ? '2px solid #000' : '1px solid #888', width: 28, height: 28 }}
            onClick={() => setSize(s)}
            data-size={s}
          >
            {s}px
          </button>
        ))}
        <button className="paint-clear-button" onClick={clearCanvas} style={{ marginLeft: 8 }}>Clear</button>
        <button onClick={critiqueDrawing} disabled={loading} style={{ marginLeft: 8 }}>Critique</button>
      </div>
      <div style={{ flex: 1, minHeight: 200, border: '2px inset #888', background: '#fff', position: 'relative' }}>
        <canvas
          id="paint-canvas"
          ref={canvasRef}
          style={{ width: '100%', height: '100%', touchAction: 'none', display: 'block' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <div id="paint-assistant" style={{ marginTop: 8, minHeight: 24 }}>
        <span className="assistant-bubble">{critique}</span>
      </div>
    </div>
  );
};

export default Paint;
