import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const MobileProductSheet = ({ product, onClose, onBuyNow }) => {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({ heritage: true, authenticity: false, care: false });

  const toggleAccordion = (k) => setOpenAccordions(prev => ({ ...prev, [k]: !prev[k] }));

  const toggleAudioStory = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if ('speechSynthesis' in window) {
      if (!isPlayingAudio) {
        const text = `${product.artisanName} कहते हैं: यह कला हमारे परिवार में पांच पीढ़ियों से चली आ रही है। प्रत्येक साड़ी को शुद्ध रेशम और चांदी की जरी से तैयार करने में चौदह दिन लगते हैं।`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleBuyNow = () => {
    addToCart(product);
    onClose();
    if (onBuyNow) onBuyNow();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
      <div className="bg-[#faf7f2] w-full max-w-md mx-auto rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-t border-[#ece7df]">
        {/* Header Drag Handle / Close */}
        <div className="p-3 pb-2 flex items-center justify-between border-b border-[#ece7df] bg-white">
          <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
          <span className="text-xs font-serif font-bold text-[#1c1c19] truncate pr-4">
            {product.title}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Photo */}
          <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-[#ece7df] shadow-xs">
            <img src={activeImage} alt={product.title} className="w-full h-full object-cover" />
            {product.giCertified && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/95 text-[10px] font-bold text-emerald-800 border border-emerald-200 shadow-xs">
                {product.giCode || 'GI Certified'}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer ${
                    activeImage === img ? 'border-primary' : 'border-[#ece7df]'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Artisan */}
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-[#1c1c19]">
              {product.title}
            </h3>
            {product.hindiTitle && (
              <p className="text-xs font-medium text-neutral-500">{product.hindiTitle}</p>
            )}
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#ece7df] text-[11px] text-[#1c1c19]">
              <span>By {product.artisanName}</span>
              <span className="text-primary font-bold">✓ Pehchan Verified</span>
            </div>
          </div>

          {/* Audio Story Narration */}
          <button
            onClick={toggleAudioStory}
            className="w-full py-2 px-3 rounded-xl bg-white border border-[#ece7df] text-xs font-bold text-[#1c1c19] flex items-center justify-between shadow-2xs cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">
                {isPlayingAudio ? 'pause_circle' : 'volume_up'}
              </span>
              <span>{isPlayingAudio ? 'Pause Narration' : '🔊 Listen to Weaver Story (Hindi)'}</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-normal">0:42 min</span>
          </button>

          {/* Price & Fair-Wage Summary */}
          <div className="p-3.5 rounded-xl bg-white border border-[#ece7df] space-y-1 shadow-2xs">
            <div className="flex items-baseline gap-2">
              <span className="font-serif-heading text-2xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Fair-Wage Direct
              </span>
            </div>
            <p className="text-[11px] text-[#57423b]">
              {product.fairWagePercentage || 88}% (₹{product.artisanWage?.toLocaleString() || Math.round(product.price * 0.85).toLocaleString()}) paid directly to master weaver {product.artisanName}
            </p>
          </div>

          {/* Accordion: Craft Heritage */}
          <div className="border border-[#ece7df] rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => toggleAccordion('heritage')}
              className="w-full p-3 flex items-center justify-between text-xs font-bold text-[#1c1c19] text-left cursor-pointer"
            >
              <span>Craft Heritage &amp; Technique</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${openAccordions.heritage ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {openAccordions.heritage && (
              <div className="p-3 pt-0 text-xs text-[#57423b] leading-relaxed border-t border-neutral-100">
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action CTAs Footer */}
        <div className="p-3 border-t border-[#ece7df] bg-white flex items-center gap-2">
          <button
            onClick={() => {
              addToCart(product);
              onClose();
            }}
            className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-[#1c1c19] rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 bg-primary hover:bg-[#862f0f] text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Buy Now / Escrow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
