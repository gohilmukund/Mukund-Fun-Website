import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Mukund');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username);
  };

  return (
    <div style={{
      backgroundColor: '#008080', // Classic teal desktop color
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"MS Sans Serif", Arial, sans-serif'
    }}>
      <div style={{
        width: '400px',
        backgroundColor: '#c0c0c0',
        borderLeft: '2px solid #fff',
        borderTop: '2px solid #fff',
        borderRight: '2px solid #808080',
        borderBottom: '2px solid #808080',
        padding: '2px',
        boxShadow: '2px 2px 0 0 #000'
      }}>
        {/* Title Bar */}
        <div style={{
          backgroundColor: '#000080',
          color: '#fff',
          padding: '3px 5px',
          fontWeight: 'bold',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Enter Network Password</span>
          <div style={{
             width: '14px',
             height: '12px',
             backgroundColor: '#c0c0c0',
             borderLeft: '1px solid #fff',
             borderTop: '1px solid #fff',
             borderRight: '1px solid #808080',
             borderBottom: '1px solid #808080',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             color: '#000',
             fontSize: '9px',
             fontWeight: 'bold',
             cursor: 'default'
          }}>?</div>
        </div>

        {/* Content */}
        <div style={{ padding: '15px', display: 'flex', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <img src="/assets/loadinglogo.png" alt="Login" style={{ width: '48px', height: 'auto' }} />
             <div style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center' }}>Windows 95</div>
          </div>
          
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', marginBottom: '15px' }}>
              Enter your network password for Microsoft Networking.
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '80px', fontSize: '12px' }}>User name:</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '2px',
                    borderLeft: '2px solid #808080',
                    borderTop: '2px solid #808080',
                    borderRight: '2px solid #fff',
                    borderBottom: '2px solid #fff',
                    outline: 'none',
                    fontSize: '12px'
                  }} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '80px', fontSize: '12px' }}>Password:</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '2px',
                    borderLeft: '2px solid #808080',
                    borderTop: '2px solid #808080',
                    borderRight: '2px solid #fff',
                    borderBottom: '2px solid #fff',
                    outline: 'none',
                    fontSize: '12px'
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit"
                style={{
                  width: '75px',
                  padding: '4px',
                  backgroundColor: '#c0c0c0',
                  borderLeft: '1px solid #fff',
                  borderTop: '1px solid #fff',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                OK
              </button>
              <button 
                type="button"
                onClick={() => onLogin(username)}
                style={{
                  width: '75px',
                  padding: '4px',
                  backgroundColor: '#c0c0c0',
                  borderLeft: '1px solid #fff',
                  borderTop: '1px solid #fff',
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
