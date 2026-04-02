import React, { useState } from 'react';
import { Heart, CreditCard, Smartphone, Banknote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DonationWidget: React.FC = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | string>(1000);
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [destination, setDestination] = useState('Général');

  const amounts = [500, 1000, 2500, 5000];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-islamic-green p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern-dark opacity-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold">Soutenir At-Tawheed</h3>
            <p className="text-white/70 text-sm">Étape {step} sur 3</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 fill-current text-islamic-gold" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button
                  onClick={() => setFrequency('once')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    frequency === 'once' ? "bg-white text-islamic-green shadow-sm" : "text-gray-500 hover:text-soft-black"
                  )}
                >
                  Don Unique
                </button>
                <button
                  onClick={() => setFrequency('monthly')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    frequency === 'monthly' ? "bg-white text-islamic-green shadow-sm" : "text-gray-500 hover:text-soft-black"
                  )}
                >
                  Don Mensuel
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Choisir un montant (HTG)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={cn(
                        "py-4 rounded-2xl font-bold border-2 transition-all",
                        amount === a ? "border-islamic-green bg-islamic-green/5 text-islamic-green" : "border-gray-100 hover:border-islamic-gold"
                      )}
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Autre montant"
                    value={typeof amount === 'number' && amounts.includes(amount) ? '' : amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold focus:border-islamic-green focus:outline-none transition-all"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">HTG</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-islamic-green text-white py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-islamic-dark transition-all flex items-center justify-center gap-3 group"
              >
                Continuer
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Destination du don</p>
                <div className="grid grid-cols-1 gap-3">
                  {['Général', 'Entretien Mosquée', 'Éducation', 'Aide Sociale'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDestination(d)}
                      className={cn(
                        "flex items-center justify-between p-5 rounded-2xl font-bold border-2 transition-all",
                        destination === d ? "border-islamic-green bg-islamic-green/5 text-islamic-green" : "border-gray-100 hover:border-islamic-gold"
                      )}
                    >
                      {d}
                      {destination === d && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 text-soft-black py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all"
                >
                  Retour
                </button>
                <button
                  onClick={handleNext}
                  className="flex-[2] bg-islamic-green text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-islamic-dark transition-all flex items-center justify-center gap-3"
                >
                  Paiement
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Méthode de paiement</p>
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-islamic-green transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">MonCash</p>
                      <p className="text-xs text-gray-400">Paiement mobile sécurisé</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-islamic-green transition-all group">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">PayPal / Carte</p>
                      <p className="text-xs text-gray-400">Visa, Mastercard, Amex</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-islamic-green transition-all group">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Virement Bancaire</p>
                      <p className="text-xs text-gray-400">Sogebank, Unibank, Capital Bank</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Montant du don:</span>
                  <span className="font-bold text-soft-black">{Number(amount).toLocaleString()} HTG</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Fréquence:</span>
                  <span className="font-bold text-soft-black">{frequency === 'once' ? 'Unique' : 'Mensuel'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Destination:</span>
                  <span className="font-bold text-soft-black">{destination}</span>
                </div>
              </div>

              <button
                onClick={handleBack}
                className="w-full bg-gray-100 text-soft-black py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all"
              >
                Retour
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400 leading-relaxed">
          En faisant un don, vous acceptez nos conditions d'utilisation. 
          Un reçu fiscal vous sera envoyé par email automatiquement. 
          Qu'Allah accepte vos œuvres.
        </p>
      </div>
    </div>
  );
};

export default DonationWidget;
