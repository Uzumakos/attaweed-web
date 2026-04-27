import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sun, Moon, Sunrise, Sunset, Book, Users, Heart, 
  ArrowRight, Calendar, Play, MessageCircle, Info,
  CheckCircle2, Award, GraduationCap, HandHelping
} from 'lucide-react';
import { cn } from '../lib/utils';
import VersetCoranCard from '../components/VersetCoranCard';
import PrayerTimeCard from '../components/PrayerTimeCard';
import { supabase } from '../supabase';

const Home: React.FC = () => {
  const [nextPrayer, setNextPrayer] = useState({ name: 'Dhuhr', time: '12:30' });

  const stats = [
    { label: 'Membres Actifs', value: 450, icon: Users },
    { label: 'Années de Service', value: 15, icon: Award },
    { label: 'Cours Dispensés', value: 120, icon: GraduationCap },
    { label: 'Bénéficiaires', value: 2500, icon: HandHelping },
  ];

  const services = [
    {
      title: 'Prières Quotidiennes',
      description: 'Les 5 prières quotidiennes et la prière du Vendredi (Jumu\'ah) dans un cadre serein.',
      icon: Moon,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Cours d\'Islam',
      description: 'Enseignement du Coran, de la langue arabe et des fondements de la foi pour tous les âges.',
      icon: Book,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Activités Jeunesse',
      description: 'Programmes éducatifs et sportifs pour guider la nouvelle génération dans la foi.',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Aide Sociale',
      description: 'Soutien aux familles nécessiteuses, distribution de repas et assistance communautaire.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    published_at: string;
    category: string;
    image_url: string;
    slug: string;
  }

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await supabase
          .from('news_articles')
          .select('id, title, excerpt, published_at, category, image_url, slug')
          .eq('status', 'Publié')
          .order('published_at', { ascending: false })
          .limit(3);
        setNews(data || []);
      } catch {
        setNews([]);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-islamic-dark arabesque-pattern-dark">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://picsum.photos/seed/mosque-hero/1920/1080" 
            alt="Mosquée" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-islamic-gold font-medium text-sm mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Un espace de paix et de fraternité</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Bienvenue à la <span className="text-islamic-gold">Mosquée Attawheed</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
              Un espace de foi, d'éducation et de fraternité au cœur d'Haïti. 
              Ensemble pour une communauté forte et épanouie.
            </p>

            <div className="arabic-text text-4xl md:text-6xl text-islamic-gold py-6 opacity-90">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/about"
                className="w-full sm:w-auto bg-islamic-green hover:bg-islamic-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Découvrir la Mosquée
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/islam"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                Horaires des Prières
                <Calendar className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Prayer Times Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black mb-4">Horaires des Prières</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Retrouvez les horaires exacts des cinq prières quotidiennes à Bois-Verna, Haïti.
              Date Hijri: 14 Ramadan 1447
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            <PrayerTimeCard name="Fajr" time="05:12" icon={Sunrise} active={false} />
            <PrayerTimeCard name="Dhuhr" time="12:30" icon={Sun} active={true} />
            <PrayerTimeCard name="Asr" time="15:45" icon={Sun} active={false} />
            <PrayerTimeCard name="Maghrib" time="18:15" icon={Sunset} active={false} />
            <PrayerTimeCard name="Isha" time="19:30" icon={Moon} active={false} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50 arabesque-pattern">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black mb-4">Nos Services & Activités</h2>
              <p className="text-gray-600 text-lg">
                La Mosquée Attawheed n'est pas seulement un lieu de prière, c'est un centre communautaire 
                dédié au bien-être spirituel et social de tous.
              </p>
            </div>
            <Link to="/about" className="text-islamic-green font-bold flex items-center gap-2 hover:gap-3 transition-all">
              En savoir plus <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl group"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", service.color)}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verset Section */}
      <section className="py-24 bg-islamic-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern-dark opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-islamic-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Book className="w-10 h-10 text-white" />
            </div>
            <div className="arabic-text text-4xl md:text-6xl text-islamic-gold leading-relaxed">
              إِنَّ مَعَ الْعُسْرِ يُسْرًا
            </div>
            <h3 className="text-3xl md:text-4xl font-serif italic">
              "Certes, avec la difficulté, il y a une facilité."
            </h3>
            <p className="text-islamic-gold/80 font-medium tracking-widest uppercase text-sm">
              Sourate Ash-Sharh (94:6)
            </p>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black">Actualités & Événements</h2>
            <Link to="/actualites" className="hidden md:flex items-center gap-2 text-islamic-green font-bold hover:gap-3 transition-all">
              Tout voir <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="h-64 bg-gray-100 animate-pulse" />
                  <div className="p-8 space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
                    <div className="h-6 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded-full w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 text-gray-400 space-y-3">
              <p className="text-5xl">🕌</p>
              <p className="text-lg font-medium">Aucun article publié pour le moment.</p>
              <p className="text-sm">Revenez bientôt pour nos actualités.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-islamic-green/10 to-islamic-green/5 flex items-center justify-center">
                        <span className="text-6xl">🕌</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-islamic-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold group-hover:text-islamic-green transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 line-clamp-2">{item.excerpt}</p>
                    <Link
                      to={`/actualites/${item.slug || item.id}`}
                      className="inline-flex items-center gap-2 text-islamic-green font-bold pt-2 group/btn"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/actualites" className="inline-flex items-center gap-2 bg-gray-100 text-soft-black px-8 py-4 rounded-full font-bold">
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-islamic-green text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-8 h-8 text-islamic-gold" />
                </div>
                <div className="text-4xl md:text-5xl font-serif font-bold text-white">
                  {stat.value}+
                </div>
                <div className="text-islamic-gold/80 font-medium uppercase tracking-widest text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-gray-100 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-soft-black leading-tight">
                Soutenez la Maison d'Allah <br /> en Haïti
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed">
                Votre générosité permet à la Mosquée Attawheed de continuer sa mission spirituelle 
                et ses actions sociales au service de la Oumma haïtienne.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/donation"
                  className="bg-islamic-green hover:bg-islamic-dark text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <Heart className="w-6 h-6 fill-current" />
                  Faire un Don
                </Link>
                <Link
                  to="/contact"
                  className="bg-white border-2 border-gray-100 hover:border-islamic-green text-soft-black px-10 py-5 rounded-full font-bold text-xl transition-all flex items-center justify-center gap-3"
                >
                  Nous Contacter
                  <MessageCircle className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/donation-cta/800/800" 
                  alt="Donation" 
                  className="w-full aspect-square object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-islamic-gold rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-islamic-green rounded-full opacity-10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/50912345678"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
      </a>
    </div>
  );
};

export default Home;
