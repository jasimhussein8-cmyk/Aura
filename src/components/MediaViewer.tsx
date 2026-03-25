import React from 'react';
import ReactPlayer from 'react-player';
import { X, ExternalLink, Download, FileText, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaViewerProps {
  url: string;
  type: 'video' | 'pdf' | 'image' | 'text' | 'link';
  title: string;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ url, type, title, onClose }) => {
  const isExternal = url.startsWith('http') && !url.includes(window.location.origin) && !url.startsWith('/');
  
  // Helper to get full URL for local uploads
  const getFullUrl = (path: string) => {
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  const fullUrl = getFullUrl(url);

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full p-4">
            <img 
              src={fullUrl} 
              alt={title} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      case 'video':
        const Player = ReactPlayer as any;
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <Player 
              url={fullUrl} 
              controls 
              width="100%" 
              height="100%" 
              playing
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
            />
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full h-full flex flex-col">
            <iframe 
              src={`${fullUrl}#toolbar=0`} 
              className="w-full h-full border-none"
              title={title}
            />
          </div>
        );
      case 'link':
      case 'text':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              {(type as string) === 'pdf' ? <FileText size={40} /> : (type as string) === 'video' ? <PlayCircle size={40} /> : <ExternalLink size={40} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400">هذا المحتوى متاح عبر رابط خارجي أو يتطلب فتحه في نافذة جديدة.</p>
            </div>
            <div className="flex gap-4">
              <a 
                href={fullUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 px-8"
              >
                <ExternalLink size={20} />
                فتح الرابط
              </a>
              <button 
                onClick={onClose}
                className="btn-secondary px-8"
              >
                إغلاق
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-8"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
              {type === 'image' ? <ImageIcon size={20} /> : type === 'video' ? <PlayCircle size={20} /> : <FileText size={20} />}
            </div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] md:max-w-md">
              {title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href={fullUrl} 
              download 
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="تحميل"
            >
              <Download size={20} />
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="إغلاق"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950/50">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MediaViewer;
