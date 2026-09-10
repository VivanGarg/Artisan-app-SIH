import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';

export const MobileCatalogTab = ({ products, onSelectProduct, initialCategory }) => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [giOnly, setGiOnly] = useState(false);
  const [readyOnly, setReadyOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under3k', '3kto8k', 'above8k'
  const [activeCluster, setActiveCluster] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (initialCategory && initialCategory !== 'All Crafts' && p.category.toLowerCase() !== initialCategory.toLowerCase()) {
        return false;
      }
      if (giOnly && !p.giCertified) return false;
      if (readyOnly && !p.dispatchTime?.includes('24') && !p.dispatchTime?.includes('48')) return false;
      if (activeCluster !== 'all' && !p.cluster.toLowerCase().includes(activeCluster.toLowerCase())) return false;
      if (priceFilter === 'under3k' && p.price > 3000) return false;
      if (priceFilter === '3kto8k' && (p.price < 3000 || p.price > 8000)) return false;
      if (priceFilter === 'above8k' && p.price < 8000) return false;

      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.cluster.toLowerCase().includes(q) ||
          p.artisanName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, initialCategory, giOnly, readyOnly, priceFilter, activeCluster, search]);

  return (
    <div className="space-y-3.5 p-3.5 pb-8">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-[#57423b] text-[18px]">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#ece7df] text-xs text-[#1c1c19] focus:outline-none focus:border-primary shadow-2xs"
          placeholder="Search GI handlooms, Dokra, Chanderi..."
          type="text"
        />
        {search ? (
          <button onClick={() => setSearch('')} className="absolute right-3 text-neutral-400">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        ) : (
          <span className="material-symbols-outlined absolute right-3 text-primary text-[18px]">mic</span>
        )}
      </div>

      {/* Filter Chips Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setGiOnly(!giOnly)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
            giOnly ? 'bg-primary text-white' : 'bg-white border border-[#ece7df] text-[#1c1c19]'
          }`}
        >
          ✓ GI Certified
        </button>
        <button
          onClick={() => setReadyOnly(!readyOnly)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
            readyOnly ? 'bg-primary text-white' : 'bg-white border border-[#ece7df] text-[#1c1c19]'
          }`}
        >
          Ready in 48h
        </button>
        <button
          onClick={() => setPriceFilter(priceFilter === 'under3k' ? 'all' : 'under3k')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
            priceFilter === 'under3k' ? 'bg-primary text-white' : 'bg-white border border-[#ece7df] text-[#1c1c19]'
          }`}
        >
          Under ₹3,000
        </button>
        <button
          onClick={() => setActiveCluster(activeCluster === 'chanderi' ? 'all' : 'chanderi')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
            activeCluster === 'chanderi' ? 'bg-primary text-white' : 'bg-white border border-[#ece7df] text-[#1c1c19]'
          }`}
        >
          Chanderi
        </button>
        <button
          onClick={() => setActiveCluster(activeCluster === 'bastar' ? 'all' : 'bastar')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
            activeCluster === 'bastar' ? 'bg-primary text-white' : 'bg-white border border-[#ece7df] text-[#1c1c19]'
          }`}
        >
          Bastar
        </button>
      </div>

      {/* Craft Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#57423b]">
          <span className="font-bold">{filtered.length} Authentic Crafts Available</span>
          {(giOnly || readyOnly || priceFilter !== 'all' || activeCluster !== 'all' || search) && (
            <button
              onClick={() => {
                setGiOnly(false);
                setReadyOnly(false);
                setPriceFilter('all');
                setActiveCluster('all');
                setSearch('');
              }}
              className="text-rose-700 font-bold underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {filtered.map((p) => (
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
                <h4 className="font-serif text-xs font-bold text-[#1c1c19] truncate group-hover:text-primary transition-colors">
                  {p.title}
                </h4>
                <p className="text-[10px] text-[#57423b] mt-0.5 truncate">
                  {p.cluster}, {p.state} • {p.giCode || 'GI Certified'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  By {p.artisanName}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-sm font-bold text-primary">₹{p.price.toLocaleString()}</span>
                  <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {p.fairWagePercentage || 88}% payout
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-primary hover:bg-[#862f0f] text-white text-[10px] font-bold shadow-xs cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
