import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface PrayerTimeCardProps {
  name: string;
  time: string;
  icon: LucideIcon;
  active?: boolean;
  iqama?: string;
}

const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({ name, time, icon: Icon, active, iqama }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center overflow-hidden group",
        active 
          ? "bg-islamic-green border-islamic-green text-white shadow-xl scale-105 z-10" 
          : "bg-white border-gray-100 text-soft-black hover:border-islamic-gold hover:shadow-lg"
      )}
    >
      {active && (
        <div className="absolute top-0 left-0 w-full h-full arabesque-pattern-dark opacity-10 pointer-events-none" />
      )}
      
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
        active ? "bg-white/20" : "bg-gray-50 text-islamic-green"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="space-y-1">
        <h3 className={cn("text-sm font-bold uppercase tracking-widest", active ? "text-islamic-gold" : "text-gray-400")}>
          {name}
        </h3>
        <div className="text-3xl md:text-4xl font-serif font-bold">
          {time}
        </div>
        {iqama && (
          <div className={cn("text-xs font-medium opacity-80", active ? "text-white" : "text-gray-500")}>
            Iqama: {iqama}
          </div>
        )}
      </div>

      {active && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-islamic-gold rounded-full animate-ping" />
        </div>
      )}
    </motion.div>
  );
};

export default PrayerTimeCard;
