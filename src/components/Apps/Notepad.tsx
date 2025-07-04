import React, { useState, useRef } from 'react';
import '@google/genai';

const Notepad: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Gemini API integration
  async function generateStory() {
    setLoading(true);
    setError(null);
    const currentText = text;
    setText(currentText + "\n\nGenerating story... Please wait...\n\n");
    try {
      // Dynamically import Gemini API
      // @ts-ignore
      const module = await import('@google/genai');
      // @ts-ignore
      const GoogleGenAI = module.GoogleGenAI;
      // You must provide your Gemini API key here or via env
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      // @ts-ignore
      const gemini = new GoogleGenAI({ apiKey });
      const prompt = "Write me a short creative story (250-300 words) with an unexpected twist ending. Make it engaging and suitable for all ages.";
      // @ts-ignore
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

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        className="notepad-textarea"
        style={{ width: '100%', height: '80%', resize: 'none', fontFamily: 'monospace', fontSize: 14, marginBottom: 8 }}
        placeholder="Type your notes here..."
        disabled={loading}
      />
      <button
        className="notepad-story-button"
        onClick={generateStory}
        disabled={loading}
        style={{ width: '100%', padding: 8, fontSize: 15 }}
      >
        {loading ? 'Working...' : 'Generate Story'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default Notepad;
