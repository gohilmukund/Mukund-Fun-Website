import React, { useRef, useState } from 'react';
import AboutDialog from '../Windows/AboutDialog';

const VLOG_VIDEOS = [
  { id: 'VKDFxJFqz2s', title: 'Bali Travel Vlog 2024' },
  { id: 'q_fT7V1_yD8', title: 'Exploring Local Markets' },
  { id: '7v_D_uE_xNo', title: 'Our New Home Tour' },
  { id: '5S-P6A_FmEw', title: 'Weekend Getaway Vlog' },
  { id: 'L_jWHffIx5E', title: 'Traditional Food Review' }
];

const MediaPlayer: React.FC = () => {
  const [videoId, setVideoId] = useState(VLOG_VIDEOS[0].id);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus: Record<string, string[]> = {
    'File': ['Open...', 'Open URL...', 'Close', 'Exit'],
    'View': ['Full Screen', 'Playlist', 'Statistics'],
    'Play': ['Play/Pause', 'Stop', 'Volume Up', 'Volume Down'],
    'Navigate': ['Previous', 'Next', 'Rewind', 'Fast Forward'],
    'Favorites': ['Add to Favorites...', 'Organize Favorites...'],
    'Help': ['Help Topics', 'About Windows Media Player']
  };

  const handleMenuItemClick = (menu: string, item: string) => {
    if (item === 'Playlist') setShowPlaylist(!showPlaylist);
    if (item === 'Play/Pause') setIsPlaying(!isPlaying);
    if (item === 'Stop') setIsPlaying(false);
    if (item === 'About Windows Media Player') setShowAbout(true);
    setActiveMenu(null);
  };

  const handleVideoSelect = (id: string) => {
    setVideoId(id);
    setIsPlaying(true);
  };

  return (
    <div className="wmp-container">
      {showAbout && (
        <AboutDialog 
          title="Windows Media Player" 
          icon="assets/media_player.png" 
          description="A high-fidelity media player for the ultimate Windows 95 entertainment experience." 
          onClose={() => setShowAbout(false)} 
        />
      )}
      {/* Menu Bar */}
      <div className="wmp-menu" onMouseLeave={() => setActiveMenu(null)}>
        {Object.keys(menus).map(menu => (
          <div 
            key={menu} 
            className="wmp-menu-item" 
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
            style={{ position: 'relative' }}
          >
            {menu}
            {activeMenu === menu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#D4D0C8',
                border: '1px solid #000',
                boxShadow: '2px 2px 0 #000',
                zIndex: 1000,
                minWidth: '150px',
                padding: '2px'
              }}>
                {menus[menu].map(item => (
                  <div 
                    key={item} 
                    className="dropdown-item" 
                    onClick={(e) => { e.stopPropagation(); handleMenuItemClick(menu, item); }}
                    style={{
                      padding: '2px 10px',
                      fontSize: '11px',
                      cursor: 'default',
                      whiteSpace: 'nowrap',
                      color: '#000',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{item}</span>
                    {item === 'Playlist' && showPlaylist && <span>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Video Area */}
        <div className="wmp-video-area" style={{ flexGrow: 1 }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Playlist Sidebar */}
        {showPlaylist && (
          <div className="media-player-playlist" style={{ width: '180px', margin: '1px 1px 1px 0' }}>
            <div style={{ padding: '2px 5px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#808080', color: '#fff', borderBottom: '1px solid #000' }}>
              Channel Playlist
            </div>
            {VLOG_VIDEOS.map(v => (
              <div 
                key={v.id} 
                className={`playlist-item ${videoId === v.id ? 'active' : ''}`}
                onClick={() => handleVideoSelect(v.id)}
              >
                {v.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="wmp-controls">
        <div className="wmp-seek-container">
          <div className="wmp-seek-track">
            <div className="wmp-seek-thumb" style={{ left: isPlaying ? '40%' : '0%' }}></div>
          </div>
        </div>

        <div className="wmp-buttons-row">
          <div className="wmp-btn-group">
            <div className="wmp-btn" onClick={() => setIsPlaying(true)}>▶</div>
            <div className="wmp-btn" onClick={() => setIsPlaying(false)}>⏸</div>
            <div className="wmp-btn" onClick={() => setIsPlaying(false)}>■</div>
          </div>
          <div className="wmp-divider"></div>
          <div className="wmp-btn-group">
            <div className="wmp-btn">⏮</div>
            <div className="wmp-btn">⏪</div>
            <div className="wmp-btn">⏩</div>
            <div className="wmp-btn">⏭</div>
          </div>
          <div className="wmp-divider"></div>
          <div className="wmp-btn">⏏</div>
          
          <div style={{ flexGrow: 1 }}></div>
          
          <div className="wmp-volume-container">
            <span style={{ fontSize: '12px', marginRight: '4px' }}>🔊</span>
            <div className="wmp-volume-track">
              <div className="wmp-volume-thumb"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div 
        className="wmp-status-bar" 
        onClick={(e) => {
          e.stopPropagation();
          setShowPlaylist(!showPlaylist);
        }} 
        style={{ cursor: 'pointer', zIndex: 10, height: '22px' }}
      >
        <span style={{ paddingLeft: '5px' }}>{showPlaylist ? 'Hide Playlist' : 'Show Playlist'}</span>
      </div>
    </div>
  );
};

export default MediaPlayer;
