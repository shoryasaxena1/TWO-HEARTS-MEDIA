import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Smartphone, Zap, Star, Play, Instagram, CheckCircle, Menu, X, 
  ChevronRight, Lock, User, MessageSquare, Flame, Film, Facebook, Send,
  Plus, Trash2, Save, Layout, Image as ImageIcon, ArrowRight, Phone, Copy, ExternalLink,
  Maximize2
} from 'lucide-react';

// --- INITIAL CONFIG DATA ---
const INITIAL_SITE_DATA = {
  hero: {
    title: "Turning Real Emotions Into Cinematic Reels.",
    subtitle: "High-quality iPhone cinematography designed for the modern couple. We capture authentic vibes and deliver viral-worthy edits before the party even ends.",
    badge: "Viral Wedding Content Creators"
  },
  philosophy: [
    { id: 1, title: "iPhone Cinematography", desc: "Professional mobile workflows for that aesthetic social look." },
    { id: 2, title: "Instant Delivery", desc: "Get your edited reels ready for posting while the vibes are still high." },
    { id: 3, title: "Viral Trending Edits", desc: "We use trending audios and fast-paced transitions that engagement loves." }
  ],
  reels: [
    { id: 1, title: "Cinematic Highlight", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", type: "embed" },
    { id: 2, title: "The Grand Entrance", url: "https://images.unsplash.com/photo-1519225495806-7d52232a0379?auto=format&fit=crop&q=80&w=600", type: "image" },
    { id: 3, title: "Sunset Vows", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600", type: "image" }
  ],
  testimonials: [
    { id: 1, name: "Simran & Arjun", text: "They delivered our reception reel the next morning! Our guests were shocked at the quality." },
    { id: 2, name: "Kunal V.", text: "The transition work is insane. They captured the raw emotions perfectly." }
  ]
};

// Helper to determine content type and format URLs
const getMediaSource = (url) => {
  if (!url) return { type: 'unknown', src: '' };
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return { type: 'embed', src: `https://www.youtube.com/embed/${id}?autoplay=1` };
  }
  
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop();
    return { type: 'embed', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
  }

  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return { type: 'video', src: url };
  }

  return { type: 'image', src: url };
};

