import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const ProductDetailsModal = ({ product, onClose, onBuyNow }) => {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({
    heritage: true,
    authenticity: false,
    care: false,
    returns: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative bg-[#faf8f5] w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl overflow-y-auto border border-[#ece7df] p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-sm border border-[#ece7df]">
              <img
                src={activeImage || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              {product.giCertified && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/90 backdrop-blur-md shadow-xs text-[#1e1e1a] text-xs font-bold border border-emerald-300">
                    <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                    GI Certified: {product.giCode || 'GI-2005-07'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-0 ${
                      activeImage === img ? 'border-primary shadow-xs' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details & Accordions */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Breadcrumb / Category */}
            <div className="text-xs text-[#6b665f] font-medium flex items-center gap-1">
              <span>Home</span>
              <span>/</span>
              <span>{product.category}</span>
              <span>/</span>
              <span className="text-primary font-semibold">{product.cluster}</span>
            </div>

            {/* Title & Artisan Lineage */}
            <div>
              <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1e1e1a] leading-tight">
                {product.title}
              </h1>
              {product.hindiTitle && (
                <p className="text-sm font-medium text-neutral-500 mt-0.5">{product.hindiTitle}</p>
              )}

              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#ece7df] text-xs text-[#1e1e1a] shadow-xs">
                <span className="font-medium">By {product.artisanName} ({product.artisanLineage || product.cluster})</span>
                <span className="text-primary font-bold">✓ Pehchan Verified</span>
              </div>
            </div>

            {/* Audio Weaver Story */}
            <button
              onClick={toggleAudioStory}
              className="w-fit inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-neutral-50 text-[#1e1e1a] text-xs font-semibold border border-[#ece7df] transition-colors shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                {isPlayingAudio ? 'pause_circle' : 'volume_up'}
              </span>
              <span>{isPlayingAudio ? 'Pause Artisan Narration' : '🔊 Listen to Weaver Story (Hindi)'}</span>
              <span className="text-[10px] text-neutral-400 font-normal">0:42 min</span>
            </button>

            {/* Price & Fair-Wage Summary */}
            <div className="p-4 rounded-xl bg-white border border-[#ece7df] space-y-1 shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="font-serif-heading text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Fair-Wage Direct
                </span>
              </div>
              <p className="text-xs text-[#6b665f] font-medium">
                {product.fairWagePercentage || 88}% (₹{product.artisanWage?.toLocaleString() || Math.round(product.price * 0.85).toLocaleString()}) paid directly to master artisan {product.artisanName}
              </p>
            </div>

            {/* Ready to Dispatch */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#6b665f]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Ready to Dispatch ({product.dispatchTime || '48 Hours'}) • Insured India Post Logistics</span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-lg bg-primary hover:bg-[#862f0f] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 px-5 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Buy Now / Instant Escrow</span>
              </button>
            </div>

            {/* Progressive Disclosure Accordions */}
            <div className="border-t border-[#ece7df] pt-3 space-y-2">
              {/* Accordion 1: Craft Heritage */}
              <div className="border border-[#ece7df] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleAccordion('heritage')}
                  className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-[#1e1e1a] cursor-pointer"
                >
                  <span>Craft Heritage &amp; Technique</span>
                  <span className={`material-symbols-outlined text-[18px] transition-transform ${openAccordions.heritage ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions.heritage && (
                  <div className="p-3 pt-0 text-xs text-[#6b665f] space-y-2 leading-relaxed border-t border-neutral-100">
                    <p>{product.description}</p>
                    {product.specs && (
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="p-1.5 rounded bg-neutral-50 border border-neutral-100">
                            <span className="capitalize text-neutral-400">{key}:</span> <span className="font-semibold text-neutral-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: GI Certificate */}
              <div className="border border-[#ece7df] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleAccordion('authenticity')}
                  className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-[#1e1e1a] cursor-pointer"
                >
                  <span>GI Certificate &amp; Pehchan Authenticity</span>
                  <span className={`material-symbols-outlined text-[18px] transition-transform ${openAccordions.authenticity ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions.authenticity && (
                  <div className="p-3 pt-0 text-xs text-[#6b665f] space-y-2 leading-relaxed border-t border-neutral-100">
                    <p>
                      Protected under India's Geographical Indications Registry ({product.giCode || 'GI-2005-07'}). 
                      Every artifact includes an authenticated Ministry of Textiles QR tag verifiable on the official registry portal.
                    </p>
                    {product.silkMarkCode && (
                      <div className="p-2 rounded bg-emerald-50 text-emerald-800 font-mono text-[11px] font-semibold border border-emerald-200">
                        Silk Mark Organization ID: {product.silkMarkCode}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Archival Care */}
              <div className="border border-[#ece7df] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-[#1e1e1a] cursor-pointer"
                >
                  <span>Archival Preservation &amp; Care</span>
                  <span className={`material-symbols-outlined text-[18px] transition-transform ${openAccordions.care ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions.care && (
                  <div className="p-3 pt-0 text-xs text-[#6b665f] space-y-1.5 leading-relaxed border-t border-neutral-100">
                    <p>
                      Store wrapped in the unbleached mulmul cloth provided in your heirloom box. Avoid hanging on metal hangers; refold every 3 months along fresh creases.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Transit Guarantee */}
              <div className="border border-[#ece7df] rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleAccordion('returns')}
                  className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-[#1e1e1a] cursor-pointer"
                >
                  <span>Free Returns &amp; ONDC Escrow Guarantee</span>
                  <span className={`material-symbols-outlined text-[18px] transition-transform ${openAccordions.returns ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openAccordions.returns && (
                  <div className="p-3 pt-0 text-xs text-[#6b665f] space-y-1.5 leading-relaxed border-t border-neutral-100">
                    <p>
                      Funds are held in secure decentralized escrow until you verify authentic GI craftsmanship at delivery. 7-day doorstep return policy.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Verified Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="pt-3 border-t border-[#ece7df] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Verified Patron Reviews ({product.reviews.length})
                </h4>
                {product.reviews.map(rev => (
                  <div key={rev.id} className="p-3 rounded-lg bg-white border border-[#ece7df] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1e1e1a]">{rev.author}</span>
                      <span className="text-primary">{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p className="text-xs text-[#6b665f] italic">“{rev.comment}”</p>
                    <div className="text-[10px] text-neutral-400">{rev.location} • {rev.badge}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
