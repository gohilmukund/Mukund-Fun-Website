import React, { useRef, useState } from 'react';

const DEFAULT_VIDEO_ID = 'VKDFxJFqz2s';

function getYouTubeVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
  const match = urlOrId.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

const MediaPlayer: React.FC = () => {
  const [videoId, setVideoId] = useState(DEFAULT_VIDEO_ID);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadVideo = () => {
    const id = getYouTubeVideoId(input.trim());
    if (id) {
      setVideoId(id);
      setError(null);
    } else {
      setError('Invalid YouTube URL or Video ID.');
    }
  };

  return (
    <div style={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: 0 }}>GemPlayer</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          className="media-player-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="YouTube URL or Video ID"
          style={{ flex: 1, fontSize: 15, padding: 6 }}
        />
        <button className="media-player-load-button" onClick={loadVideo} style={{ fontSize: 15, padding: '6px 16px' }}>Load</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div id={`youtube-player-mediaPlayer`} style={{ flex: 1, minHeight: 200, background: '#000', marginBottom: 8 }}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default MediaPlayer;
