import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, MessageCircle, 
  Send, Facebook, Youtube, Instagram, 
  Clock, CheckCircle2, AlertCircle, ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import IslamicPattern from '../components/IslamicPattern';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    {
      title: 'Adresse',
      desc: 'Pétion-Ville, Port-au-Prince, Haïti',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Téléphone',
      desc: '+509 1234-5678',
      icon: Phone,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Email',
      desc: 'contact@attawheedhaiti.org',
      icon: Mail,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'WhatsApp',
      desc: '+509 8765-4321',
      icon: MessageCircle,
      color: 'bg-green-50 text-green-600',
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
            <h1 className="text-5xl md:text-7xl font-serif font-bold">Contactez-Nous</h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              Une question, un besoin d'assistance spirituelle ou une proposition 
              de partenariat ? Nous sommes à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Info Column */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold text-soft-black">Informations de Contact</h2>
                <p className="text-gray-500">
                  N'hésitez pas à nous contacter par le moyen qui vous convient le mieux. 
                  Notre équipe vous répondra dans les plus brefs délais.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-islamic-green transition-all group">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0", info.color)}>
                      <info.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-bold text-soft-black">{info.title}</h3>
                      <p className="text-gray-500 font-medium">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-islamic-dark p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                <IslamicPattern dark className="opacity-10" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 text-islamic-gold">
                    <Clock className="w-6 h-6" />
                    <h3 className="text-xl font-serif font-bold">Horaires du Bureau</h3>
                  </div>
                  <ul className="space-y-2 text-white/70 font-medium">
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span>Lundi - Vendredi</span>
                      <span className="text-white">09:00 - 16:00</span>
                    </li>
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span>Samedi</span>
                      <span className="text-white">10:00 - 14:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dimanche</span>
                      <span className="text-white">Fermé</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-100 relative overflow-hidden">
                <IslamicPattern className="opacity-5" />
                <div className="relative z-10 space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-bold text-soft-black">Envoyez-nous un Message</h2>
                    <p className="text-gray-500">Remplissez le formulaire ci-dessous et nous vous recontacterons.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nom Complet</label>
                        <input
                          required
                          type="text"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-islamic-green focus:outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</label>
                        <input
                          required
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-islamic-green focus:outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Téléphone</label>
                        <input
                          type="tel"
                          placeholder="+509 0000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-islamic-green focus:outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sujet</label>
                        <select
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-islamic-green focus:outline-none transition-all font-medium appearance-none"
                        >
                          <option value="">Choisir un sujet</option>
                          <option value="Général">Information Générale</option>
                          <option value="Don">Question sur les Dons</option>
                          <option value="Spiritualité">Assistance Spirituelle</option>
                          <option value="Partenariat">Partenariat / Bénévolat</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Message</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Comment pouvons-nous vous aider ?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-islamic-green focus:outline-none transition-all font-medium resize-none"
                      />
                    </div>

                    <button
                      disabled={status === 'loading'}
                      type="submit"
                      className={cn(
                        "w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-3 group",
                        status === 'loading' ? "bg-gray-300 cursor-not-allowed" : "bg-islamic-green text-white hover:bg-islamic-dark"
                      )}
                    >
                      {status === 'loading' ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Envoyer le Message
                          <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {status === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-3 font-bold"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                        Votre message a été envoyé avec succès !
                      </motion.div>
                    )}

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-bold"
                      >
                        <AlertCircle className="w-6 h-6" />
                        Une erreur est survenue. Veuillez réessayer.
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 h-[500px] relative">
            {/* Placeholder for Google Maps */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-islamic-green mx-auto" />
                <p className="text-xl font-serif font-bold text-soft-black">Carte Google Maps Interactive</p>
                <p className="text-gray-500">Pétion-Ville, Port-au-Prince, Haïti</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-islamic-green text-white px-6 py-3 rounded-full font-bold hover:bg-islamic-dark transition-all"
                >
                  Ouvrir dans Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
