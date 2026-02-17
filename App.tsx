import React, { useEffect } from 'react';
import { Experience } from './Experience';
import { Login } from './Login';
import { MusicPlayer } from './MusicPlayer';
import { useStore } from './store';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const { hasEntered, isDarkMode } = useStore();

  useEffect(() => {
    // قفل الحماية: يطلب الاسم وكلمة السر بمجرد تحميل الصفحة
    let authenticated = false;
    while (!authenticated) {
      const user = prompt("أدخل اسم المستخدم (User Name):");
      const pass = prompt("أدخل كلمة السر (Password):");

      // تنظيف المدخلات: حذف المسافات وتحويل الحروف لصغيرة
      const cleanUser = user?.trim().toLowerCase();
      const cleanPass = pass?.trim().toLowerCase();

      if (cleanUser === "marwa" && cleanPass === "marwa") {
        authenticated = true;
      } else {
        alert("المعلومات خاطئة! حاولي مجدداً يا مروة 💗");
      }
    }

    // التحكم في الـ Dark Mode
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