export default function App() {
  const [page, setPage] = useState('home');
  const [siteData, setSiteData] = useState(INITIAL_SITE_DATA);
  const [leads, setLeads] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [page]);

  const handleNav = (target) => {
    setPage('home');
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 bg-[#F1E4D1] text-[#1F2937]">
      <Navbar setPage={setPage} handleNav={handleNav} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      
      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero data={siteData.hero} reels={siteData.reels} handleNav={handleNav} />
            <TrustBar />
            <div id="process"><CorePhilosophy points={siteData.philosophy} /></div>
            <div id="portfolio"><ReelGallery reels={siteData.reels} setSelectedReel={setSelectedReel} /></div>
            <Testimonials list={siteData.testimonials} />
            <div id="booking"><BookingSection setLeads={setLeads} leads={leads} /></div>
            <Footer handleNav={handleNav} />
          </motion.div>
        )}

        {page === 'admin-login' && <AdminLogin setPage={setPage} />}
        {page === 'dashboard' && (
          <Dashboard 
            setPage={setPage} 
            leads={leads} 
            siteData={siteData} 
            setSiteData={setSiteData} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedReel && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10">
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setSelectedReel(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white z-[1001]"
            >
              <X size={40} />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative aspect-[9/16] h-full max-h-[85vh] rounded-[2rem] overflow-hidden bg-black border-4 border-white/10 shadow-2xl"
            >
              {(() => {
                const media = getMediaSource(selectedReel.url);
                if (media.type === 'embed') {
                  return <iframe src={media.src} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />;
                } else if (media.type === 'video') {
                  return <video src={media.src} className="w-full h-full object-cover" controls autoPlay loop />;
                } else {
                  return <img src={media.src} className="w-full h-full object-cover" alt={selectedReel.title} />;
                }
              })()}
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 pointer-events-none">
                <h3 className="text-white text-3xl font-serif mb-1">{selectedReel.title}</h3>
                <p className="text-white/50 text-xs font-black uppercase tracking-[0.2em]">Press play to experience</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar({ setPage, handleNav, setIsMenuOpen, isMenuOpen }) {
  return (
    <nav className="fixed w-full z-[100] bg-white/80 backdrop-blur-md py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
          <div className="p-2 rounded-full text-white bg-[#162660]"><Heart size={20} fill="currentColor" /></div>
          <span className="font-serif text-xl font-bold text-[#162660] tracking-tighter uppercase">TWO HEART MEDIA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-bold text-[10px] uppercase tracking-widest text-[#162660]">
          <button onClick={() => handleNav('process')}>The Process</button>
          <button onClick={() => handleNav('portfolio')}>Portfolio</button>
          <button onClick={() => handleNav('booking')} className="px-6 py-3 rounded-full text-white bg-[#162660]">Book Now</button>
          <button onClick={() => setPage('admin-login')} className="opacity-20 hover:opacity-100 transition-opacity"><Lock size={14} /></button>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
      </div>
    </nav>
  );
}

function Hero({ data, reels, handleNav }) {
  return (
    <section className="relative min-h-screen flex items-center pt-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[10px] font-black uppercase tracking-widest mb-8 text-[#162660] shadow-sm">
            <Star size={12} className="text-yellow-500 fill-current" /> {data.badge}
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-[0.95] mb-8 text-[#162660]">{data.title}</h1>
          <p className="text-lg text-gray-600 mb-10 max-w-md">{data.subtitle}</p>
          <button onClick={() => handleNav('booking')} className="px-10 py-5 rounded-full bg-[#162660] text-white font-bold flex items-center gap-3 hover:scale-105 transition-all">
            Get Started <ArrowRight size={20} />
          </button>
        </motion.div>
        <div className="hidden lg:block relative">
          <div className="aspect-[9/16] w-[350px] mx-auto rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl">
             <img src={reels[0]?.url || ""} className="w-full h-full object-cover" alt="Hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="py-8 bg-white border-y overflow-hidden flex whitespace-nowrap gap-16 text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em]">
      {[...Array(10)].map((_, i) => <span key={i}>Premium Edits • iPhone 15 Pro • 24H Delivery</span>)}
    </div>
  );
}

function CorePhilosophy({ points }) {
  return (
    <section className="py-32 px-6 bg-[#162660] text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {points.map((p) => (
          <div key={p.id} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <h3 className="text-2xl font-serif mb-4">{p.title}</h3>
            <p className="text-blue-100/60 leading-relaxed text-sm">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReelGallery({ reels, setSelectedReel }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-serif text-[#162660] mb-16">The Portfolio</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {reels.map((reel) => (
            <motion.div 
              key={reel.id} 
              whileHover={{ y: -5 }}
              onClick={() => setSelectedReel(reel)}
              className="aspect-[9/16] rounded-3xl bg-gray-200 overflow-hidden relative group cursor-pointer shadow-lg"
            >
              {getMediaSource(reel.url).type === 'image' || getMediaSource(reel.url).type === 'embed' ? (
                <img src={reel.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
              ) : (
                <video src={reel.url} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                 <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <Play size={20} className="text-[#162660] fill-current ml-1" />
                 </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <p className="font-serif italic">{reel.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ list }) {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {list.map((t) => (
          <div key={t.id} className="p-10 bg-[#F9F7F4] rounded-[3rem] border border-gray-100">
            <p className="text-lg text-gray-600 italic mb-6">"{t.text}"</p>
            <p className="font-black uppercase text-[10px] tracking-widest text-[#162660]">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingSection({ setLeads, leads }) {
  const [sent, setSent] = useState(false);
  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-[3.5rem] p-12 md:p-20 shadow-2xl text-center">
        {!sent ? (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
            <h2 className="text-5xl font-serif text-[#162660] mb-10">Say Hello</h2>
            <input required placeholder="Your Name" className="w-full p-5 bg-gray-50 rounded-2xl outline-none" />
            <input required type="email" placeholder="Email Address" className="w-full p-5 bg-gray-50 rounded-2xl outline-none" />
            <select className="w-full p-5 bg-gray-50 rounded-2xl outline-none appearance-none">
              <option>Wedding Content Creation</option>
              <option>Engagement Highlights</option>
              <option>Corporate Branding</option>
            </select>
            <button className="w-full py-5 bg-[#162660] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#1f2937] transition-all">Submit Inquiry</button>
          </form>
        ) : (
          <div className="py-10">
            <CheckCircle size={60} className="mx-auto text-green-500 mb-6" />
            <h3 className="text-3xl font-serif text-[#162660]">Inquiry Sent</h3>
            <p className="text-gray-500 mt-2">We'll be in touch within 24 hours.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer({ handleNav }) {
  return (
    <footer className="py-20 bg-white border-t text-center">
       <span className="font-serif text-lg font-bold text-[#162660]">TWO HEART MEDIA</span>
       <div className="flex justify-center gap-6 mt-6 text-[10px] font-black uppercase text-gray-400">
         <button onClick={() => handleNav('portfolio')}>Work</button>
         <button onClick={() => handleNav('booking')}>Inquire</button>
       </div>
    </footer>
  );
}

function AdminLogin({ setPage }) {
  const [val, setVal] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl w-full max-w-md text-center">
        <Lock size={32} className="mx-auto mb-6 text-[#162660]" />
        <h2 className="text-2xl font-serif mb-8">Access Vault</h2>
        <input type="password" placeholder="Passcode" className="w-full p-4 bg-gray-50 rounded-xl mb-4 text-center" onChange={e => setVal(e.target.value)} />
        <button onClick={() => val === 'twoheartsmedia.7806' && setPage('dashboard')} className="w-full py-4 bg-[#162660] text-white rounded-xl font-bold uppercase tracking-widest">Enter</button>
      </div>
    </div>
  );
}

function Dashboard({ setPage, leads, siteData, setSiteData }) {
  const [newReel, setNewReel] = useState({ title: '', url: '' });

  const addReel = () => {
    if (!newReel.title || !newReel.url) return;
    setSiteData(prev => ({
      ...prev,
      reels: [{ ...newReel, id: Date.now() }, ...prev.reels]
    }));
    setNewReel({ title: '', url: '' });
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-serif text-[#162660]">Dashboard</h1>
          <button onClick={() => setPage('home')} className="px-6 py-2 bg-gray-100 rounded-full text-xs font-bold uppercase">Logout</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
               <h3 className="text-xl font-serif mb-6">Manage Library</h3>
               <div className="space-y-4">
                  <input placeholder="Video Title" className="w-full p-4 bg-gray-50 rounded-xl" value={newReel.title} onChange={e => setNewReel({...newReel, title: e.target.value})} />
                  <div className="flex gap-2">
                    <input placeholder="YouTube Link or Video URL" className="flex-1 p-4 bg-gray-50 rounded-xl" value={newReel.url} onChange={e => setNewReel({...newReel, url: e.target.value})} />
                    <button onClick={addReel} className="bg-[#162660] text-white px-6 rounded-xl"><Plus/></button>
                  </div>
               </div>

               <div className="mt-10 grid grid-cols-4 gap-3">
                 {siteData.reels.map(r => (
                   <div key={r.id} className="aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden relative group">
                     {getMediaSource(r.url).type === 'image' || getMediaSource(r.url).type === 'embed' ? (
                       <img src={r.url} className="w-full h-full object-cover" />
                     ) : (
                       <video src={r.url} className="w-full h-full object-cover" />
                     )}
                     <button onClick={() => setSiteData(prev => ({ ...prev, reels: prev.reels.filter(re => re.id !== r.id) }))} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border shadow-sm h-fit">
            <h3 className="text-xl font-serif mb-6">Lead Inbox ({leads.length})</h3>
            <div className="space-y-4">
              {leads.length === 0 && <p className="text-gray-400 text-sm">No new inquiries.</p>}
              {leads.map(l => (
                <div key={l.id} className="p-4 bg-gray-50 rounded-2xl border">
                  <p className="font-bold text-[#162660]">{l.name}</p>
                  <p className="text-xs text-gray-400">{l.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; }
    h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
  `;
  document.head.appendChild(style);
            }
          
