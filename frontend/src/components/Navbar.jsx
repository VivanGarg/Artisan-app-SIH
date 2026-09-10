import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const { user, isAuthenticated, setAuthModalOpen, setAuthRole, logout } = useAuth();
  const { totalItemCount, setCartDrawerOpen } = useCart();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [language, setLanguage] = useState('en');

  const categories = [
    { label: 'All Crafts', icon: '✨' },
    { label: 'Handloom Weaves', icon: '🧵' },
    { label: 'Pottery & Clay', icon: '🏺' },
    { label: 'Dokra Metalcraft', icon: '🪔' },
    { label: 'Woodcraft & Inlay', icon: '🪵' },
    { label: 'Tribal Jewelry', icon: '📿' },
    { label: 'GI Certified Directory', icon: '📜' }
  ];

  const toggleHindiAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    // Audio synthesis or sample audio toggle
    if ('speechSynthesis' in window) {
      if (!isPlayingAudio) {
        const utterance = new SpeechSynthesisUtterance('कला सेतु में आपका स्वागत है। यहाँ भारत के सभी भौगोलिक संकेतक प्रमाणित कारीगर सीधे अपनी कला प्रस्तुत करते हैं।');
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <header class="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ece7df]">
      {/* Clean Top Bar */}
      <aside aria-label="Announcement and Accessibility Bar" className="w-full bg-[#f3efe8] border-b border-[#ece7df] text-xs text-[#6b665f] py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1e1e1a]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Direct from Master Weavers &amp; GI Clusters
            </span>
            <span className="text-neutral-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              Ministry of Textiles &amp; ONDC Verified
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={toggleHindiAudio}
              className="flex items-center gap-1.5 text-primary hover:text-[#862f0f] font-semibold transition-colors cursor-pointer"
              title="Listen in Hindi"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">
                {isPlayingAudio ? 'volume_up' : 'volume_down'}
              </span>
              <span>{isPlayingAudio ? 'ऑडियो बंद करें' : 'ऑडियो सुनें (Hindi)'}</span>
            </button>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#6b665f]">translate</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[#6b665f] hover:text-[#1e1e1a] font-medium border-0 p-0 text-xs focus:ring-0 cursor-pointer outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 md:gap-6">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 shrink-0 group text-left cursor-pointer border-0 bg-transparent"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm font-serif text-2xl font-bold">
            क
          </div>
          <div className="flex flex-col">
            <span className="font-serif-heading text-2xl font-bold tracking-tight text-primary leading-tight">
              KalaSetu
            </span>
            <span className="text-[10px] tracking-wider uppercase text-neutral-500 font-semibold">
              कला सेतु • GI Direct
            </span>
          </div>
        </button>

        {/* Central Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-2">
          <div className="w-full relative flex items-center bg-white border border-[#ece7df] hover:border-neutral-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-full px-4 py-2 shadow-sm transition-all">
            <span className="material-symbols-outlined text-neutral-400 text-[20px] mr-2">search</span>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setCurrentView('catalog');
              }}
              className="w-full bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none text-[#1e1e1a] font-normal"
              placeholder="Search authentic weaves, Dokra metalcraft, terracotta..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-neutral-600 p-1 mr-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <div className="flex items-center gap-1 pl-2 border-l border-neutral-200">
              <button
                onClick={() => {
                  setSearchQuery('Chanderi');
                  if (currentView !== 'catalog') setCurrentView('catalog');
                }}
                className="text-neutral-400 hover:text-primary transition-colors p-1"
                title="बोलकर खोजें (Quick suggestion)"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px]">mic</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Navigation links */}
          <button
            onClick={() => setCurrentView('catalog')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              currentView === 'catalog'
                ? 'bg-primary text-white'
                : 'text-[#6b665f] hover:text-[#1e1e1a] hover:bg-neutral-100'
            }`}
          >
            Craft Catalog
          </button>

          <button
            onClick={() => setCurrentView('checkout')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              currentView === 'checkout'
                ? 'bg-primary text-white'
                : 'text-[#6b665f] hover:text-[#1e1e1a] hover:bg-neutral-100'
            }`}
          >
            Orders &amp; Tracking
          </button>

          {/* Pehchan GI Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#ece7df] text-xs font-semibold text-[#1e1e1a] shadow-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span>Pehchan Verified</span>
          </div>

          {/* User Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-[#1e1e1a] truncate max-w-[120px]">
                  {user?.name || user?.email}
                </span>
                <span className="text-[10px] uppercase font-semibold text-primary">
                  {user?.role === 'artisan' ? 'Master Karigar' : 'Patron'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-neutral-500 hover:text-rose-600 rounded-full hover:bg-neutral-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setAuthRole('artisan');
                  setAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex text-xs font-semibold text-secondary hover:text-secondary/80 px-2.5 py-1 rounded-md border border-secondary/30 hover:bg-secondary/5 cursor-pointer"
              >
                Artisan Sign-In
              </button>
              <button
                onClick={() => {
                  setAuthRole('buyer');
                  setAuthModalOpen(true);
                }}
                className="text-xs font-semibold bg-primary hover:bg-[#862f0f] text-white px-3 py-1.5 rounded-full shadow-sm cursor-pointer transition-all"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Cart Icon with badge */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="text-[#6b665f] hover:text-[#1e1e1a] transition-colors p-2 relative cursor-pointer rounded-full hover:bg-neutral-100"
            title="Shopping Cart"
            type="button"
          >
            <span className="material-symbols-outlined text-[23px]">shopping_bag</span>
            {totalItemCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Bar (Horizontal) */}
      <nav aria-label="Craft Categories" className="w-full bg-white border-t border-[#ece7df] py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => {
                  setSelectedCategory(cat.label);
                  if (currentView !== 'catalog') setCurrentView('catalog');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-[#1e1e1a] border border-[#ece7df]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
