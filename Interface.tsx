import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { motion } from 'framer-motion';
import { Calendar, Clock, Heart, ArrowDown } from 'lucide-react';

export const Interface: React.FC = () => {
  const { isDarkMode } = useStore();
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  });

  useEffect(() => {
    // تاريخ ميلاد مروة (18 فبراير 2008)
    const birthDate = new Date('2008-02-18T00:00:00');

    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();

      // 1. حساب السنوات الحقيقية
      let totalYears = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        totalYears--;
      }

      // 2. حساب المكونات الأخرى (أيام، ساعات، دقائق، ثواني)
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft({ years: totalYears, days: totalDays, hours, mins, secs });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-start pt-32 pointer-events-none select-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-playfair text-[#1D1D1F] dark:text-white mb-8 tracking-tight">
          Happy Birthday, <span className="text-[#FF2D55] dark:text-pink-500">Marwa.</span>
        </h1>

        {/* العداد المعدل: سنوات، أيام، ساعات، دقائق، ثواني */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-4">
          <TimeUnit label="YEARS" value={timeLeft.years} />
          <TimeUnit label="DAYS" value={timeLeft.days} />
          <TimeUnit label="HOURS" value={timeLeft.hours} />
          <TimeUnit label="MINS" value={timeLeft.mins} />
          <TimeUnit label="SECS" value={timeLeft.secs} isHighlight />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#1D1D1F]/40 dark:text-white/40">Scroll down to read</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown size={16} className="text-[#FF2D55] dark:text-pink-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// مكون عرض الوقت بتصميم Glassmorphism
const TimeUnit = ({ label, value, isHighlight = false }: { label: string, value: number, isHighlight?: boolean }) => (
  <div className="flex flex-col items-center min-w-[70px] md:min-w-[90px] bg-white/10 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10 p-4 rounded-2xl shadow-xl">
    <span className={`text-2xl md:text-4xl font-bold font-inter ${isHighlight ? 'text-[#FF2D55] dark:text-pink-500 animate-pulse' : 'text-[#1D1D1F] dark:text-white'}`}>
      {value.toLocaleString()}
    </span>
    <span className="text-[8px] md:text-[10px] font-medium text-[#1D1D1F]/50 dark:text-white/50 tracking-[0.2em] mt-2">
      {label}
    </span>
  </div>
);
