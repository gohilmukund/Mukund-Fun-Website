export interface AppMeta {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
}

export const apps: AppMeta[] = [
  { id: 'myComputer', title: 'My Computer', icon: 'assets/mycomputer.png', width: 600, height: 400 },
  { id: 'chrome', title: 'Internet Explorer', icon: 'assets/intexp.png', width: 800, height: 600 },
  { id: 'notepad', title: 'Notepad', icon: 'assets/notepad.png', width: 640, height: 480 },
  { id: 'paint', title: 'Paint', icon: 'assets/paint.png', width: 800, height: 600 },
  { id: 'gemini', title: 'Gemini App', icon: 'assets/gemini_retro.png', width: 700, height: 500 },
  { id: 'minesweeper', title: 'MineSweeper', icon: 'assets/minesweeper.png', width: 220, height: 320 },
  { id: 'mediaPlayer', title: 'Windows Media Player', icon: 'assets/media_player.png', width: 480, height: 520 },
  { id: 'pdfViewer', title: "Mukund's Resume.pdf", icon: 'assets/acrobat.jpg', width: 640, height: 800 },
];
