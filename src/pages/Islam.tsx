import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Heart, Star, Moon, Sun, Clock, 
  ChevronDown, ChevronUp, Play, Info, CheckCircle2,
  GraduationCap, Users, HandHelping, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import VersetCoranCard from '../components/VersetCoranCard';
import AudioPlayer from '../components/AudioPlayer';
import IslamicPattern from '../components/IslamicPattern';

const Islam: React.FC = () => {
  const [activeTab, setActiveTab] = useState('piliers');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'piliers', name: 'Les 5 Piliers', icon: Star },
    { id: 'foi', name: 'Les 6 Piliers de la Foi', icon: ShieldCheck },
    { id: 'coran', name: 'Le Saint Coran', icon: Book },
    { id: 'hadiths', name: 'Hadiths & Sagesse', icon: GraduationCap },
    { id: 'faq', name: 'FAQ Islam', icon: Info },
  ];

  const pillars = [
    {
      name: 'La Chahada',
      arabic: 'الشهادة',
      description: 'L\'attestation de foi : "Il n\'y a de divinité qu\'Allah et Muhammad est Son messager."',
      icon: Star,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      name: 'La Salat',
      arabic: 'الصلاة',
      description: 'Les cinq prières quotidiennes obligatoires, lien direct entre le croyant et son Créateur.',
      icon: Clock,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      name: 'La Zakat',
      arabic: 'الزكاة',
      description: 'L\'aumône légale purificatrice versée annuellement aux nécessiteux.',
      icon: HandHelping,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      name: 'Le Sawm',
      arabic: 'الصوم',
      description: 'Le jeûne du mois de Ramadan, mois de piété, de patience et de partage.',
      icon: Moon,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      name: 'Le Hajj',
      arabic: 'الحج',
      description: 'Le pèlerinage à la Maison Sacrée d\'Allah à La Mecque, une fois dans la vie si possible.',
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  const faithPillars = [
    'La croyance en Allah (Dieu Unique)',
    'La croyance en Ses Anges',
    'La croyance en Ses Livres (Torah, Évangile, Psaumes, Coran)',
    'La croyance en Ses Messagers (Noé, Abraham, Moïse, Jésus, Muhammad...)',
    'La croyance au Jour Dernier (Jour de la Résurrection)',
    'La croyance au Destin (Qadar), qu\'il soit bon ou mauvais'
  ];

  const faqs = [
    {
      q: "Comment devenir musulman ?",
      a: "Devenir musulman est un acte simple et profond. Il suffit de prononcer la Chahada (l'attestation de foi) avec conviction et sincérité devant des témoins. La Mosquée At-Tawheed vous accompagne dans cette démarche avec bienveillance."
    },
    {
      q: "Quelles sont les heures d'ouverture de la mosquée ?",
      a: "La mosquée est ouverte pour les cinq prières quotidiennes, commençant environ 15 minutes avant l'heure de l'Adhan et fermant 30 minutes après la prière. Le bureau administratif est ouvert du Lundi au Vendredi de 9h à 16h."
    },
    {
      q: "Proposez-vous des cours pour les enfants ?",
      a: "Oui, nous avons une école coranique (Madrasa) le Samedi et le Dimanche matin pour les enfants de 5 à 15 ans, couvrant l'apprentissage du Coran, de l'Arabe et des valeurs islamiques."
    },
    {
      q: "Comment puis-je faire un don à la mosquée ?",
      a: "Vous pouvez faire un don directement sur ce site via MonCash ou PayPal, ou en personne à la mosquée. Chaque don contribue à l'entretien du lieu et à nos programmes sociaux."
    }
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
            <h1 className="text-5xl md:text-6xl font-serif font-bold">L'Islam : Foi & Pratique</h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              Découvrez les fondements de notre religion, la beauté du Saint Coran 
              et les enseignements du Prophète Muhammad (paix et bénédiction sur lui).
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
          {activeTab === 'piliers' && (
            <motion.div
              key="piliers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-4xl font-serif font-bold text-soft-black">Les 5 Piliers de l'Islam</h2>
                <p className="text-gray-500 text-lg">
                  Les fondations sur lesquelles repose la vie du musulman. Ils structurent notre relation 
                  avec Allah et avec la société.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pillars.map((pillar, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className={cn(
                      "p-10 rounded-[2.5rem] border-2 transition-all group relative overflow-hidden",
                      pillar.color
                    )}
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <pillar.icon className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="arabic-text text-3xl opacity-80">{pillar.arabic}</div>
                        <h3 className="text-2xl font-serif font-bold">{pillar.name}</h3>
                      </div>
                      <p className="text-soft-black/70 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'foi' && (
            <motion.div
              key="foi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-serif font-bold text-soft-black">Les 6 Piliers de la Foi (Iman)</h2>
                <p className="text-gray-500 text-lg">
                  L'aspect intérieur de la religion, ce que le musulman croit fermement dans son cœur.
                </p>
              </div>

              <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-gray-100 space-y-8 relative overflow-hidden">
                <IslamicPattern className="opacity-5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {faithPillars.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-islamic-green transition-all group">
                      <div className="w-10 h-10 bg-islamic-green text-white rounded-full flex items-center justify-center font-bold shrink-0 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="font-serif font-bold text-lg text-soft-black leading-tight pt-2">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'coran' && (
            <motion.div
              key="coran"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-4xl font-serif font-bold text-soft-black">Le Saint Coran</h2>
                <p className="text-gray-500 text-lg">
                  La parole d'Allah révélée au Prophète Muhammad (psl), guide et lumière pour l'humanité.
                </p>
              </div>

              <VersetCoranCard 
                arabe="ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ"
                traduction="C'est le Livre au sujet duquel il n'y a aucun doute, c'est un guide pour ceux qui craignent [Allah]."
                source="Sourate Al-Baqarah (2:2)"
                className="max-w-4xl mx-auto"
              />

              <div className="space-y-8">
                <h3 className="text-2xl font-serif font-bold text-center">Écouter la récitation</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AudioPlayer 
                    title="Sourate Al-Fatiha"
                    reciter="Mishary Rashid Alafasy"
                    audioUrl="https://server8.mp3quran.net/afs/001.mp3"
                  />
                  <AudioPlayer 
                    title="Sourate Ar-Rahman"
                    reciter="Mishary Rashid Alafasy"
                    audioUrl="https://server8.mp3quran.net/afs/055.mp3"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'hadiths' && (
            <motion.div
              key="hadiths"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h2 className="text-4xl font-serif font-bold text-soft-black">Hadiths du Jour</h2>
                <p className="text-gray-500 text-lg">
                  Les paroles, actes et approbations du Prophète Muhammad (psl), source de sagesse et de guidance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    text: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
                    source: "Rapporté par Al-Bukhari",
                    icon: Book
                  },
                  {
                    text: "La religion, c'est le bon comportement.",
                    source: "Hadith célèbre",
                    icon: Heart
                  },
                  {
                    text: "Nul d'entre vous n'est véritablement croyant tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
                    source: "Rapporté par Al-Bukhari et Muslim",
                    icon: Users
                  },
                  {
                    text: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
                    source: "Rapporté par At-Tirmidhi",
                    icon: HandHelping
                  }
                ].map((h, i) => (
                  <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-6 group hover:border-islamic-green transition-all">
                    <div className="w-16 h-16 bg-islamic-green/5 text-islamic-green rounded-2xl flex items-center justify-center group-hover:bg-islamic-green group-hover:text-white transition-all">
                      <h.icon className="w-8 h-8" />
                    </div>
                    <p className="text-xl font-serif italic text-soft-black leading-relaxed">
                      "{h.text}"
                    </p>
                    <p className="text-islamic-gold font-bold tracking-widest uppercase text-xs">
                      {h.source}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-serif font-bold text-soft-black">Questions Fréquentes</h2>
                <p className="text-gray-500 text-lg">
                  Des réponses simples aux questions courantes sur l'Islam et notre mosquée.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-serif font-bold text-xl text-soft-black">{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="w-6 h-6 text-islamic-green" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default Islam;
