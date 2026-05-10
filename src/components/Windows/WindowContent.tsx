import React from 'react';
import { AppMeta } from '../../data/apps';
import MyComputer from '../Apps/MyComputer';
import InternetExplorer from '../Apps/InternetExplorer';
import Notepad from '../Apps/Notepad';
import Paint from '../Apps/Paint';
import Gemini from '../Apps/Gemini';
import Minesweeper from '../Apps/Minesweeper';
import MediaPlayer from '../Apps/MediaPlayer';
import PdfViewer from '../Apps/PdfViewer';
import ControlPanel from '../Apps/ControlPanel';

interface WindowContentProps {
  app: AppMeta;
  onOpenApp?: (appId: string) => void;
}

const WindowContent: React.FC<WindowContentProps> = ({ app, onOpenApp }) => {
  let content: React.ReactNode = null;
  switch (app.id) {
    case 'myComputer':
      content = <MyComputer onOpenApp={onOpenApp} />;
      break;
    case 'chrome':
      content = <InternetExplorer />;
      break;
    case 'notepad':
      content = <Notepad />;
      break;
    case 'paint':
      content = <Paint />;
      break;
    case 'gemini':
      content = <Gemini />;
      break;
    case 'minesweeper':
      content = <Minesweeper />;
      break;
    case 'mediaPlayer':
      content = <MediaPlayer />;
      break;
    case 'control_panel':
      content = <ControlPanel />;
      break;
    case 'pdfViewer':
      content = <PdfViewer file="assets/mukund.pdf" title={app.title} />;
      break;
    default:
      content = <div>App: {app.title}</div>;
  }
  return <div className="window-content">{content}</div>;
};

export default WindowContent;
