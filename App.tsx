Import React, { useEffect } from 'react';
// تعديل المسارات: حذفنا كلمة /components لأن الملفات موجودة في المجلد الرئيسي
import { Experience } from './Experience';
import { Login } from './Login';
import { MusicPlayer } from './MusicPlayer';
import { useStore } from './store';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const { hasEntered, isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="w-full h-screen relative transition-colors duration-500 bg-[#FBFBFD] dark:bg-black overflow-hidden font-inter">
      <MusicPlayer />
      
      {/* 3D Background & Scrollable Content */}
      <Experience />

      {/* Login Overlay - Only shows when !hasEntered */}
      <AnimatePresence>
        {!hasEntered && <Login />}
      </AnimatePresence>
    </div>
  );
};

export default App;
