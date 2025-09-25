
import React, { useState, useEffect } from 'react';
import { AppMeta } from '../../data/apps';
import DesktopIcon from './DesktopIcon';
import DraggableWindow from '../Windows/DraggableWindow';
import DraggableClippy from '../Clippy/DraggableClippy';
import type { Clippy as ClippyType } from '../Clippy/clippy.d';
import '@google/genai';
import '../Clippy/clippy.css';

interface DesktopProps {
    apps: AppMeta[];
    openWindows: string[];
    onIconDoubleClick: (appId: string) => void;
    onWindowClose: (appId: string) => void;
    onWindowMinimize: (appId: string) => void;
}


const desktopStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(assets/Wallpaper.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    position: 'relative',
    overflow: 'hidden',
};

const Desktop: React.FC<DesktopProps> = ({ apps, openWindows, onIconDoubleClick, onWindowClose, onWindowMinimize }) => {
    const [_, setUserName] = useState<string>('');
    const [chatState, setChatState] = useState<'greeting' | 'asking-name' | 'chatting'>('greeting');
    const [geminiChat, setGeminiChat] = useState<any>(null);
    const [activeClippy, setActiveClippy] = useState<ClippyType | null>(null);

    const initGemini = async () => {
        try {
            const module = await import('@google/genai');
            const GoogleGenAI = module.GoogleGenAI;
            const apiKey = process.env.GEMINI_API_KEY || '';
            if (!apiKey) throw new Error('Gemini API key missing.');
            const gemini = new GoogleGenAI({ apiKey });
            const chat = gemini.chats.create({ model: 'gemini-2.5-flash', history: [] });
            setGeminiChat(chat);
        } catch (error) {
            console.error('Failed to initialize Gemini:', error);
        }
    };

    const handleUserResponse = async (clippy: ClippyType, response: string) => {
        if (chatState === 'asking-name') {
            setUserName(response);
            setChatState('chatting');
            clippy.play('Greeting');
            clippy.speak(`Nice to meet you, ${response}! How can I help you today?`);
        } else if (chatState === 'chatting' && geminiChat) {
            clippy.play('Processing');
            try {
                const result = await geminiChat.sendMessageStream({ message: response });
                let fullResponse = '';
                for await (const chunk of result.stream) {
                    fullResponse += chunk.text();
                }
                clippy.play('Explain');
                clippy.speak(fullResponse);
            } catch (error) {
                console.error('Gemini chat error:', error);
                clippy.play('GetAttention');
                clippy.speak("I'm sorry, I encountered an error. Could you try asking something else?");
            }
        }
    };

    const handleClippyLoad = (clippy: ClippyType) => {
        initGemini();
        clippy.play('Greeting');
        clippy.speak('Hi there! I\'m Clippy. What\'s your name?');
        setChatState('asking-name');
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && activeClippy) {
                activeClippy.ask(
                    chatState === 'asking-name' ? 'What\'s your name?' : 'How can I help you?',
                    (response) => handleUserResponse(activeClippy, response)
                );
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [chatState, activeClippy]);


    return (
        <div style={desktopStyle}>
            <DraggableClippy 
                onLoad={(clippy) => {
                    setActiveClippy(clippy);
                    handleClippyLoad(clippy);
                }} 
            />
            <div className="desktop-icons" style={{ position: 'relative', zIndex: 1, gridGap: 16, padding: 16, display: 'grid', gridTemplateColumns: '80px 80px', justifyContent: 'start', alignContent: 'start' }}>
                {apps.map(app => (
                    <DesktopIcon key={app.id} app={app} onDoubleClick={() => onIconDoubleClick(app.id)} />
                ))}
            </div>
            {openWindows.length > 0 && (
                <div className="windows">
                    {openWindows.map(appId => {
                        const app = apps.find(a => a.id === appId);
                        if (!app) return null;
                        return <DraggableWindow key={app.id} app={app} onClose={() => onWindowClose(app.id)} onMinimize={() => onWindowMinimize(app.id)} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default Desktop;
