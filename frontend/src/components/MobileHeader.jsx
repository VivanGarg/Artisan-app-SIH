import React, { useState } from 'react';
import { translations } from '../data/translations';
import { useAuth } from '../context/AuthContext';

export const MobileHeader = ({ mode, lang, onSelectLang, onSwitchMode, onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const t = translations[lang] || translations.en;

  const languages = [
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
  ];

  const toggleVoiceGuide = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if ('speechSynthesis' in window) {
      if (!isPlayingAudio) {
        const utterance = new SpeechSynthesisUtterance(t.audioPrompt);
        if (lang === 'hi') utterance.lang = 'hi-IN';
        else if (lang === 'ta') utterance.lang = 'ta-IN';
        else if (lang === 'bn') utterance.lang = 'bn-IN';
        else if (lang === 'te') utterance.lang = 'te-IN';
        else if (lang === 'gu') utterance.lang = 'gu-IN';
        else utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ece7df] shadow-xs select-none">
      {/* Top Status & Verification Pill */}
      <div className="w-full bg-[#f3efe8] px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#57423b] border-b border-[#ece7df]">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Ministry of Textiles &amp; ONDC Node</span>
        </div>

        {/* Vernacular Audio narration */}
        <button
          onClick={toggleVoiceGuide}
          className="flex items-center gap-1 text-primary hover:text-[#862f0f] font-bold cursor-pointer transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">
            {isPlayingAudio ? 'pause_circle' : 'volume_up'}
          </span>
          <span>{isPlayingAudio ? t.audioGuideStop : t.audioGuidePlay}</span>
        </button>
      </div>

      {/* Main Header Row */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs ${
            mode === 'artisan' ? 'bg-secondary' : 'bg-primary'
          }`}>
            क
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-serif-heading font-bold text-base text-[#1c1c19] leading-none">
                KalaSetu
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                mode === 'artisan'
                  ? 'bg-blue-100 text-secondary border border-blue-200'
                  : 'bg-primary-light text-primary border border-primary/20'
              }`}>
                {mode === 'artisan' ? 'Karigar Studio' : 'Buyer'}
              </span>
            </div>
            <p className="text-[10px] text-[#57423b] leading-tight">कला सेतु • Direct Heritage</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-[#ece7df] text-[11px] font-semibold flex items-center gap-1 text-[#1c1c19] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-tertiary">translate</span>
              <span className="uppercase">{lang}</span>
              <span className="material-symbols-outlined text-[12px]">expand_more</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-8 z-50 bg-white border border-[#ece7df] rounded-xl shadow-xl p-1.5 w-36 space-y-0.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelectLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${
                      lang === l.code ? 'bg-primary-light text-primary font-bold' : 'hover:bg-neutral-50 text-[#1c1c19]'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Switch Mode Pill */}
          <button
            onClick={onSwitchMode}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
              mode === 'artisan'
                ? 'bg-primary text-white border-primary hover:bg-[#862f0f]'
                : 'bg-secondary text-white border-secondary hover:bg-secondary/90'
            }`}
            title="Switch between Buyer and Artisan interfaces"
          >
            <span className="material-symbols-outlined text-[12px]">sync_alt</span>
            <span>{mode === 'artisan' ? 'Buyer' : 'Studio'}</span>
          </button>

          {/* User Profile / Auth Button */}
          <div className="relative">
            {isAuthenticated && user ? (
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="w-7 h-7 rounded-full overflow-hidden border border-[#dadce0] hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer flex items-center justify-center bg-primary-light text-primary font-bold text-xs"
                type="button"
                title={user.name || 'Account'}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.name || 'U').charAt(0).toUpperCase()}</span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-[#ece7df] text-[#1c1c19] cursor-pointer flex items-center justify-center"
                type="button"
                title="Google Sign In"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">account_circle</span>
              </button>
            )}

            {/* Account Popover Menu */}
            {accountMenuOpen && (
              <div className="absolute right-0 top-9 z-50 bg-white border border-[#ece7df] rounded-2xl shadow-2xl p-3 w-56 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#f0ede8]">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-primary text-xs">{(user?.name || 'U').charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#1c1c19] truncate">{user?.name}</div>
                    <div className="text-[10px] text-[#57423b] truncate">{user?.email}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] px-1">
                    <span className="text-neutral-500 font-medium">Current Role:</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded-full capitalize ${
                      mode === 'artisan' ? 'bg-blue-100 text-secondary' : 'bg-primary-light text-primary'
                    }`}>
                      {mode === 'artisan' ? 'Artisan / Karigar' : 'Buyer / Patron'}
                    </span>
                  </div>
                  {user?.pehchanId && (
                    <div className="flex items-center justify-between text-[10px] px-1">
                      <span className="text-neutral-500 font-medium">Pehchan ID:</span>
                      <span className="font-mono font-bold text-emerald-800">{user.pehchanId}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#f0ede8] space-y-1">
                  <button
                    onClick={() => {
                      onSwitchMode();
                      setAccountMenuOpen(false);
                    }}
                    className="w-full py-1.5 px-2 text-left text-xs font-semibold rounded-lg hover:bg-neutral-50 text-[#1c1c19] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-tertiary">swap_horiz</span>
                    <span>Switch to {mode === 'artisan' ? 'Buyer Mode' : 'Karigar Studio'}</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setAccountMenuOpen(false);
                    }}
                    className="w-full py-1.5 px-2 text-left text-xs font-semibold rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
