import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, Target, Heart, Users, 
  Award, GraduationCap, HandHelping, 
  ArrowRight, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import IslamicPattern from '../components/IslamicPattern';

const About: React.FC = () => {
  const team = [
    { name: 'Imam At-Tawheed', role: 'Imam Principal', bio: 'Guide spirituel et enseignant du Coran depuis 15 ans.', image: 'https://picsum.photos/seed/imam/400/400' },
    { name: 'Moussa Jean', role: 'Président', bio: 'Responsable de la gestion administrative et des projets sociaux.', image: 'https://picsum.photos/seed/president/400/400' },
    { name: 'Fatima Louis', role: 'Responsable Femmes', bio: 'Organisatrice des activités éducatives et sociales pour les femmes.', image: 'https://picsum.photos/seed/women/400/400' },
    { name: 'Ibrahim Pierre', role: 'Trésorier', bio: 'Garant de la transparence financière et de la gestion des dons.', image: 'https://picsum.photos/seed/treasurer/400/400' },
  ];

  const timeline = [
    { year: '2010', title: 'Fondation', description: 'Création de la communauté At-Tawheed par un petit groupe de fidèles à Pétion-Ville.' },
    { year: '2015', title: 'Inauguration', description: 'Ouverture officielle de la mosquée actuelle après 3 ans de travaux.' },
    { year: '2018', title: 'École Coranique', description: 'Lancement du programme éducatif pour les enfants et les nouveaux convertis.' },
    { year: '2022', title: 'Aide Sociale', description: 'Mise en place du programme de distribution alimentaire hebdomadaire.' },
    { year: '2026', title: 'Aujourd\'hui', description: 'Un centre communautaire dynamique servant plus de 500 fidèles.' },
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
            <h1 className="text-5xl md:text-7xl font-serif font-bold">Notre Histoire</h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              Découvrez le parcours de la Mosquée At-Tawheed, un pilier de la foi 
              et de la solidarité en Haïti depuis plus d'une décennie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-islamic-green font-bold uppercase tracking-widest text-sm">
                  <Target className="w-5 h-5" />
                  <span>Mission & Vision</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black leading-tight">
                  Guider, Éduquer et <span className="text-islamic-green">Servir</span>
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed">
                  Notre mission est de fournir un espace sacré pour la prière, de promouvoir les valeurs 
                  de paix et de fraternité de l'Islam, et de soutenir activement le développement social 
                  de la communauté haïtienne.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Éducation Spirituelle', desc: 'Enseigner le Coran et la Sunna avec sagesse et modération.', icon: GraduationCap },
                  { title: 'Fraternité', desc: 'Créer un lien fort entre tous les membres, sans distinction d\'origine.', icon: Users },
                  { title: 'Action Sociale', desc: 'Être au service des plus démunis à travers des projets concrets.', icon: HandHelping },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-islamic-green transition-all group">
                    <div className="w-14 h-14 bg-white text-islamic-green rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-islamic-green group-hover:text-white transition-all shrink-0">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-soft-black">{item.title}</h3>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5]">
                <img 
                  src="https://picsum.photos/seed/mosque-about/800/1000" 
                  alt="Mosquée" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-islamic-gold rounded-full opacity-10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-islamic-green rounded-full opacity-10 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] arabesque-pattern opacity-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50 arabesque-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black mb-4">Notre Parcours</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Les étapes clés qui ont marqué l'évolution de notre mosquée au fil des années.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-islamic-gold/20 hidden md:block" />
            
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-8 md:gap-0",
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  <div className="flex-1 text-center md:text-right px-8">
                    {i % 2 === 0 && (
                      <div className="space-y-2">
                        <div className="text-3xl font-serif font-bold text-islamic-green">{item.year}</div>
                        <h3 className="text-xl font-bold text-soft-black">{item.title}</h3>
                        <p className="text-gray-500">{item.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-12 h-12 bg-islamic-gold rounded-full border-4 border-white shadow-xl z-10 flex items-center justify-center text-white font-bold shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left px-8">
                    {i % 2 !== 0 && (
                      <div className="space-y-2">
                        <div className="text-3xl font-serif font-bold text-islamic-green">{item.year}</div>
                        <h3 className="text-xl font-bold text-soft-black">{item.title}</h3>
                        <p className="text-gray-500">{item.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-soft-black mb-4">Notre Équipe</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Des hommes et des femmes dévoués au service de la communauté et de la foi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 text-center space-y-2">
                  <h3 className="text-xl font-serif font-bold text-soft-black group-hover:text-islamic-green transition-colors">{member.name}</h3>
                  <p className="text-islamic-gold font-bold text-xs uppercase tracking-widest">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-islamic-dark text-white relative overflow-hidden">
        <IslamicPattern dark className="opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Intégrité', desc: 'Transparence totale dans nos actions et notre gestion financière.', icon: ShieldCheck },
              { title: 'Compassion', desc: 'Un cœur ouvert à tous, particulièrement aux plus vulnérables.', icon: Heart },
              { title: 'Excellence', desc: 'Rechercher la perfection (Ihsan) dans tout ce que nous entreprenons.', icon: Award },
            ].map((value, i) => (
              <div key={i} className="text-center space-y-6">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <value.icon className="w-10 h-10 text-islamic-gold" />
                </div>
                <h3 className="text-3xl font-serif font-bold">{value.title}</h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
