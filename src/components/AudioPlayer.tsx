import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface AudioPlayerProps {
  title: string;
  reciter: string;
  audioUrl: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, reciter, audioUrl, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={cn("bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-6", className)}>
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="w-16 h-16 bg-islamic-green rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
        <Play className="w-8 h-8 fill-current" />
      </div>

      <div className="flex-grow space-y-2 w-full">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="font-serif font-bold text-lg leading-tight">{title}</h4>
            <p className="text-gray-400 text-sm">{reciter}</p>
          </div>
          <div className="text-xs font-bold text-islamic-green bg-islamic-green/5 px-2 py-1 rounded-md">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-islamic-green"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button onClick={togglePlay} className="w-12 h-12 bg-islamic-green text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
        </button>
        
        <div className="flex items-center gap-2 group relative">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-islamic-green transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
              if (v > 0) setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-islamic-green"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
