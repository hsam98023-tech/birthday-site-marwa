import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { motion } from 'framer-motion';
import { ArrowDown, Send } from 'lucide-react';
import { supabase } from './supabaseClient';

export const Interface: React.FC = () => {
  const { isDarkMode } = useStore();
  const [wish, setWish] = useState("");
  const [sender, setSender] = useState("");
  const [sent, setSent] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({
    years: 0, days: 0, hours: 0, mins: 0, secs: 0
  });

  useEffect(() => {
    const birthDate = new Date('2008-02-18T00:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();
      let totalYears = now.getFullYear() - birthDate.getFullYear();
      if (now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())) {
        totalYears--;
      }
      setTimeLeft({
        years: totalYears,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('Marwa happy birthday').insert([{ sender_name: sender, message: wish }]);
    if (!error) { setSent(true); setWish(""); setSender(""); }
  };

  return (
    <div className="relative z-20 w-full overflow-y-auto scroll-smooth">
      {/* SECTION 1: HERO & COUNTDOWN */}
      <section className="h-screen flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-5xl md:text-7xl font-playfair text-[#1D1D1F] dark:text-white mb-8">
            Happy Birthday, <span className="text-[#FF2D55] dark:text-pink-500">Marwa.</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            <TimeUnit label="YEARS" value={timeLeft.years} />
            <TimeUnit label="DAYS" value={timeLeft.days} />
            <TimeUnit label="HOURS" value={timeLeft.hours} />
            <TimeUnit label="MINS" value={timeLeft.mins} />
            <TimeUnit label="SECS" value={timeLeft.secs} isHighlight />
          </div>
          <div className="mt-20 animate-bounce flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] uppercase tracking-widest text-[#1D1D1F] dark:text-white">Scroll to discover</span>
            <ArrowDown size={16} />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: MESSAGES */}
      <section className="min-h-screen flex flex-col items-center justify-center space-y-32 py-20 px-6">
        <MessageCard text="عيد ميلادك ليس مجرد يوم، بل هو اليوم الذي وُلدت فيه سعادتي 💗" />
        <MessageCard text="في يوم ميلادك، لا أحتفل فقط بعامٍ جديد من عمرك، بل أحتفل بوجودك في حياتي" />
        <MessageCard text="كل عام وأنتِ نبضي الذي لا يهدأ" />
      </section>

      {/* SECTION 3: SECRET WISH (SUPABASE) */}
      <section className="min-h-screen flex items-center justify-center p-6">
        <motion.div whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.9 }} className="glass-panel p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-playfair text-white mb-6 flex items-center gap-2">
            <Send size={20} className="text-pink-500" /> Leave a Secret Wish
          </h2>
          {sent ? (
            <div className="text-center p-6 text-pink-400 font-medium">Your wish has been sent to the stars! ✨</div>
          ) : (
            <form onSubmit={handleSubmitWish} className="space-y-4">
              <input type="text" placeholder="Your Name" required value={sender} onChange={(e) => setSender(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-pink-500" />
              <textarea placeholder="Write your secret wish here..." required value={wish} onChange={(e) => setWish(e.target.value)} rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-pink-500" />
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-xl text-white font-bold hover:scale-105 transition-transform shadow-lg">
                SEND WISH
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
};

const TimeUnit = ({ label, value, isHighlight = false }: any) => (
  <div className="flex flex-col items-center min-w-[65px] md:min-w-[90px] bg-white/5 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-2xl">
    <span className={`text-xl md:text-3xl font-bold ${isHighlight ? 'text-pink-500 animate-pulse' : 'text-white'}`}>{value.toLocaleString()}</span>
    <span className="text-[8px] md:text-[10px] text-white/40 tracking-widest mt-1">{label}</span>
  </div>
);

const MessageCard = ({ text }: { text: string }) => (
  <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} viewport={{ once: true }}
    className="max-w-xl text-center text-2xl md:text-4xl font-playfair leading-relaxed text-[#1D1D1F] dark:text-white/90 px-4">
    {text}
  </motion.div>
);
