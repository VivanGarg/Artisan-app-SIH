import React, { useState } from 'react';
import { translations } from '../data/translations';

export const MobileOnboarding = ({ onProceed }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [currentRole, setCurrentRole] = useState('artisan'); // 'buyer' or 'artisan'
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const t = translations[currentLang] || translations.en;

  const languages = [
    { code: 'hi', native: 'हिंदी', label: 'Hindi', font: 'font-serif' },
    { code: 'en', native: 'English', label: 'Default', font: '' },
    { code: 'ta', native: 'தமிழ்', label: 'Tamil', font: '' },
    { code: 'bn', native: 'বাংলা', label: 'Bengali', font: '' },
    { code: 'te', native: 'తెలుగు', label: 'Telugu', font: '' },
    { code: 'gu', native: 'ગુજરાતી', label: 'Gujarati', font: '' }
  ];

  const toggleAudioGuide = () => {
    setIsAudioPlaying(!isAudioPlaying);
    if ('speechSynthesis' in window) {
      if (!isAudioPlaying) {
        const utterance = new SpeechSynthesisUtterance(t.audioPrompt);
        if (currentLang === 'hi') utterance.lang = 'hi-IN';
        else if (currentLang === 'ta') utterance.lang = 'ta-IN';
        else if (currentLang === 'bn') utterance.lang = 'bn-IN';
        else if (currentLang === 'te') utterance.lang = 'te-IN';
        else if (currentLang === 'gu') utterance.lang = 'gu-IN';
        else utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleStart = () => {
    onProceed({ role: currentRole, lang: currentLang });
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-1 pb-4 justify-between relative bg-[#faf7f2]">
      {/* Top Section: Brand Identity & Audio Walkthrough */}
      <header className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xs font-serif text-xl font-bold">
              क
            </div>
            <div>
              <h1 className="font-serif-heading text-xl font-bold text-[#1c1c19] leading-tight tracking-tight">
                KalaSetu
              </h1>
              <p className="text-[10px] font-medium text-primary tracking-wide">
                कला सेतु • Direct Heritage Network
              </p>
            </div>
          </div>

          {/* Audio Guide Button */}
          <button
            onClick={toggleAudioGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f3ee] hover:bg-[#f0ede9] border border-[#e5e2dd] text-xs font-medium text-[#1c1c19] transition-all active:scale-95 shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[17px]">
              {isAudioPlaying ? 'pause_circle' : 'volume_up'}
            </span>
            <span className="text-[11px] font-semibold">
              {isAudioPlaying ? t.audioGuideStop : t.audioGuidePlay}
            </span>
          </button>
        </div>

        {/* Hero Greeting Banner */}
        <div className="bg-gradient-to-br from-[#f6f3ee] to-[#ebe8e3]/70 rounded-2xl p-4 border border-[#e5e2dd]/80 shadow-xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              ONDC &amp; GI Certified
            </span>
          </div>
          <h2 className="font-serif-heading text-xl font-bold text-[#1c1c19] leading-snug">
            {t.greetingTitle}
          </h2>
          <p className="text-xs text-[#57423b] mt-1 leading-relaxed">
            {t.greetingSub}
          </p>
        </div>
      </header>

      {/* Step 1: Language Selection Section */}
      <section className="mt-3 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#1c1c19] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-tertiary">translate</span>
            <span>{t.langHeading}</span>
          </label>
          <span className="text-[10px] font-medium text-[#57423b]">
            {t.selectedLang}
          </span>
        </div>

        {/* 6 Visual Language Grid Cards */}
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setCurrentLang(lang.code)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all text-center relative focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-[#fdf1ec] border-2 border-primary shadow-xs'
                    : 'bg-white border border-[#e5e2dd] hover:border-primary/50'
                }`}
                type="button"
              >
                <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-[#1c1c19]'}`}>
                  {lang.native}
                </span>
                <span className={`text-[10px] ${isActive ? 'text-primary/80 font-medium' : 'text-[#57423b]'}`}>
                  {lang.label}
                </span>
                {isActive && (
                  <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Role Selection (Buyer vs Artisan) */}
      <section className="mt-3 space-y-2.5">
        <div className="px-0.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#1c1c19] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-primary">person_check</span>
            <span>{t.roleHeading}</span>
          </label>
          <p className="text-[10px] text-[#57423b] mt-0.5">{t.roleSubheading}</p>
        </div>

        <div className="space-y-2.5">
          {/* Card 1: Buyer Mode */}
          <div
            onClick={() => setCurrentRole('buyer')}
            className={`cursor-pointer p-3.5 rounded-2xl transition-all duration-200 shadow-xs relative overflow-hidden active:scale-[0.99] border-2 ${
              currentRole === 'buyer'
                ? 'bg-[#fdf1ec] border-primary'
                : 'bg-white border-[#e5e2dd] hover:border-primary/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              </div>
              <div className="flex-1 min-w-0 pr-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold text-[#1c1c19] leading-tight">
                    {t.buyerTitle}
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {t.buyerTag}
                  </span>
                </div>
                <p className="text-[11px] text-[#57423b] mt-0.5 leading-snug">
                  {t.buyerDesc}
                </p>
              </div>
              {/* Radio Circle */}
              <div className={`absolute top-3.5 right-3.5 w-4 h-4 rounded-full flex items-center justify-center ${
                currentRole === 'buyer' ? 'bg-primary text-white' : 'border border-neutral-300 bg-white'
              }`}>
                {currentRole === 'buyer' && <span className="material-symbols-outlined text-[11px] font-bold">check</span>}
              </div>
            </div>
          </div>

          {/* Card 2: Artisan Mode */}
          <div
            onClick={() => setCurrentRole('artisan')}
            className={`cursor-pointer p-3.5 rounded-2xl transition-all duration-200 shadow-xs relative overflow-hidden active:scale-[0.99] border-2 ${
              currentRole === 'artisan'
                ? 'bg-blue-50/70 border-secondary'
                : 'bg-white border-[#e5e2dd] hover:border-secondary/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#eef2ff] text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">handyman</span>
              </div>
              <div className="flex-1 min-w-0 pr-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold text-[#1c1c19] leading-tight">
                    {t.artisanTitle}
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-secondary border border-blue-200">
                    {t.artisanTag}
                  </span>
                </div>
                <p className="text-[11px] text-[#57423b] mt-0.5 leading-snug">
                  {t.artisanDesc}
                </p>
              </div>
              {/* Radio Circle */}
              <div className={`absolute top-3.5 right-3.5 w-4 h-4 rounded-full flex items-center justify-center ${
                currentRole === 'artisan' ? 'bg-secondary text-white' : 'border border-neutral-300 bg-white'
              }`}>
                {currentRole === 'artisan' && <span className="material-symbols-outlined text-[11px] font-bold">check</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Primary CTA */}
      <footer className="mt-4 pt-2 border-t border-[#e5e2dd] space-y-2">
        <button
          onClick={handleStart}
          className={`w-full py-3 px-6 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            currentRole === 'artisan'
              ? 'bg-secondary hover:bg-secondary/90 text-white'
              : 'bg-primary hover:bg-[#862f0f] text-white'
          }`}
          type="button"
        >
          <span>{currentRole === 'artisan' ? t.ctaArtisan : t.ctaBuyer}</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>

        <p className="text-center text-[10px] text-[#57423b] flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-tertiary">swap_horiz</span>
          <span>{t.switchHint}</span>
        </p>
      </footer>
    </div>
  );
};
