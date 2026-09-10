import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export const MobileArtisanStudio = ({ onReturnToWelcome, onSwitchRole, onProductAdded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [listingSuccess, setListingSuccess] = useState(false);
  const [recentListing, setRecentListing] = useState(null);

  // Simulated or SpeechRecognition
  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript('Listening... Speak craft details (e.g. Pure Chanderi Saree, ₹5,200, Pranpur Pit-Loom)');

      // If browser Web Speech API is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          processVoiceListing(text);
        };
        recognition.onerror = () => {
          simulateVoice();
        };
        try {
          recognition.start();
        } catch {
          simulateVoice();
        }
      } else {
        simulateVoice();
      }
    } else {
      setIsRecording(false);
    }
  };

  const simulateVoice = () => {
    setTimeout(() => {
      const simulatedText = 'हथकरघा चंदेरी कातन सिल्क दुपट्टा, प्राणपुर क्लस्टर, कीमत चार हज़ार दो सौ रुपये (₹4,200)';
      setTranscript(simulatedText);
      processVoiceListing(simulatedText);
    }, 2400);
  };

  const processVoiceListing = async (voiceText) => {
    setIsRecording(false);
    const newCraft = {
      id: `prod-${Date.now()}`,
      title: 'Handcrafted Chanderi Katan Dupatta (Voice Added)',
      hindiTitle: 'हथकरघा चंदेरी कातन सिल्क दुपट्टा',
      category: 'Handloom Weaves',
      price: 4200,
      originalPrice: 5800,
      artisanName: 'Smt. Yashoda Bai',
      artisanLineage: '5th Gen Pit-Loom Weaver, Chanderi, MP',
      cluster: 'Chanderi',
      state: 'Madhya Pradesh',
      giCertified: true,
      giCode: 'GI-2005-07',
      pehchanVerified: true,
      dispatchTime: '24 Hours',
      artisanWage: 3700,
      fairWagePercentage: 88,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD8ONCxTJxBRMkmphOMiktLWfsSMkAG8tCqh5Aytt7-g8eeU-LeScbM430LldXdHmvCmShKbTuvNBr2DruOt9XTzUbx7LmLMPDWUzGfqZDMWbMCfT0S9fkJ1Ti8AA-C4WfCLK7Uf9FuQh-jyAJpWZlfUNXwKt-qIUJZjWwXJMpnoGJloexZX3WB68z0J7_KC6qJMuL8hcOEfMnS0cWJe5aKuLkwZAYKyUhMKMxO72R_wc0Y4QjY53MG'
      ],
      description: `Voice-listed directly from loom: ${voiceText}. Woven using raw unbleached katan silk with silver zari borders.`
    };

    setRecentListing(newCraft);
    setListingSuccess(true);
    if (onProductAdded) onProductAdded(newCraft);

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#faf7f2]">
      {/* Mobile App Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#ece7df] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToWelcome}
            className="w-8 h-8 rounded-full bg-[#f6f3ee] hover:bg-[#f0ede9] flex items-center justify-center text-[#1c1c19] transition-colors cursor-pointer"
            title="Back to Welcome"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-heading font-bold text-sm text-[#1c1c19]">KalaSetu</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-secondary border border-blue-200">
                Karigar Studio
              </span>
            </div>
            <p className="text-[10px] text-emerald-800 font-medium flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Pehchan ID: MP-CH-2018-912
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchRole}
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[#e5e2dd] bg-white hover:bg-neutral-50 flex items-center gap-1 text-[#1c1c19] transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px] text-tertiary">sync_alt</span>
            <span>Buyer Mode</span>
          </button>
          <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs font-serif shadow-xs">
            क
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
        {/* Voice Listing Studio Hero Card */}
        <div className="bg-gradient-to-br from-blue-50 to-[#f6f3ee] p-4 rounded-2xl border border-secondary/20 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-secondary text-[10px] font-bold">
              <span className="material-symbols-outlined text-[13px]">mic</span> Voice Studio Active
            </span>
            <span className="text-[10px] font-bold text-[#57423b]">60-Sec Direct AI Listing</span>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-[#1c1c19]">
              कारीगर वॉइस लिस्टिंग (Voice Listing)
            </h3>
            <p className="text-[11px] text-[#57423b] mt-0.5 leading-snug">
              Speak in Hindi, Bundelkhandi, or your native dialect to list your new handloom craft directly onto the ONDC network.
            </p>
          </div>

          {/* Record Button */}
          <button
            onClick={handleToggleVoice}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-secondary hover:bg-secondary/90 text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRecording ? 'graphic_eq' : 'mic'}
            </span>
            <span>
              {isRecording ? 'बोल रहे हैं... सुन रहे हैं...' : 'बोलकर नया सामान जोड़ें (Record Now)'}
            </span>
          </button>

          {transcript && (
            <div className="p-2.5 rounded-xl bg-white border border-[#e5e2dd] text-[11px] text-[#1c1c19] space-y-1">
              <span className="text-[10px] font-bold text-secondary uppercase">Voice Transcript:</span>
              <p className="italic">“{transcript}”</p>
            </div>
          )}

          {listingSuccess && recentListing && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 animate-in fade-in duration-300">
              <div className="flex items-center gap-1 font-bold text-emerald-800">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Craft Live on ONDC Network!</span>
              </div>
              <p className="text-[11px]">
                {recentListing.title} listed at ₹{recentListing.price} (₹{recentListing.artisanWage} direct wage).
              </p>
            </div>
          )}
        </div>

        {/* Artisan Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-xl bg-white border border-[#ece7df] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#57423b]">Listed Crafts</span>
            <p className="font-serif text-lg font-bold text-[#1c1c19] mt-0.5">
              {listingSuccess ? 19 : 18}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#ece7df] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#57423b]">Loom Orders</span>
            <p className="font-serif text-lg font-bold text-secondary mt-0.5">6</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#ece7df] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#57423b]">Escrow Payout</span>
            <p className="font-serif text-lg font-bold text-emerald-700 mt-0.5">₹28,400</p>
          </div>
        </div>

        {/* ONDC & Govt Integration Banner */}
        <div className="p-3.5 rounded-xl bg-white border border-[#ece7df] space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1c1c19] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
              <span>ONDC Network Sync</span>
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              Live &amp; Active
            </span>
          </div>
          <p className="text-[11px] text-[#57423b] leading-relaxed">
            Your loom catalog is synchronized in real-time across national buyer platforms with zero intermediary commissions.
          </p>
        </div>

        {/* Recent Orders in Loom */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1c1c19]">
              Active Loom Orders (2)
            </h4>
            <span className="text-[10px] text-primary font-bold">Loom Ledger</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#ece7df] flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-bold text-[#1c1c19]">Chanderi Silk Saree (#ORD-98241)</div>
              <div className="text-[10px] text-[#57423b]">Patron: Pooja Sharma • Bengaluru</div>
              <div className="text-[10px] text-emerald-800 font-bold mt-0.5">₹6,400 Escrow Locked</div>
            </div>
            <span className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
              Weave Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
