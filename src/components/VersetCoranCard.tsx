import React from 'react';
import { cn } from '../lib/utils';

interface VersetCoranCardProps {
  arabe: string;
  traduction: string;
  source: string;
  className?: string;
}

const VersetCoranCard: React.FC<VersetCoranCardProps> = ({ arabe, traduction, source, className }) => {
  return (
    <div className={cn("bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-6 relative overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-1 bg-islamic-gold" />
      <div className="arabic-text text-3xl md:text-5xl text-islamic-green leading-relaxed">
        {arabe}
      </div>
      <div className="h-px w-20 bg-gray-200 mx-auto" />
      <p className="text-xl md:text-2xl font-serif italic text-soft-black leading-relaxed">
        "{traduction}"
      </p>
      <p className="text-islamic-gold font-bold tracking-widest uppercase text-xs">
        {source}
      </p>
    </div>
  );
};

export default VersetCoranCard;
