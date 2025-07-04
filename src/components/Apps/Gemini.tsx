import React, { useRef, useState } from 'react';
import '@google/genai';

const Gemini: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'gemini' | 'system'; text: string }[]>([
    { sender: 'system', text: 'Initializing AI...' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setInput('');
    try {
      // @ts-ignore
      const module = await import('@google/genai');
      // @ts-ignore
      const GoogleGenAI = module.GoogleGenAI;
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Gemini API key missing.');
      // @ts-ignore
      const gemini = new GoogleGenAI({ apiKey });
      // @ts-ignore
      const chat = gemini.chats.create({ model: 'gemini-2.5-flash', history: [] });
      // @ts-ignore
      const result = await chat.sendMessageStream({ message: input });
      let fullResponse = '';
      for await (const chunk of result) {
        fullResponse += chunk.text || '';
        setMessages(msgs => {
          const last = msgs[msgs.length - 1];
          if (last && last.sender === 'gemini') {
            return [...msgs.slice(0, -1), { sender: 'gemini', text: fullResponse }];
          } else {
            return [...msgs, { sender: 'gemini', text: fullResponse }];
          }
        });
      }
    } catch (err: any) {
      setMessages(msgs => [...msgs, { sender: 'system', text: 'Error: ' + (err.message || 'Failed to get response.') }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="gemini-chat-history" style={{ flex: 1, overflowY: 'auto', background: '#f0f0f0', padding: 8, marginBottom: 8, border: '1px solid #ccc' }}>
        {messages.map((msg, i) => (
          <p key={i} className={msg.sender + '-message'} style={{ margin: 0, color: msg.sender === 'user' ? '#333' : msg.sender === 'gemini' ? '#0077cc' : '#888' }}>{msg.sender === 'user' ? 'You: ' : msg.sender === 'gemini' ? 'Gemini: ' : ''}{msg.text}</p>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          className="gemini-chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          style={{ flex: 1, fontSize: 15, padding: 6 }}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button className="gemini-chat-send" onClick={sendMessage} disabled={loading || !input.trim()} style={{ fontSize: 15, padding: '6px 16px' }}>Send</button>
      </div>
    </div>
  );
};

export default Gemini;
