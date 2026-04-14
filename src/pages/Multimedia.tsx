import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Play, Music, Download, 
  Image as ImageIcon, Video, FileText, 
  Search, Filter, ExternalLink, ArrowRight,
  Loader2, X, ChevronLeft, ChevronRight, Images
} from 'lucide-react';
import { cn } from '../lib/utils';
import IslamicPattern from '../components/IslamicPattern';
import { supabase } from '../supabase';

interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  visible: boolean;
  display_order: number;
  created_at: string;
  photos: GalleryPhoto[];
}

interface GalleryPhoto {
  id: string;
  album_id: string;
  url: string;
  caption: string | null;
  display_order: number;
}

// ─── Photo Viewer / Lightbox ────────────────────────────────────────────────
interface PhotoViewerProps {
  album: GalleryAlbum;
  initialIndex?: number;
  onClose: () => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ album, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const photos = album.photos;
  const current = photos[currentIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(i => Math.min(photos.length - 1, i + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [photos.length, onClose]);

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 text-white relative z-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-islamic-gold" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm">{album.title}</h3>
            <p className="text-white/50 text-xs">{album.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm font-medium">
            {currentIndex + 1} / {photos.length}
          </span>
          <button onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="flex-grow flex items-center justify-center px-4 relative" onClick={e => e.stopPropagation()}>
        {/* Left arrow */}
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(i => i - 1)}
            className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl max-h-[75vh] w-full flex flex-col items-center"
          >
            <img
              src={current.url}
              alt={current.caption || `Photo ${currentIndex + 1}`}
              className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            {current.caption && (
              <p className="text-white/70 text-sm mt-4 text-center font-medium">{current.caption}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right arrow */}
        {currentIndex < photos.length - 1 && (
          <button
            onClick={() => setCurrentIndex(i => i + 1)}
            className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="px-6 py-4 flex items-center justify-center gap-2 overflow-x-auto" onClick={e => e.stopPropagation()}>
          {photos.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                idx === currentIndex
                  ? 'border-islamic-gold ring-2 ring-islamic-gold/30 scale-110'
                  : 'border-white/20 opacity-50 hover:opacity-80'
              )}
            >
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Multimedia Page ───────────────────────────────────────────────────
const Multimedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [viewerAlbum, setViewerAlbum] = useState<GalleryAlbum | null>(null);

  const tabs = [
    { id: 'photos', name: 'Galerie Photos', icon: Camera },
    { id: 'videos', name: 'Vidéos & Khoutbas', icon: Play },
    { id: 'audio', name: 'Audio & Podcasts', icon: Music },
    { id: 'downloads', name: 'Téléchargements', icon: Download },
  ];

  // Fetch albums with their photos from Supabase
  useEffect(() => {
    const fetchAlbums = async () => {
      setAlbumsLoading(true);
      try {
        // Fetch visible albums
        const { data: albumData, error: albumError } = await supabase
          .from('gallery_albums')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true });

        if (albumError || !albumData) {
          setAlbums([]);
          return;
        }

        // Fetch photos for each album
        const albumsWithPhotos = await Promise.all(
          albumData.map(async (album) => {
            const { data: photos } = await supabase
              .from('gallery_photos')
              .select('*')
              .eq('album_id', album.id)
              .order('display_order', { ascending: true });
            return { ...album, photos: photos || [] };
          })
        );

        // Only show albums that have at least 1 photo
        setAlbums(albumsWithPhotos.filter(a => a.photos.length > 0));
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setAlbumsLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  // Dynamic categories from albums
  const categories = ['Tout', ...Array.from(new Set(albums.map(a => a.category)))];

  const filteredAlbums = activeCategory === 'Tout'
    ? albums
    : albums.filter(a => a.category === activeCategory);

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
      {/* Photo Viewer Lightbox */}
      <AnimatePresence>
        {viewerAlbum && (
          <PhotoViewer
            album={viewerAlbum}
            onClose={() => setViewerAlbum(null)}
          />
        )}
      </AnimatePresence>

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
                {categories.length > 1 && (
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                          activeCategory === cat
                            ? "bg-islamic-green text-white"
                            : "text-gray-400 hover:text-soft-black"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {albumsLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="w-10 h-10 text-islamic-green animate-spin" />
                  <p className="text-gray-400 font-medium">Chargement de la galerie...</p>
                </div>
              ) : filteredAlbums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Camera className="w-16 h-16 text-gray-200" />
                  <p className="text-gray-400 font-medium text-lg">
                    {activeCategory !== 'Tout' 
                      ? `Aucun album dans la catégorie "${activeCategory}".` 
                      : 'Aucune photo disponible pour le moment.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAlbums.map((album) => (
                    <motion.div
                      key={album.id}
                      whileHover={{ y: -10 }}
                      onClick={() => setViewerAlbum(album)}
                      className="group relative rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/3] cursor-pointer"
                    >
                      <img 
                        src={album.photos[0]?.url} 
                        alt={album.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      {/* Photo count badge */}
                      {album.photos.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 z-10">
                          <Images className="w-3.5 h-3.5" />
                          {album.photos.length} photos
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                        <div className="space-y-2">
                          <span className="text-islamic-gold text-xs font-bold uppercase tracking-widest">{album.category}</span>
                          <h3 className="text-white text-2xl font-serif font-bold">{album.title}</h3>
                          <p className="text-white/60 text-sm flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            {album.photos.length} photo{album.photos.length > 1 ? 's' : ''} — Cliquer pour voir
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
                  { title: 'La patience dans l\'épreuve', speaker: 'Imam Attawheed', duration: '45:00' },
                  { title: 'L\'éducation des enfants en Islam', speaker: 'Sheikh Haïti', duration: '32:15' },
                  { title: 'Les mérites du mois de Ramadan', speaker: 'Imam Attawheed', duration: '58:40' },
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
