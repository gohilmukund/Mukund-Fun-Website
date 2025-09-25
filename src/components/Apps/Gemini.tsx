import React, { useRef, useState, useEffect } from 'react';
import { initGemini, getGeminiResponse } from '../../services/gemini';

interface GeminiProps {
  initialQuestion?: string;
  initialResponse?: string;
}

const Gemini: React.FC<GeminiProps> = ({ initialQuestion, initialResponse }) => {
  type Message = { sender: 'user' | 'gemini' | 'system'; text: string };
  const [messages, setMessages] = useState<Message[]>(() => {
    const initialMessages: Message[] = [{ sender: 'system', text: 'Initializing AI...' }];
    if (initialQuestion && initialResponse) {
      initialMessages.push(
        { sender: 'user', text: initialQuestion },
        { sender: 'gemini', text: initialResponse }
      );
    }
    return initialMessages;
  });

  useEffect(() => {
    initGemini().then(success => {
      if (success) {
        setMessages(msgs => [...msgs, { sender: 'system', text: 'AI ready! Ask me anything about Mukund\'s experience or background.' }]);
      } else {
        setMessages(msgs => [...msgs, { sender: 'system', text: 'Failed to initialize AI. Please try refreshing the page.' }]);
      }
    });
  }, []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setInput('');
    try {
      let fullResponse = '';
      for await (const chunk of getGeminiResponse(input)) {
        fullResponse += chunk || '';
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
