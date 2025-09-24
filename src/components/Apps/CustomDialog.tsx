import React, { useState, useEffect } from 'react';
import WindowTitlebar from '../Windows/WindowTitlebar';
import DraggableWindow from '../Windows/DraggableWindow';

interface DialogProps {
    isOpen: boolean;
    message: string;
    onSubmit: (value: string) => void;
}

const CustomDialog: React.FC<DialogProps> = ({ isOpen, message, onSubmit }) => {
    const [input, setInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setInput('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#c0c0c0',
            border: '2px solid #808080',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            padding: '16px',
            zIndex: 100000,
            fontFamily: '"Microsoft Sans Serif", sans-serif',
            minWidth: '300px'
        }}>
   
            <p style={{ margin: '8px 0', fontSize: '14px' }}>{message}</p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit(input);
                    }
                }}
                style={{
                    width: '100%',
                    padding: '4px',
                    marginBottom: '16px',
                    border: '2px inset #fff'
                }}
                autoFocus
            />
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={() => onSubmit(input)}
                    style={{
                        padding: '4px 16px',
                        border: '2px outset #fff',
                        backgroundColor: '#c0c0c0',
                        cursor: 'pointer'
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default CustomDialog;