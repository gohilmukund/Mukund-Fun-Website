
import React from 'react';
import { AppMeta } from '../../data/apps';
import MyComputer from '../Apps/MyComputer';
import Chrome from '../Apps/Chrome';
import Notepad from '../Apps/Notepad';
import Paint from '../Apps/Paint';
import Doom from '../Apps/Doom';
import Gemini from '../Apps/Gemini';
import Minesweeper from '../Apps/Minesweeper';
import MediaPlayer from '../Apps/MediaPlayer';
import PdfViewer from '../Apps/PdfViewer';

interface WindowContentProps {
  app: AppMeta;
}


const WindowContent: React.FC<WindowContentProps> = ({ app }) => {
  let content: React.ReactNode = null;
  switch (app.id) {
    case 'myComputer':
      content = <MyComputer />;
      break;
    case 'chrome':
      content = <Chrome />;
      break;
    case 'notepad':
      content = <Notepad />;
      break;
    case 'paint':
      content = <Paint />;
      break;
    case 'doom':
      content = <Doom />;
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
    case 'pdfViewer':
      content = <PdfViewer file="public/assets/mukund.pdf" title={app.title} />;
      break;
    default:
      content = <div>App: {app.title}</div>;
  }
  return <div className="window-content">{content}</div>;
};

export default WindowContent;
