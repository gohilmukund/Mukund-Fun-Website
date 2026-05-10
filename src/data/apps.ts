export interface AppMeta {
  id: string;
  title: string;
  icon: string;
}

export const apps: AppMeta[] = [
  { id: 'myComputer', title: 'My Computer', icon: 'assets/mycomputer.png' },
  { id: 'chrome', title: 'Internet Explorer', icon: 'assets/intexp.png' },
  { id: 'notepad', title: 'Notepad', icon: 'assets/notepad.png' },
  { id: 'paint', title: 'Paint', icon: 'assets/paint.png' },
  { id: 'gemini', title: 'Gemini App', icon: 'assets/gemini_retro.png' },
  { id: 'minesweeper', title: 'MineSweeper', icon: 'assets/minesweeper.png' },
  { id: 'mediaPlayer', title: 'Windows Media Player', icon: 'assets/media_player.png' },
  { id: 'pdfViewer', title: "Mukund's Resume.pdf", icon: 'assets/acrobat.jpg' },
];
