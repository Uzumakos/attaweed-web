import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Accueil', path: '/' },
        { name: 'Islam', path: '/islam' },
        { name: 'Multimédia', path: '/multimedia' },
        { name: 'À propos', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Islam',
      links: [
        { name: 'Les 5 piliers', path: '/islam#piliers' },
        { name: 'Le Coran', path: '/islam#coran' },
        { name: 'Hadiths', path: '/islam#hadiths' },
        { name: 'FAQ', path: '/islam#faq' },
      ],
    },
    {
      title: 'Soutenir',
      links: [
        { name: 'Faire un Don', path: '/donation' },
        { name: 'Projets en cours', path: '/donation#projets' },
        { name: 'Devenir Membre', path: '/contact#membre' },
        { name: 'Bénévolat', path: '/contact#benevolat' },
      ],
    },
  ];

  return (
    <footer className="bg-islamic-dark text-white pt-20 pb-10 arabesque-pattern-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="Mosquée At-Tawheed"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h2 className="font-serif font-bold text-xl leading-tight">AT-TAWHEED</h2>
                <p className="text-[10px] tracking-widest uppercase opacity-80">Mosquée de Bois-Verna</p>
              </div>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Un espace de foi, d'éducation et de fraternité au cœur d'Haïti. 
              Soutenir la Oumma locale à travers la spiritualité et l'action sociale.
            </p>
            <div className="flex gap-4">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-islamic-gold transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="font-serif font-bold text-xl border-b border-white/10 pb-2">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-islamic-gold transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl border-b border-white/10 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-islamic-gold shrink-0" />
                <span>96, Avenue Lamartinière Bois Verna, Port-au-Prince, Haïti</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-islamic-gold shrink-0" />
                <span>+509 41 08 69 28 / 38 02 50 12</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-islamic-gold shrink-0" />
                <span>contact@attawheedhaiti.org</span>
              </li>
            </ul>
            <Link
              to="/donation"
              className="inline-flex items-center gap-2 bg-islamic-gold text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg"
            >
              <Heart className="w-4 h-4 fill-current" />
              Soutenir la Mosquée
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {currentYear} Mosquée Attawheed Haïti. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            Site conçu avec <Heart className="w-3 h-3 text-red-500 fill-current" /> pour la Oumma haïtienne
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
