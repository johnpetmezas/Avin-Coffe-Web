/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Coffee, ArrowRight, X, Fuel, ShoppingBag, Sparkles, ShoppingCart, Menu, Mail } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

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
    <div className="min-h-screen bg-avin-black text-white font-sans selection:bg-avin-brown selection:text-white overflow-x-hidden">
      {/* Hero Container with Header */}
      <section className="relative min-h-0 md:min-h-screen pb-12 md:pb-0 paper-texture text-avin-black overflow-hidden flex flex-col">
        {/* Navigation - Light Mode for Header strictly matching image */}
        <header className="relative z-30 h-24 md:h-28 flex items-center justify-between px-8 md:px-16">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="XYLOURIS Logo" className="h-12 w-auto object-contain md:h-15" />
            <div className="border-2 border-avin-brown text-avin-brown font-black px-3 py-0.5 md:py-1 rounded-md text-xs md:text-sm tracking-wider shadow-sm flex items-center justify-center translate-y-[10px]">
              AVIN
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 md:gap-10">
            <motion.button 
              whileHover={{ scale: 1.1, color: "#C2A382", opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-sm font-extrabold tracking-widest opacity-70 focus:outline-none"
            >
              Home
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, color: "#C2A382", opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-sm font-extrabold tracking-widest opacity-70 focus:outline-none"
            >
              Menu
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, color: "#C2A382", opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-sm font-extrabold tracking-widest opacity-70 focus:outline-none"
            >
              Deals
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, color: "#C2A382", opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-sm font-extrabold tracking-widest opacity-70 focus:outline-none"
            >
              Favourite
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 8, color: "#C2A382" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="cursor-pointer"
            >
              <ShoppingCart size={18} className="opacity-70 hover:opacity-100 transition-opacity" />
            </motion.div>
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-6 z-50">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer text-avin-black"
            >
              <ShoppingCart size={18} className="opacity-75" />
            </motion.div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-avin-black focus:outline-none p-1"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} className="text-avin-black" /> : <Menu size={22} className="text-avin-black" />}
            </button>
          </div>
        </header>

        {/* Mobile Nav Overlay Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-x-0 top-0 bg-[#E8E8E8] z-40 shadow-xl border-b border-black/10 flex flex-col pt-28 pb-8 px-8 gap-4 md:hidden"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}
            >
              {/* Top-Right "X" Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-8 right-8 text-avin-black hover:text-avin-brown focus:outline-none p-1"
                aria-label="Close Menu"
              >
                <X size={22} className="text-avin-black" />
              </button>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-avin-black text-left text-sm font-extrabold tracking-widest py-3 border-b border-black/5 uppercase"
              >
                Home
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-avin-black text-left text-sm font-extrabold tracking-widest py-3 border-b border-black/5 uppercase"
              >
                Menu
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-avin-black text-left text-sm font-extrabold tracking-widest py-3 border-b border-black/5 uppercase"
              >
                Deals
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
                className="text-avin-black text-left text-sm font-extrabold tracking-widest py-3 uppercase"
              >
                Favourite
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div className="flex-grow flex flex-col md:flex-row items-center px-8 md:px-24 py-6 md:py-12 relative">
          {/* Abstract background circles */}
          <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute border border-black/5 rounded-full" 
                     style={{ width: `${(i + 1) * 200}px`, height: `${(i + 1) * 200}px`, top: '0', left: '0' }} />
             ))}
          </div>

          {/* Left Column: Text Stack */}
          <div className="w-full md:w-1/2 z-20 flex flex-col relative">
            <div className="w-[1px] h-32 bg-black/10 absolute -left-12 top-10 hidden md:block" />
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-[44px] font-medium tracking-tight leading-[1.1] mb-0 uppercase">
                IT'S A BREAK<br />
                WITH <span className="font-black text-avin-black">COFFEE</span>
              </h2>
              
              <div className="flex flex-col mt-1 relative">
                <div className="absolute -left-12 top-4 bottom-4 w-[1px] bg-black/5 hidden md:block" />
                {["COFFEE", "COFFEE", "COFFEE", "COFFEE", "COFFEE"].map((text, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] ml-8 sm:ml-16 md:ml-32 ${
                      i < 2 ? 'text-avin-black' : 'text-avin-black/10'
                    }`}
                  >
                    {text}
                  </motion.span>
                ))}
              </div>

              <motion.button
                id="order-cta"
                onClick={handleOrderClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-6 md:mt-[60px] mb-0 mx-0 py-4 px-[49px] bg-[#2D241E] text-white font-bold tracking-widest text-xs uppercase hover:bg-black transition-all flex items-center gap-3 w-max rounded-sm shadow-lg shadow-black/10"
              >
                Order Now <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Creative Drink Display */}
          <div className="w-full md:w-1/2 relative h-[260px] md:h-[500px] mt-6 md:mt-0 flex items-center justify-center z-20">
            {/* The Drink with Composite Background */}
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              src="/hscf.png"
              alt="XYLOURIS Premium Coffee Experience"
              className="relative z-30 w-full max-w-[600px] max-h-[240px] md:max-h-none object-contain h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Bottom indicator strictly matching image */}
      </section>

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

      {/* Services Section */}
      <section 
        id="services-section" 
        className="relative py-24 w-full text-white bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url('/wall.png')" }}
      >
        {/* Subtle dark overlay for premium depth and maximum text readability */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-12 z-10">
          <motion.h2 
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="text-avin-brown text-xs uppercase tracking-[0.4em] font-black mb-16 text-center"
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }}
                whileHover={{ y: -8 }}
                className="p-10 bg-avin-dark/95 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer border border-white/10 rounded-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-avin-brown/30"
              >
                {/* Stunning Top Border Accent Line that reveals on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-avin-brown scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="text-avin-brown mb-6 group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold tracking-widest uppercase mb-4 text-white">{service.title}</h3>
                <p className="text-white/70 text-sm font-light leading-relaxed group-hover:text-white transition-colors duration-300">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Order Now focussing on Premium Quality */}
      <section className="bg-paper-texture py-24 px-8 md:px-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 paper-texture text-avin-black">
        <div className="md:w-1/2 z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Παραγγείλετε τον αγαπημένο σας<br />καφέ τώρα.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-avin-black/60 text-lg mb-10 max-w-lg leading-relaxed font-medium"
          >
            Φτιαγμένος από 100% διαλεγμένους στο χέρι premium κόκκους, φρεσκοκαβουρδισμένους σε μικρές παρτίδες για να διατηρείται το απόλυτο άρωμα και η πλούσια γεύση σε κάθε φλιτζάνι.
          </motion.p>
          
          <motion.button
            onClick={handleOrderClick}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#2D241E] text-white px-8 py-3 font-bold tracking-widest text-xs uppercase hover:bg-black transition-all flex items-center gap-3 rounded-sm"
          >
            GET YOUR PREMIUM BLEND <ArrowRight size={14} />
          </motion.button>
        </div>

        <div className="md:w-1/2 h-[280px] md:h-[400px] relative flex items-center justify-center">
          {/* Floating coffee bag and beans mockup feel */}
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            src="/Gemini_Generated_Image_rmfetzrmfetzrmfe-Photoroom.png"
            className="w-full max-w-[500px] max-h-[260px] md:max-h-none object-contain z-10 drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Main Footer - Professional 4-Column Layout */}
      <footer className="bg-[#1A1614] py-24 px-8 md:px-24 text-white/80">
        <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-16">
          {/* Brand Info */}
          <div className="col-span-3 md:col-span-1 space-y-8">
            <h2 className="text-3xl font-black tracking-tighter text-white">XYLOURIS</h2>
            <p className="text-sm font-light leading-relaxed max-w-xs opacity-60">
              Ζήστε την απόλυτη εμπειρία της τέχνης του καφέ. Από τον κόκκο έως το φλιτζάνι, διατηρούμε τα υψηλότερα πρότυπα ποιότητας για να διασφαλίσουμε ότι κάθε γουλιά ξυπνά τις αισθήσεις σας.
            </p>
          </div>

          {/* Page Links */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Page</h4>
            <div className="flex flex-col gap-4 text-sm font-medium opacity-60">
              <a href="#" className="hover:text-avin-brown transition-colors">Home</a>
              <a href="#" className="hover:text-avin-brown transition-colors">Menu</a>
              <a href="#" className="hover:text-avin-brown transition-colors">Deals</a>
              <a href="#" className="hover:text-avin-brown transition-colors">Favourite</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Links</h4>
            <div className="flex flex-col gap-4 text-sm font-medium opacity-60">
              <a href="#" className="hover:text-avin-brown transition-colors">Facebook</a>
              <a href="#" className="hover:text-avin-brown transition-colors">Instagram</a>
              <a href="#" className="hover:text-avin-brown transition-colors">LinkedIn</a>
            </div>
          </div>

          {/* Contacts */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white">Contacts</h4>
            <div className="flex flex-col gap-6 text-sm font-medium opacity-60">
              <div className="flex flex-col md:flex-row items-start gap-1 md:gap-4">
                <MapPin size={18} className="text-avin-brown shrink-0" />
                <span className="text-xs md:text-sm font-light">Σολομός, Κορινθίας</span>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
                <Phone size={18} className="text-avin-brown shrink-0" />
                <a href="tel:2741031370" className="hover:text-white text-xs md:text-sm">27410 31370</a>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
                <Mail size={18} className="text-avin-brown shrink-0" />
                <a href="mailto:info@xylouris.gr" className="hover:text-white text-xs md:text-sm break-all">info@xylouris.gr</a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] opacity-30 font-bold">
          <p>© 2024 XYLOURIS COFFEE ROASTERS</p>
          <div className="flex gap-8">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
