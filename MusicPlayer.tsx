import React, { useEffect, useRef, useState } from 'react';
import { useStore } from './store'; // تأكد من المسار حسب مشروعك
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Sun, Moon, ListMusic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// قائمة الأغاني المرفوعة على Catbox
const PLAYLIST = [
  { title: "Basrah w Atoh", artist: "Cairokee", url: "https://files.catbox.moe/4d7ba7.mp3" },
  { title: "Impossible", artist: "James Arthur", url: "https://files.catbox.moe/wkvb03.mp3" },
  { title: "Sweater Weather", artist: "The Neighbourhood", url: "https://files.catbox.moe/kmfwkf.mp3" }
];

export const MusicPlayer: React.FC = () => {
  const { hasEntered, isDarkMode, toggleTheme } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // جعل القائمة مفتوحة افتراضياً كما طلبت
  const [showPlaylist, setShowPlaylist] = useState(true); 
  const [progress, setProgress] = useState(0);

  // تمديد المشغل وفتح القائمة عند تسجيل الدخول
  useEffect(() => {
    if (hasEntered) {
        if (audioRef.current) audioRef.current.volume = 0.4;
        
        const timer = setTimeout(() => {
            setIsExpanded(true);
            setShowPlaylist(true); 
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [hasEntered]);

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    // تبقى القائمة مفتوحة حتى بعد اختيار أغنية
    if (!isPlaying) {
        setIsPlaying(true);
        setTimeout(() => audioRef.current?.play(), 50);
    }
  };

  const togglePlay = () => {
      if (audioRef.current) {
          if (isPlaying) { audioRef.current.pause(); } 
          else { audioRef.current.play(); }
          setIsPlaying(!isPlaying);
      }
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);

  useEffect(() => {
      if (hasEntered && audioRef.current && isPlaying) {
          const timer = setTimeout(() => {
              audioRef.current?.play().catch(e => console.log("Play interrupted", e));
          }, 50);
          return () => clearTimeout(timer);
      }
  }, [currentTrackIndex, hasEntered, isPlaying]);

  const handleTimeUpdate = () => {
      if (audioRef.current) {
          const current = audioRef.current.currentTime;
          const duration = audioRef.current.duration;
          if (duration) setProgress((current / duration) * 100);
      }
  };

  const toggleMute = () => {
      if (audioRef.current) {
          audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4">
        <audio ref={audioRef} src={PLAYLIST[currentTrackIndex].url} onTimeUpdate={handleTimeUpdate} onEnded={nextTrack} preload="auto" />

        {/* زر تغيير الوضع (Dark/Light) */}
        <button onClick={toggleTheme} className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg text-[#1D1D1F] dark:text-white transition-all hover:scale-105 pointer-events-auto">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* مشغل الموسيقى الرئيسي */}
        <motion.div 
            animate={{ width: isExpanded ? '280px' : '50px', height: isExpanded ? 'auto' : '50px' }}
            className="glass-panel rounded-2xl overflow-visible relative shadow-xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 pointer-events-auto"
        >
            <div className="absolute top-0 right-0 w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-20 text-[#1D1D1F]/80 dark:text-white/80" onClick={() => setIsExpanded(!isExpanded)}>
                <div className={`p-2 rounded-full ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                    <Disc size={20} className="text-[#FF2D55] dark:text-pink-400" />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 pr-12 relative z-10 flex flex-col gap-3">
                        <div className="flex flex-col">
                            <h3 className="text-[#1D1D1F] dark:text-white font-playfair font-bold text-base truncate leading-tight">{PLAYLIST[currentTrackIndex].title}</h3>
                            <p className="text-[#FF2D55] dark:text-pink-300/80 text-[10px] font-inter uppercase tracking-wider mt-1">{PLAYLIST[currentTrackIndex].artist}</p>
                        </div>
                        <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                             <button onClick={toggleMute} className="text-[#1D1D1F]/40 dark:text-white/40 hover:text-pink-500 transition-colors p-1">
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                             </button>
                             <div className="flex items-center gap-3">
                                 <button onClick={prevTrack} className="text-[#1D1D1F]/70 dark:text-white/70 hover:text-pink-500 transition-colors"><SkipBack size={18} fill="currentColor" /></button>
                                 <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md">
                                     {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                 </button>
                                 <button onClick={nextTrack} className="text-[#1D1D1F]/70 dark:text-white/70 hover:text-pink-500 transition-colors"><SkipForward size={18} fill="currentColor" /></button>
                             </div>
                             <button onClick={() => setShowPlaylist(!showPlaylist)} className={`p-1 ${showPlaylist ? 'text-[#FF2D55]' : 'text-[#1D1D1F]/40 dark:text-white/40'}`}>
                                <ListMusic size={16} />
                             </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        {/* عرض قائمة التشغيل (Playlist) */}
        <AnimatePresence>
            {isExpanded && showPlaylist && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-[280px] glass-panel rounded-2xl overflow-hidden bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-2xl z-40 pointer-events-auto"
                >
                    <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase tracking-widest text-pink-500 font-bold">Playlist</span>
                            <button onClick={() => setShowPlaylist(false)} className="text-[#1D1D1F]/30 dark:text-white/30"><X size={12} /></button>
                        </div>
                        {PLAYLIST.map((track, index) => (
                            <button
                                key={index}
                                onClick={() => selectTrack(index)}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${currentTrackIndex === index ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentTrackIndex === index ? 'bg-pink-500 text-white' : 'bg-black/5 dark:bg-white/5'}`}>
                                    <span className="text-xs font-bold">{index + 1}</span>
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <h4 className={`text-xs font-bold truncate ${currentTrackIndex === index ? 'text-pink-500' : 'text-[#1D1D1F] dark:text-white'}`}>{track.title}</h4>
                                    <p className="text-[10px] opacity-60 dark:text-white/60 truncate">{track.artist}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
