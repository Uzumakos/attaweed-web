import React from 'react';
import { cn } from '../lib/utils';

interface IslamicPatternProps {
  className?: string;
  dark?: boolean;
}

const IslamicPattern: React.FC<IslamicPatternProps> = ({ className, dark }) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none opacity-10", 
        dark ? "arabesque-pattern-dark" : "arabesque-pattern",
        className
      )} 
    />
  );
};

export default IslamicPattern;
