import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Music, Sun, Moon, ListMusic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);

  // Expand player on Login, but DO NOT autoplay
  useEffect(() => {
    if (hasEntered) {
        // Set initial volume
        if (audioRef.current) audioRef.current.volume = 0.4;
        
        // Expand the player to invite interaction
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [hasEntered]);

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
    // If selecting a track manually, we generally want to start playing
    if (!isPlaying) {
        setIsPlaying(true);
        // Small timeout to allow ref update
        setTimeout(() => audioRef.current?.play(), 50);
    }
  };

  const togglePlay = () => {
      if (audioRef.current) {
          if (isPlaying) {
              audioRef.current.pause();
          } else {
              audioRef.current.play();
          }
          setIsPlaying(!isPlaying);
      }
  };

  const nextTrack = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
      setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  // Handle track change - only autoplay if already playing
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
          if (duration) {
              setProgress((current / duration) * 100);
          }
      }
  };

  const handleEnded = () => {
      nextTrack();
  };

  const toggleMute = () => {
      if (audioRef.current) {
          audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4">
        <audio 
            ref={audioRef}
            src={PLAYLIST[currentTrackIndex].url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            preload="auto"
        />

        {/* Theme Toggle Button */}
        <button
            onClick={toggleTheme}
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg text-[#1D1D1F] dark:text-white transition-all hover:scale-105"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Main Player Card */}
        <motion.div 
            initial={false}
            animate={{ width: isExpanded ? '280px' : '50px', height: isExpanded ? 'auto' : '50px' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-panel rounded-2xl overflow-visible relative shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10"
        >
            {/* Background animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-900/20 dark:to-purple-900/20 z-0 pointer-events-none rounded-2xl overflow-hidden" />

            {/* Minimized View (Toggle) */}
            <div 
                className="absolute top-0 right-0 w-[50px] h-[50px] flex items-center justify-center cursor-pointer z-20 text-[#1D1D1F]/80 dark:text-white/80 hover:text-[#1D1D1F] dark:hover:text-white"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? (
                    <div className={`p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                         <Disc size={20} className="text-[#FF2D55] dark:text-pink-400" />
                    </div>
                ) : (
                     <div className={`p-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                         <Music size={20} className="text-[#FF2D55] dark:text-pink-400" />
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 pr-12 relative z-10 flex flex-col gap-3"
                    >
                        {/* Track Info */}
                        <div className="flex flex-col">
                            <h3 className="text-[#1D1D1F] dark:text-white font-playfair font-bold text-base truncate pr-2 leading-tight">
                                {PLAYLIST[currentTrackIndex].title}
                            </h3>
                            <p className="text-[#FF2D55] dark:text-pink-300/80 text-[10px] font-inter uppercase tracking-wider truncate mt-1">
                                {PLAYLIST[currentTrackIndex].artist}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-1">
                             <button onClick={toggleMute} className="text-[#1D1D1F]/40 dark:text-white/40 hover:text-[#1D1D1F] dark:hover:text-white transition-colors p-1" title="Mute/Unmute">
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                             </button>

                             <div className="flex items-center gap-3">
                                 <button onClick={prevTrack} className="text-[#1D1D1F]/70 dark:text-white/70 hover:text-[#1D1D1F] dark:hover:text-white transition-colors hover:scale-110 active:scale-95">
                                     <SkipBack size={18} fill="currentColor" className="opacity-70" />
                                 </button>
                                 <button 
                                    onClick={togglePlay}
                                    className={`w-8 h-8 rounded-full bg-gradient-to-tr from-[#1D1D1F] to-[#444] dark:from-white dark:to-pink-100 text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform shadow-md ${!isPlaying ? 'animate-pulse ring-2 ring-offset-2 ring-[#FF2D55] dark:ring-pink-400 ring-offset-transparent' : ''}`}
                                 >
                                     {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                 </button>
                                 <button onClick={nextTrack} className="text-[#1D1D1F]/70 dark:text-white/70 hover:text-[#1D1D1F] dark:hover:text-white transition-colors hover:scale-110 active:scale-95">
                                     <SkipForward size={18} fill="currentColor" className="opacity-70" />
                                 </button>
                             </div>

                             <button 
                                onClick={() => setShowPlaylist(!showPlaylist)}
                                className={`p-1 transition-all hover:scale-110 active:scale-95 ${showPlaylist ? 'text-[#FF2D55] dark:text-pink-400' : 'text-[#1D1D1F]/40 dark:text-white/40 hover:text-[#1D1D1F] dark:hover:text-white'}`}
                                title="Playlist"
                             >
                                <ListMusic size={16} />
                             </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Playlist Overlay - Rendered inside the main container to share glass effect or outside? 
                Rendering outside via absolute position to "slide out" from it.
            */}
        </motion.div>

        {/* Playlist Container - Positioned relative to the MusicPlayer container */}
        <AnimatePresence>
            {isExpanded && showPlaylist && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-[280px] glass-panel rounded-2xl overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-2xl relative z-40"
                >
                    <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase tracking-widest text-[#1D1D1F]/50 dark:text-white/50">Up Next</span>
                            <button onClick={() => setShowPlaylist(false)} className="text-[#1D1D1F]/30 dark:text-white/30 hover:text-[#FF2D55] dark:hover:text-pink-400 transition-colors">
                                <X size={12} />
                            </button>
                        </div>
                        {PLAYLIST.map((track, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => selectTrack(index)}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all group text-left ${
                                    currentTrackIndex === index 
                                    ? 'bg-[#FF2D55]/10 dark:bg-pink-500/10 border border-[#FF2D55]/20 dark:border-pink-500/20' 
                                    : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    currentTrackIndex === index 
                                    ? 'bg-[#FF2D55] dark:bg-pink-500 text-white shadow-[0_0_10px_rgba(255,45,85,0.4)]' 
                                    : 'bg-black/5 dark:bg-white/5 text-[#1D1D1F]/40 dark:text-white/40 group-hover:bg-[#FF2D55]/10 dark:group-hover:bg-pink-500/20'
                                }`}>
                                    {currentTrackIndex === index && isPlaying ? (
                                        <div className="flex gap-[2px] items-end h-3">
                                            <motion.div 
                                                animate={{ height: [4, 12, 6, 12, 4] }}
                                                transition={{ repeat: Infinity, duration: 0.8 }}
                                                className="w-[2px] bg-white rounded-full"
                                            />
                                            <motion.div 
                                                animate={{ height: [8, 4, 12, 6, 8] }}
                                                transition={{ repeat: Infinity, duration: 0.7 }}
                                                className="w-[2px] bg-white rounded-full"
                                            />
                                            <motion.div 
                                                animate={{ height: [6, 10, 4, 10, 6] }}
                                                transition={{ repeat: Infinity, duration: 0.6 }}
                                                className="w-[2px] bg-white rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold">{index + 1}</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className={`text-xs font-bold truncate ${currentTrackIndex === index ? 'text-[#FF2D55] dark:text-pink-400' : 'text-[#1D1D1F] dark:text-white'}`}>
                                        {track.title}
                                    </h4>
                                    <p className="text-[10px] text-[#1D1D1F]/60 dark:text-white/60 truncate">
                                        {track.artist}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};