export interface AppMeta {
  id: string;
  title: string;
  icon: string;
}

export const apps: AppMeta[] = [
  { id: 'myComputer', title: 'My Computer', icon: 'https://storage.googleapis.com/gemini-95-icons/mycomputer.png' },
  { id: 'chrome', title: 'Chrome', icon: 'https://storage.googleapis.com/gemini-95-icons/chrome-icon-2.png' },
  { id: 'notepad', title: 'Notes', icon: 'https://storage.googleapis.com/gemini-95-icons/GemNotes.png' },
  { id: 'paint', title: 'Paint', icon: 'https://storage.googleapis.com/gemini-95-icons/gempaint.png' },
  // { id: 'doom', title: 'Doom II', icon: 'https://64.media.tumblr.com/1d89dfa76381e5c14210a2149c83790d/7a15f84c681c1cf9-c1/s540x810/86985984be99d5591e0cbc0dea6f05ffa3136dac.png' },
  { id: 'gemini', title: 'Gemini App', icon: 'https://storage.googleapis.com/gemini-95-icons/GeminiChatRetro.png' },
  { id: 'minesweeper', title: 'MineSweeper', icon: 'https://storage.googleapis.com/gemini-95-icons/gemsweeper.png' },
  { id: 'mediaPlayer', title: 'Windows Media Player', icon: 'https://storage.googleapis.com/gemini-95-icons/ytmediaplayer.png' },
  { id: 'pdfViewer', title: "Mukund's Resume.pdf", icon: '/assets/acrobat.jpg' },
];
