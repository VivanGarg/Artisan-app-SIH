import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';

export const Catalog = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectProduct
}) => {
  const [giOnly, setGiOnly] = useState(false);
  const [readyToShipOnly, setReadyToShipOnly] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [priceBracket, setPriceBracket] = useState('all'); // all, under3k, 3kto8k, above8k
  const [sortBy, setSortBy] = useState('curated'); // curated, price-low, price-high

  const clusters = ['All', 'Chanderi', 'Bastar', 'Jaipur', 'Kashmir', 'Kutch'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && selectedCategory !== 'All Crafts' && selectedCategory !== 'GI Certified Directory') {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // GI only
        if (giOnly && !p.giCertified) return false;
        if (selectedCategory === 'GI Certified Directory' && !p.giCertified) return false;

        // Ready to ship
        if (readyToShipOnly && !p.dispatchTime?.includes('24') && !p.dispatchTime?.includes('48')) return false;

        // Cluster filter
        if (selectedCluster !== 'All') {
          if (!p.cluster.toLowerCase().includes(selectedCluster.toLowerCase()) &&
              !p.state.toLowerCase().includes(selectedCluster.toLowerCase())) {
            return false;
          }
        }

        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title?.toLowerCase().includes(q);
          const matchArtisan = p.artisanName?.toLowerCase().includes(q);
          const matchCluster = p.cluster?.toLowerCase().includes(q);
          const matchState = p.state?.toLowerCase().includes(q);
          if (!matchTitle && !matchArtisan && !matchCluster && !matchState) return false;
        }

        // Price bracket
        if (priceBracket === 'under3k' && p.price > 3000) return false;
        if (priceBracket === '3kto8k' && (p.price < 3000 || p.price > 8000)) return false;
        if (priceBracket === 'above8k' && p.price < 8000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [products, selectedCategory, giOnly, readyToShipOnly, selectedCluster, searchQuery, priceBracket, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Crafts');
    setGiOnly(false);
    setReadyToShipOnly(false);
    setSelectedCluster('All');
    setPriceBracket('all');
    setSearchQuery('');
    setSortBy('curated');
  };

  return (
    <div className="flex-grow w-full bg-[#faf8f5]">
      {/* Header & Context Banner */}
      <section className="border-b border-[#ece7df] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[#6b665f]">
              <span className="hover:text-primary cursor-pointer">Home</span>
              <span className="material-symbols-outlined text-[12px] text-neutral-400">chevron_right</span>
              <span className="hover:text-primary cursor-pointer">Authentic Crafts</span>
              <span className="material-symbols-outlined text-[12px] text-neutral-400">chevron_right</span>
              <span className="text-[#1e1e1a] font-bold">{selectedCategory}</span>
            </nav>

            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {filteredProducts.length} Verified GI Crafts
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif-heading text-3xl sm:text-4xl text-[#1e1e1a] font-bold tracking-tight">
                {selectedCategory === 'GI Certified Directory' ? 'GI Certified Directory' : 'Handcrafted Masterpieces'}
              </h1>
              <p className="text-[#6b665f] text-xs sm:text-sm mt-1 max-w-2xl font-light">
                Sourced directly from certified karigars across India's premier GI clusters. Every acquisition sustains verified artisan livelihoods.
              </p>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 self-start md:self-end">
              <span className="text-xs text-[#6b665f] font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-50 text-[#1e1e1a] text-xs font-semibold py-2 px-3 rounded-lg border border-[#ece7df] focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="curated">Curated &amp; Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filter Pill Bar */}
      <section className="border-b border-[#ece7df] bg-white/80 backdrop-blur-sm sticky top-[108px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs text-neutral-400 font-medium mr-1 hidden sm:inline">Quick Filters:</span>

            <button
              onClick={() => setGiOnly(!giOnly)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                giOnly
                  ? 'bg-primary text-white shadow-xs border border-primary'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-[#1e1e1a] border border-[#ece7df]'
              }`}
            >
              {giOnly && <span className="material-symbols-outlined text-[14px]">check</span>}
              <span>GI Certified</span>
            </button>

            <button
              onClick={() => setReadyToShipOnly(!readyToShipOnly)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                readyToShipOnly
                  ? 'bg-primary text-white shadow-xs border border-primary'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-[#1e1e1a] border border-[#ece7df]'
              }`}
            >
              {readyToShipOnly && <span className="material-symbols-outlined text-[14px]">check</span>}
              <span>Ready to Ship (48h)</span>
            </button>

            <button
              onClick={() => setPriceBracket(priceBracket === 'under3k' ? 'all' : 'under3k')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                priceBracket === 'under3k'
                  ? 'bg-primary text-white shadow-xs border border-primary'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-[#1e1e1a] border border-[#ece7df]'
              }`}
            >
              <span>Under ₹3,000</span>
            </button>

            {(giOnly || readyToShipOnly || priceBracket !== 'all' || selectedCluster !== 'All' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold px-2 py-1 underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid & Filters Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 rounded-xl border border-[#ece7df] shadow-xs">
            {/* Cluster selection */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1e1a] mb-2.5">
                Heritage Craft Cluster
              </h3>
              <div className="space-y-1.5">
                {clusters.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCluster(c)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCluster === c ? 'bg-primary-light text-primary font-bold' : 'hover:bg-neutral-50 text-[#1e1e1a]'
                    }`}
                  >
                    <span>{c === 'All' ? 'All Indian Clusters' : `${c} Cluster`}</span>
                    {selectedCluster === c && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price bracket */}
            <div className="pt-4 border-t border-[#ece7df]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1e1a] mb-2.5">
                Direct Fair-Wage Budget
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'all', label: 'All Budgets' },
                  { id: 'under3k', label: 'Under ₹3,000' },
                  { id: '3kto8k', label: '₹3,000 - ₹8,000' },
                  { id: 'above8k', label: 'Above ₹8,000 (Heirloom Masterpieces)' }
                ].map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer text-[#1e1e1a]">
                    <input
                      type="radio"
                      name="price-bracket"
                      checked={priceBracket === b.id}
                      onChange={() => setPriceBracket(b.id)}
                      className="text-primary focus:ring-primary"
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ministry of Textiles verification callout */}
            <div className="pt-4 border-t border-[#ece7df]">
              <div className="p-3.5 rounded-lg bg-neutral-50 border border-[#ece7df] space-y-1.5 text-xs text-[#6b665f]">
                <div className="flex items-center gap-1.5 font-bold text-[#1e1e1a]">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <span>100% Provenance Seal</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every acquisition is accompanied by the official Ministry of Textiles Geographical Indication QR certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#ece7df] p-8 space-y-3">
                <span className="material-symbols-outlined text-5xl text-neutral-400">filter_alt_off</span>
                <h3 className="font-serif text-xl font-bold text-[#1e1e1a]">No crafts matched your filter</h3>
                <p className="text-xs text-[#6b665f] max-w-sm mx-auto">
                  Try clearing your search query or loosening the selected cluster and price criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 py-2 px-5 bg-primary text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
