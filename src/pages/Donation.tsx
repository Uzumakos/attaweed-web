import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, ShieldCheck, Globe, Users, 
  ArrowRight, CheckCircle2, Award, 
  GraduationCap, HandHelping, Banknote
} from 'lucide-react';
import DonationWidget from '../components/DonationWidget';
import IslamicPattern from '../components/IslamicPattern';

const Donation: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: 'Rénovation de la salle de prière',
      description: 'Amélioration de l\'éclairage, de la climatisation et du système audio pour un meilleur confort.',
      goal: 500000,
      current: 375000,
      imageUrl: 'https://picsum.photos/seed/renovation/800/600',
    },
    {
      id: 2,
      title: 'Programme d\'aide alimentaire',
      description: 'Distribution hebdomadaire de colis alimentaires aux familles les plus démunies de Pétion-Ville.',
      goal: 200000,
      current: 120000,
      imageUrl: 'https://picsum.photos/seed/food/800/600',
    },
    {
      id: 3,
      title: 'Bourses d\'études islamiques',
      description: 'Soutien financier pour les étudiants méritants souhaitant approfondir leurs connaissances.',
      goal: 150000,
      current: 45000,
      imageUrl: 'https://picsum.photos/seed/scholarship/800/600',
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <section className="bg-islamic-dark py-32 relative overflow-hidden">
        <IslamicPattern dark className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold">Soutenir la <span className="text-islamic-gold">Maison d'Allah</span></h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              "Ceux qui dépensent leurs biens dans le sentier d'Allah ressemblent à un grain 
              qui fait germer sept épis, à cent grains chaque épi." (Coran 2:261)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 bg-gray-50 relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black leading-tight">
                  Votre Don fait la <span className="text-islamic-green">Différence</span>
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed">
                  Chaque gourde investie dans la Mosquée Attawheed contribue à la pérennité 
                  de notre communauté et au soutien des plus vulnérables.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Transparence', desc: 'Rapports financiers réguliers sur l\'utilisation des fonds.', icon: ShieldCheck },
                  { title: 'Impact Local', desc: 'Actions directes au cœur de la communauté haïtienne.', icon: Globe },
                  { title: 'Sadaqa Jariya', desc: 'Une récompense continue pour vos bonnes œuvres.', icon: Heart },
                  { title: 'Sécurité', desc: 'Paiements sécurisés via des plateformes reconnues.', icon: Banknote },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-islamic-green/5 text-islamic-green rounded-2xl flex items-center justify-center mb-4 group-hover:bg-islamic-green group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-soft-black">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <DonationWidget />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projets" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black mb-4">Projets en Cours</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Soutenez des projets spécifiques qui répondent aux besoins urgents de notre mosquée et de notre communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-islamic-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {Math.round((project.current / project.goal) * 100)}% Atteint
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-soft-black group-hover:text-islamic-green transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-islamic-green">{project.current.toLocaleString()} HTG</span>
                      <span className="text-gray-400">Objectif: {project.goal.toLocaleString()} HTG</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(project.current / project.goal) * 100}%` }}
                        viewport={{ once: true }}
                        className="h-full bg-islamic-green rounded-full"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-gray-100 text-soft-black py-4 rounded-2xl font-bold hover:bg-islamic-green hover:text-white transition-all flex items-center justify-center gap-2">
                    Soutenir ce projet
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-islamic-green text-white relative overflow-hidden">
        <IslamicPattern dark className="opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                L'Impact de votre <span className="text-islamic-gold">Générosité</span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Grâce à vos dons, nous avons pu réaliser des actions concrètes au cours de l'année passée. 
                Votre soutien est le moteur de notre développement.
              </p>
              <div className="space-y-4">
                {[
                  'Plus de 5000 repas distribués aux nécessiteux.',
                  'Rénovation complète de la toiture de la mosquée.',
                  'Soutien scolaire pour 50 enfants de la communauté.',
                  'Achat de 200 nouveaux exemplaires du Coran.',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-islamic-gold rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center">
                  <div className="text-4xl font-serif font-bold text-islamic-gold mb-2">100%</div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-70">Des dons réinvestis</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center">
                  <div className="text-4xl font-serif font-bold text-islamic-gold mb-2">1500+</div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-70">Donateurs uniques</p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center">
                  <div className="text-4xl font-serif font-bold text-islamic-gold mb-2">12</div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-70">Projets réalisés</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center">
                  <div className="text-4xl font-serif font-bold text-islamic-gold mb-2">24/7</div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-70">Soutien spirituel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donation;
