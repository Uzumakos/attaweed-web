import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  location: string;
  imageUrl: string;
  capacity?: number;
  registrationRequired: boolean;
  status: 'A venir' | 'Passé' | 'Annulé';
}

const EventCard: React.FC<EventCardProps> = ({ 
  id, title, description, startDate, location, imageUrl, capacity, registrationRequired, status 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
          status === 'A venir' ? "bg-islamic-green" : status === 'Passé' ? "bg-gray-400" : "bg-red-500"
        )}>
          {status}
        </div>
        {registrationRequired && (
          <div className="absolute bottom-4 right-4 bg-islamic-gold text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Inscription requise</span>
          </div>
        )}
      </div>
      
      <div className="p-8 space-y-4">
        <div className="flex flex-wrap gap-4 text-gray-400 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-islamic-green" />
            <span>{startDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-islamic-green" />
            <span>{location}</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-serif font-bold group-hover:text-islamic-green transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="pt-4 flex items-center justify-between">
          <Link 
            to={`/events/${id}`} 
            className="inline-flex items-center gap-2 text-islamic-green font-bold group/btn"
          >
            Détails 
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          {status === 'A venir' && registrationRequired && (
            <Link 
              to={`/events/${id}#register`}
              className="bg-islamic-gold/10 text-islamic-gold px-4 py-2 rounded-xl text-sm font-bold hover:bg-islamic-gold hover:text-white transition-all"
            >
              S'inscrire
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
