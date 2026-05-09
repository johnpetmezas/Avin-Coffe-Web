/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Coffee, ArrowRight, X, Fuel, ShoppingBag, Sparkles } from 'lucide-react';

// Custom hook for PWA installation logic
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const showInstallPrompt = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  return { canInstall: !!deferredPrompt, showInstallPrompt };
}

export default function App() {
  const { canInstall, showInstallPrompt } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleOrderClick = () => {
    if (canInstall) {
      setShowModal(true);
    } else {
      window.location.href = '/order.html';
    }
  };

  const handleInstallChoice = async (install: boolean) => {
    setShowModal(false);
    if (install) {
      await showInstallPrompt();
    }
    window.location.href = '/order.html';
  };

  return (
    <div className="min-h-screen bg-avin-black text-white font-sans selection:bg-avin-brown selection:text-white">
      {/* Navigation */}
      <nav className="h-[70px] border-b border-avin-brown/20 flex items-center justify-between px-6 md:px-12 bg-avin-dark sticky top-0 z-40">
        <div className="text-xl font-bold tracking-tighter">
          <span className="text-avin-brown">AVIN</span> ΞΥΛΟΥΡΗΣ
        </div>
        <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
          <a href="#" className="hover:text-avin-brown transition-colors">Αρχική</a>
          <a href="#" className="hover:text-avin-brown transition-colors">Υπηρεσίες</a>
          <a href="#" className="hover:text-avin-brown transition-colors">Gallery</a>
          <a href="#" className="hover:text-avin-brown transition-colors">Επικοινωνία</a>
        </div>
      </nav>

      {/* PWA Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-avin-black w-full max-w-md p-10 md:p-14 shadow-2xl border-2 border-avin-brown text-center"
            >
              <h3 className="text-2xl font-black tracking-widest mb-4 uppercase">Εγκατάσταση Εφαρμογής</h3>
              <p className="text-white/70 font-light leading-relaxed mb-10 text-sm">
                Θέλετε να εγκαταστήσετε την εφαρμογή στην αρχική σας οθόνη για ταχύτερη παραγγελία;
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleInstallChoice(true)}
                  className="flex-1 btn-primary py-4 text-xs tracking-widest"
                >
                  ΝΑΙ
                </button>
                <button
                  onClick={() => handleInstallChoice(false)}
                  className="flex-1 border border-avin-brown text-avin-brown py-4 text-xs font-bold tracking-widest uppercase hover:bg-avin-brown/10 transition-all"
                >
                  ΟΧΙ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[450px] md:h-[550px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-avin-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-avin-black via-transparent to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&h=800&auto=format&fit=crop"
          alt="Atmospheric gas station cafe hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase italic">
              AVIN ΣΟΛΟΜΟΣ
            </h1>
            <button
              id="order-cta"
              onClick={handleOrderClick}
              className="btn-primary px-12 py-5 text-base md:text-lg flex items-center gap-4 mx-auto group shadow-[0_0_40px_rgba(194,163,130,0.2)]"
            >
              ΠΑΡΑΓΓΕΙΛΤΕ ΤΟΝ ΚΑΦΕ ΣΑΣ
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-avin-brown text-xs uppercase tracking-[0.4em] font-black mb-12 text-center"
        >
          Gallery
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1545459720-aac270a6c2c5?auto=format&fit=crop&q=80&w=1000"
          ].map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="aspect-video md:aspect-square overflow-hidden industrial-border bg-white/5"
            >
              <img
                src={src}
                alt={`Cafe atmosphere ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-avin-brown text-xs uppercase tracking-[0.4em] font-black mb-12 text-center"
        >
          Οι Υπηρεσίες μας
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: <Fuel size={32} />, 
              title: "ΚΑΥΣΙΜΑ AVIN", 
              desc: "Κορυφαία ποιότητα καυσίμων για μέγιστη απόδοση και οικονομία." 
            },
            { 
              icon: <Coffee size={32} />, 
              title: "PREMIUM COFFEE", 
              desc: "Εκλεκτό χαρμάνι καφέ, προετοιμασμένο από έμπειρους barista." 
            },
            { 
              icon: <ShoppingBag size={32} />, 
              title: "MINI MARKET", 
              desc: "Όλα τα απαραίτητα για τη διαδρομή σας, διαθέσιμα όλο το 24ωρο." 
            },
            { 
              icon: <Sparkles size={32} />, 
              title: "CAR CARE", 
              desc: "Εξειδικευμένα προϊόντα και υπηρεσίες φροντίδας για το όχημά σας." 
            }
          ].map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-10 industrial-border bg-avin-dark/50 flex flex-col items-center text-center group hover:bg-avin-brown/5 transition-all duration-500"
            >
              <div className="text-avin-brown mb-6 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold tracking-widest uppercase mb-4">{service.title}</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact & Footer Section */}
      <section className="bg-avin-dark border-t border-avin-brown/20 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-avin-brown text-xs uppercase tracking-[0.4em] font-black">Επικοινωνία</h2>
            <div className="space-y-2">
              <a 
                href="tel:2741031370" 
                className="text-4xl md:text-6xl font-light tracking-tighter hover:text-avin-brown transition-colors block"
              >
                27410 31370
              </a>
              <p className="text-lg md:text-xl opacity-60 font-light italic">Σολομός, Κορινθίας</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-end text-right"
          >
            <div className="mb-10 w-32 h-14 border border-avin-brown/40 flex items-center justify-center font-black tracking-tighter text-xl text-avin-brown">
              AVIN
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold mb-2">
              ΞΥΛΟΥΡΗΣ ΚΑΥΣΙΜΑ Ο.Ε.
            </p>
            <p className="text-lg text-avin-brown font-light italic">
              Ποιότητα σε κάθε σταγόνα
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
