import React from 'react';

export const MobileBuyerFeed = ({
  products,
  onReturnToWelcome,
  onSwitchRole,
  onSelectProduct
}) => {
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
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Buyer Patron
              </span>
            </div>
            <p className="text-[10px] text-[#57423b]">Direct from Loom • GI Verified</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchRole}
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[#e5e2dd] bg-white hover:bg-neutral-50 flex items-center gap-1 text-[#1c1c19] transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px] text-tertiary">sync_alt</span>
            <span>Karigar Studio</span>
          </button>
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs font-serif shadow-xs">
            क
          </div>
        </div>
      </header>

      {/* Main Feed Content */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Search & Mic */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#57423b] text-[18px]">search</span>
          <input
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#ece7df] text-xs text-[#1c1c19] focus:outline-none focus:border-primary shadow-xs"
            placeholder="Search GI handlooms, Chanderi, Dokra..."
            type="text"
          />
          <span className="material-symbols-outlined absolute right-3 text-primary text-[18px] cursor-pointer">
            mic
          </span>
        </div>

        {/* GI Heritage Cluster Spotlight Banner */}
        <div className="bg-gradient-to-br from-[#f6f3ee] to-[#ebe8e3]/80 p-4 rounded-2xl border border-[#ece7df] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Direct From Maker Families
            </span>
            <h3 className="font-serif text-base font-bold text-[#1c1c19]">Chanderi Silk Cluster</h3>
            <p className="text-[10px] text-[#57423b]">142 Certified master weavers actively at loom</p>
          </div>
          <button
            onClick={() => onSelectProduct(products[0])}
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-[#862f0f] text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Explore
          </button>
        </div>

        {/* Curated Crafts Feed */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1c1c19]">
              Authentic GI Masterpieces
            </h4>
            <span className="text-[10px] text-primary font-bold">{products.length} Crafts</span>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="p-3 rounded-2xl bg-white border border-[#ece7df] hover:border-primary/40 transition-all flex gap-3 shadow-xs cursor-pointer group"
              >
                <img
                  src={p.images?.[0] || ''}
                  alt={p.title}
                  className="w-20 h-22 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif text-xs font-bold text-[#1c1c19] truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </h5>
                    </div>
                    <p className="text-[10px] text-[#57423b] mt-0.5 truncate">
                      {p.cluster}, {p.state} • {p.giCode || 'GI Certified'}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate">
                      By {p.artisanName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-xs font-bold text-primary">₹{p.price.toLocaleString()}</span>
                      <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                        {p.fairWagePercentage || 88}% payout
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg bg-primary hover:bg-[#862f0f] text-white text-[10px] font-bold shadow-xs cursor-pointer"
                    >
                      View Craft
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
