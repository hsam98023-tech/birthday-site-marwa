import React, { useEffect } from 'react';
import { Experience } from './components/Experience';
import { Login } from './components/Login';
import { MusicPlayer } from './components/MusicPlayer';
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