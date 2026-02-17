import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, RotateCcw } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useStore } from '@/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Interface: React.FC = () => {
  const { setHasEntered } = useStore();
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(ref.current, 
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.5,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;
    setSending(true);
    try {
      const { error } = await supabase.from('Marwa happy birthday').insert([{ sender_name: senderName, Message: message }]);
      if (error) throw error;
      setSent(true);
    } catch (err) { alert('Failed to send wish.'); }
    finally { setSending(false); }
  };

  return (
    <div className="w-full text-white font-inter">
      {/* SECTION 1: HERO */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-6 text-center">
        <motion.h1 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-playfair text-6xl md:text-8xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-pink-200"
        >
          Happy Birthday,<br/>Marwa.
        </motion.h1>
        <p className="text-white/40 uppercase tracking-[0.3em] text-sm">Scroll to Read</p>
      </section>

      {/* SECTION 2: THE MESSAGES (اللي كانت ناقصة) */}
      <section ref={sectionRef} className="min-h-screen w-full py-20 px-6 space-y-64 flex flex-col items-center">
        
        <div ref={textRefs[0]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed italic text-pink-100">
            "Wherever life takes you, I hope you always find your way toward what gives you peace and satisfaction."
          </p>
        </div>

        <div ref={textRefs[1]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed text-white/90">
            "Every year adds something new to who you are, and I hope this year adds something meaningful. I wish you well in the year ahead."
          </p>
        </div>

        <div ref={textRefs[2]} className="max-w-2xl text-center">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed italic text-purple-200">
            "I hope this day brings you moments of calm, genuine smiles, and memories worth keeping."
          </p>
        </div>

        <div ref={textRefs[3]} className="max-w-2xl text-center pb-20">
          <p className="font-playfair text-2xl md:text-4xl leading-relaxed text-white/90">
            "Birthdays are not just about getting older, but about realizing how far you’ve come... I wish you a year filled with progress, clarity, and opportunities."
          </p>
        </div>
      </section>

      {/* SECTION 3: WISH WALL */}
      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full">
          <h2 className="text-3xl font-playfair text-center mb-6">Make a Wish</h2>
          {sent ? <p className="text-center text-pink-400">Sent to the stars! ✨</p> : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" className="w-full p-3 bg-white/10 rounded-lg outline-none" required />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" className="w-full p-3 bg-white/10 rounded-lg h-32 outline-none" required />
              <button className="w-full py-3 bg-pink-600 rounded-lg font-bold hover:bg-pink-700 transition-colors">Send Wish</button>
            </form>
          )}
          <button onClick={() => setHasEntered(false)} className="w-full mt-6 text-white/30 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <RotateCcw size={12} /> Restart Experience
          </button>
        </div>
      </section>
    </div>
  );
};
