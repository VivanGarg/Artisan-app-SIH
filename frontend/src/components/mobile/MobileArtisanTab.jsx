import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../api';

export const MobileArtisanTab = ({ onProductAdded, onSwitchToBuyer }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [listingSuccess, setListingSuccess] = useState(false);
  const [newCraftSummary, setNewCraftSummary] = useState(null);

  // Manual craft form state
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('Handloom Weaves');
  const [manualPrice, setManualPrice] = useState('');
  const [manualCluster, setManualCluster] = useState('Chanderi, MP');

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceText('Listening in vernacular dialect... Speak craft name, cluster, and price');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setVoiceText(text);
          publishVoiceCraft(text);
        };
        recognition.onerror = () => simulateVoice();
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
      const sampleHindi = 'हथकरघा चंदेरी कातन सिल्क दुपट्टा, शुद्ध रेशम जरी, कीमत ₹3,850';
      setVoiceText(sampleHindi);
      publishVoiceCraft(sampleHindi);
    }, 2200);
  };

  const publishVoiceCraft = async (spokenText) => {
    setIsRecording(false);
    const newCraft = {
      id: `prod-voice-${Date.now()}`,
      title: 'Handcrafted Chanderi Silk Dupatta (Voice Added)',
      hindiTitle: 'हथकरघा चंदेरी सिल्क दुपट्टा',
      category: 'Handloom Weaves',
      price: 3850,
      originalPrice: 5200,
      artisanName: 'Smt. Yashoda Bai',
      artisanLineage: '5th Gen Master Weaver, Chanderi, MP',
      cluster: 'Chanderi',
      state: 'Madhya Pradesh',
      giCertified: true,
      giCode: 'GI-2005-07',
      pehchanVerified: true,
      dispatchTime: '24 Hours',
      artisanWage: 3400,
      fairWagePercentage: 88,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD8ONCxTJxBRMkmphOMiktLWfsSMkAG8tCqh5Aytt7-g8eeU-LeScbM430LldXdHmvCmShKbTuvNBr2DruOt9XTzUbx7LmLMPDWUzGfqZDMWbMCfT0S9fkJ1Ti8AA-C4WfCLK7Uf9FuQh-jyAJpWZlfUNXwKt-qIUJZjWwXJMpnoGJloexZX3WB68z0J7_KC6qJMuL8hcOEfMnS0cWJe5aKuLkwZAYKyUhMKMxO72R_wc0Y4QjY53MG'
      ],
      description: `Directly dictated by master artisan Yashoda Bai: ${spokenText}. Woven using raw katan silk warp.`
    };

    setNewCraftSummary(newCraft);
    setListingSuccess(true);
    if (onProductAdded) onProductAdded(newCraft);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualTitle || !manualPrice) return;

    const numPrice = Number(manualPrice);
    const newCraft = {
      id: `prod-manual-${Date.now()}`,
      title: manualTitle,
      category: manualCategory,
      price: numPrice,
      originalPrice: Math.round(numPrice * 1.35),
      artisanName: 'Smt. Yashoda Bai',
      artisanLineage: '5th Gen Pit-Loom Weaver',
      cluster: manualCluster,
      state: 'Madhya Pradesh',
      giCertified: true,
      giCode: 'GI-2005-07',
      pehchanVerified: true,
      dispatchTime: '48 Hours',
      artisanWage: Math.round(numPrice * 0.88),
      fairWagePercentage: 88,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCBPY7EbJCXidlF6lx6HV-VpQZBfi3UrBiCVxciTPfXYuJxHS1LsdC4DuK2fm6Auj-JUZcP-BiTArfk75pt78-THQNztLr5JS143pOdVGS8g1W4dj8QmfdqpdS-l-TO4C1bMndQlw0sepSGxP8NNogQxD1MQH5fWHewBJwIKC-5pjhj6xZpVMYrhwtA--eiCRCMMrYuivANNGYzuns1N7HZhzHkYiK1GfddD3fZKML2mcZk6-Cak1eX'
      ],
      description: `Craft listed via Karigar Studio in ${manualCluster}.`
    };

    setNewCraftSummary(newCraft);
    setListingSuccess(true);
    setShowManualForm(false);
    setManualTitle('');
    setManualPrice('');
    if (onProductAdded) onProductAdded(newCraft);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-3.5 p-3.5 pb-8">
      {/* Voice Listing Studio Hero Card */}
      <div className="bg-gradient-to-br from-blue-50 to-[#f6f3ee] p-4 rounded-2xl border border-secondary/20 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-secondary text-[10px] font-bold">
            <span className="material-symbols-outlined text-[13px]">mic</span> Voice Studio Active
          </span>
          <span className="text-[10px] font-bold text-[#57423b]">Pehchan #MP-CH-2018-912</span>
        </div>

        <div>
          <h3 className="font-serif text-base font-bold text-[#1c1c19]">
            कारीगर वॉइस लिस्टिंग (Voice Listing)
          </h3>
          <p className="text-[11px] text-[#57423b] mt-0.5 leading-snug">
            Speak in Hindi, Bundelkhandi, or your native language to list your handloom product directly onto ONDC.
          </p>
        </div>

        {/* Record Button */}
        <button
          onClick={handleVoiceRecord}
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
            {isRecording ? 'सुन रहे हैं... (Listening)' : 'बोलकर नया सामान जोड़ें (Record Now)'}
          </span>
        </button>

        {voiceText && (
          <div className="p-2.5 rounded-xl bg-white border border-[#e5e2dd] text-[11px] text-[#1c1c19] space-y-1">
            <span className="text-[10px] font-bold text-secondary uppercase">Voice Transcript:</span>
            <p className="italic">“{voiceText}”</p>
          </div>
        )}

        {listingSuccess && newCraftSummary && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1 font-bold text-emerald-800">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Craft Successfully Live on ONDC!</span>
            </div>
            <p className="text-[11px]">
              {newCraftSummary.title} listed for ₹{newCraftSummary.price} (₹{newCraftSummary.artisanWage} direct wage).
            </p>
          </div>
        )}

        <div className="flex justify-center pt-1">
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="text-[11px] font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">edit_note</span>
            <span>{showManualForm ? 'Hide Manual Form' : 'Or enter details manually'}</span>
          </button>
        </div>
      </div>

      {/* Manual Form (Expandable) */}
      {showManualForm && (
        <form onSubmit={handleManualSubmit} className="bg-white p-4 rounded-2xl border border-[#ece7df] shadow-xs space-y-3">
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1c1c19]">Manual Craft Registration</h4>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#57423b] mb-1">Craft Title</label>
            <input
              required
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="e.g. Pure Chanderi Katan Dupatta"
              className="w-full px-3 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#57423b] mb-1">Category</label>
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs"
              >
                <option value="Handloom Weaves">Handloom Weaves</option>
                <option value="Pottery & Clay">Pottery &amp; Clay</option>
                <option value="Dokra Metalcraft">Dokra Metalcraft</option>
                <option value="Woodcraft & Inlay">Woodcraft &amp; Inlay</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#57423b] mb-1">Price (₹)</label>
              <input
                required
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="4200"
                className="w-full px-3 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-secondary text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            Save &amp; Publish Craft
          </button>
        </form>
      )}

      {/* Artisan Quick Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-xl bg-white border border-[#ece7df] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#57423b]">Listed</span>
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
          Your loom catalog is synchronized in real-time across national patron shopping apps.
        </p>
      </div>

      {/* Active Loom Orders */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1c1c19]">
            Active Loom Orders
          </h4>
          <span className="text-[10px] text-primary font-bold">2 Orders Pending Finish</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#ece7df] flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-bold text-[#1c1c19]">Pure Katan Silk Chanderi Saree</div>
            <div className="text-[10px] text-[#57423b]">Consignment #KS-98241 • Bengaluru</div>
            <div className="text-[10px] text-emerald-800 font-bold mt-0.5">₹6,400 Escrow Locked</div>
          </div>
          <span className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
            Loom Complete
          </span>
        </div>
      </div>
    </div>
  );
};
