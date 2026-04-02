import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Play, Music, Download, 
  Image as ImageIcon, Video, FileText, 
  Search, Filter, ExternalLink, ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import IslamicPattern from '../components/IslamicPattern';

const Multimedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState('photos');

  const tabs = [
    { id: 'photos', name: 'Galerie Photos', icon: Camera },
    { id: 'videos', name: 'Vidéos & Khoutbas', icon: Play },
    { id: 'audio', name: 'Audio & Podcasts', icon: Music },
    { id: 'downloads', name: 'Téléchargements', icon: Download },
  ];

  const photos = [
    { id: 1, title: 'Mosquée At-Tawheed', category: 'Mosquée', url: 'https://picsum.photos/seed/mosque-ext/800/600' },
    { id: 2, title: 'Iftar Communautaire', category: 'Ramadan', url: 'https://picsum.photos/seed/iftar/800/600' },
    { id: 3, title: 'Cours pour enfants', category: 'Éducation', url: 'https://picsum.photos/seed/kids/800/600' },
    { id: 4, title: 'Prière du Vendredi', category: 'Événements', url: 'https://picsum.photos/seed/jumuah/800/600' },
    { id: 5, title: 'Distribution de colis', category: 'Social', url: 'https://picsum.photos/seed/charity/800/600' },
    { id: 6, title: 'Intérieur de la mosquée', category: 'Mosquée', url: 'https://picsum.photos/seed/mosque-int/800/600' },
  ];

  const videos = [
    { id: 1, title: 'Khoutba du Vendredi - La patience', date: '12 Mars 2026', duration: '25:30', thumbnail: 'https://picsum.photos/seed/video1/800/450' },
    { id: 2, title: 'Cours d\'Islam - Les 5 piliers', date: '05 Mars 2026', duration: '45:15', thumbnail: 'https://picsum.photos/seed/video2/800/450' },
    { id: 3, title: 'Événement Ramadan 2025', date: '15 Avril 2025', duration: '12:45', thumbnail: 'https://picsum.photos/seed/video3/800/450' },
  ];

  const downloads = [
    { title: 'Guide du Ramadan 2026', size: '2.4 MB', type: 'PDF', icon: FileText },
    { title: 'Calendrier des Prières 2026', size: '1.1 MB', type: 'PDF', icon: FileText },
    { title: 'Brochure de la Mosquée', size: '5.6 MB', type: 'PDF', icon: FileText },
    { title: 'Livret d\'apprentissage de l\'Arabe', size: '8.2 MB', type: 'PDF', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="bg-islamic-dark py-24 relative overflow-hidden">
        <IslamicPattern dark className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold">Médiathèque</h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              Plongez dans la vie de notre communauté à travers nos photos, 
              vidéos, cours audio et ressources téléchargeables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="sticky top-16 z-40 bg-white shadow-md border-b border-gray-100 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-w-max py-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-islamic-green text-white shadow-lg" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-soft-black"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-20">
        <AnimatePresence mode="wait">
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h2 className="text-3xl font-serif font-bold text-soft-black">Galerie Photos</h2>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                  <button className="px-4 py-2 rounded-xl bg-islamic-green text-white font-bold text-sm">Tout</button>
                  <button className="px-4 py-2 rounded-xl text-gray-400 hover:text-soft-black font-bold text-sm">Mosquée</button>
                  <button className="px-4 py-2 rounded-xl text-gray-400 hover:text-soft-black font-bold text-sm">Événements</button>
                  <button className="px-4 py-2 rounded-xl text-gray-400 hover:text-soft-black font-bold text-sm">Social</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    whileHover={{ y: -10 }}
                    className="group relative rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/3]"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                      <div className="space-y-2">
                        <span className="text-islamic-gold text-xs font-bold uppercase tracking-widest">{photo.category}</span>
                        <h3 className="text-white text-2xl font-serif font-bold">{photo.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <h2 className="text-3xl font-serif font-bold text-soft-black">Vidéos & Khoutbas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -5 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-islamic-green transition-all">
                          <Play className="w-8 h-8 fill-current" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="text-xl font-serif font-bold group-hover:text-islamic-green transition-colors leading-tight">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-gray-400 text-sm font-medium">
                        <span>{video.date}</span>
                        <button className="text-islamic-green font-bold flex items-center gap-1">
                          Regarder <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <h2 className="text-3xl font-serif font-bold text-soft-black">Audio & Podcasts</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  { title: 'La patience dans l\'épreuve', speaker: 'Imam At-Tawheed', duration: '45:00' },
                  { title: 'L\'éducation des enfants en Islam', speaker: 'Sheikh Haïti', duration: '32:15' },
                  { title: 'Les mérites du mois de Ramadan', speaker: 'Imam At-Tawheed', duration: '58:40' },
                ].map((audio, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:border-islamic-green transition-all">
                    <div className="w-16 h-16 bg-islamic-green/5 text-islamic-green rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-islamic-green group-hover:text-white transition-all">
                      <Music className="w-8 h-8" />
                    </div>
                    <div className="flex-grow text-center md:text-left space-y-1">
                      <h3 className="text-xl font-serif font-bold text-soft-black">{audio.title}</h3>
                      <p className="text-gray-400 font-medium">{audio.speaker} • {audio.duration}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="w-12 h-12 bg-gray-100 text-soft-black rounded-full flex items-center justify-center hover:bg-islamic-green hover:text-white transition-all">
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                      <button className="w-12 h-12 bg-gray-100 text-soft-black rounded-full flex items-center justify-center hover:bg-islamic-gold hover:text-white transition-all">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'downloads' && (
            <motion.div
              key="downloads"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <h2 className="text-3xl font-serif font-bold text-soft-black">Téléchargements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {downloads.map((file, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 flex items-center gap-6 group hover:border-islamic-gold transition-all">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-islamic-gold group-hover:text-white transition-all">
                      <file.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <h3 className="text-xl font-serif font-bold text-soft-black">{file.title}</h3>
                      <p className="text-gray-400 text-sm font-medium">{file.type} • {file.size}</p>
                    </div>
                    <button className="w-12 h-12 bg-gray-100 text-soft-black rounded-full flex items-center justify-center hover:bg-islamic-green hover:text-white transition-all shadow-sm">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Multimedia;
