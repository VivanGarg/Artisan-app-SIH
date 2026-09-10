import React from 'react';

export const MobileHomeTab = ({ products, artisans, onSelectProduct, onNavigateToCatalog, onSwitchToStudio }) => {
  const categories = [
    { label: 'All Crafts', icon: '✨' },
    { label: 'Handloom Weaves', icon: '🧵' },
    { label: 'Pottery & Clay', icon: '🏺' },
    { label: 'Dokra Metalcraft', icon: '🪔' },
    { label: 'Woodcraft & Inlay', icon: '🪵' },
    { label: 'Tribal Jewelry', icon: '📿' }
  ];

  return (
    <div className="space-y-4 p-3.5 pb-8">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-[#f6f3ee] to-[#ebe8e3] p-4 rounded-2xl border border-[#ece7df] shadow-xs space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            Zero Middleman • Fair Direct Trade
          </span>
        </div>
        <h2 className="font-serif-heading text-xl font-bold text-[#1c1c19] leading-snug">
          Timeless Indian Crafts, <br />
          <span className="text-primary italic">Loom-Direct</span> to Your Home.
        </h2>
        <p className="text-xs text-[#57423b] leading-relaxed">
          88% of payments go directly to verified master karigars across India's Geographical Indication (GI) clusters.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onNavigateToCatalog()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-[#862f0f] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            <span>Explore GI Catalog</span>
          </button>
          <button
            onClick={onSwitchToStudio}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-50 text-secondary font-bold text-xs border border-secondary/30 shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">handyman</span>
            <span>Karigar Studio</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57423b]">
          Browse Heritage Clusters
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onNavigateToCatalog(cat.label)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#ece7df] text-[#1c1c19] shrink-0 shadow-2xs hover:border-primary cursor-pointer"
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured GI Masterpieces */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold text-[#1c1c19] uppercase tracking-wider">
            Curated GI Masterpieces
          </h3>
          <button
            onClick={() => onNavigateToCatalog()}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            View All ({products.length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="bg-white rounded-xl border border-[#ece7df] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={p.images?.[0] || ''}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.giCertified && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 text-[9px] font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
                    {p.giCode || 'GI Certified'}
                  </span>
                )}
              </div>

              <div className="p-2.5 space-y-1">
                <h4 className="font-serif text-xs font-bold text-[#1c1c19] truncate group-hover:text-primary transition-colors">
                  {p.title}
                </h4>
                <p className="text-[10px] text-[#57423b] truncate">
                  By {p.artisanName} ({p.cluster})
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-serif text-xs font-bold text-primary">₹{p.price.toLocaleString()}</span>
                  <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">
                    {p.fairWagePercentage || 88}% wage
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Artisans Roster */}
      <div className="space-y-2.5 pt-2">
        <h3 className="font-serif text-sm font-bold text-[#1c1c19] uppercase tracking-wider">
          National Living Treasures
        </h3>
        <div className="space-y-2.5">
          {artisans.map((art) => (
            <div key={art.id} className="p-3 rounded-xl bg-white border border-[#ece7df] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <img src={art.avatar} alt={art.name} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#1c1c19]">{art.name}</h4>
                  <p className="text-[10px] text-primary font-semibold">{art.title}</p>
                  <p className="text-[9px] text-[#57423b]">{art.cluster}, {art.state}</p>
                </div>
              </div>
              <span className="font-mono text-[9px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {art.pehchanId}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
