import React from 'react';
import { ProductCard } from '../components/ProductCard';

export const Home = ({ products, artisans, onSelectProduct, onNavigateToCatalog, onNavigateToArtisans }) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wide border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Zero Middleman • 85%+ Direct Artisan Wage</span>
            </div>

            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl text-[#1e1e1a] font-bold tracking-tight leading-[1.12]">
              Timeless Indian Crafts, <br />
              <span className="text-primary italic">Loom-Direct</span> to Your Home.
            </h1>

            <p className="text-base sm:text-lg text-[#6b665f] font-light max-w-xl leading-relaxed">
              Every purchase through KalaSetu connects directly with registered master karigars across India’s Geographical Indication (GI) clusters. Protected by ONDC smart escrow.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateToCatalog()}
                className="py-3.5 px-7 rounded-xl bg-primary hover:bg-[#862f0f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span>Explore GI Catalog</span>
              </button>
              <button
                onClick={() => onNavigateToCatalog(null, true)}
                className="py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-50 text-[#1e1e1a] font-bold text-sm border border-[#ece7df] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                <span>GI Certified Only</span>
              </button>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#ece7df] max-w-md">
              <div>
                <div className="font-serif-heading text-2xl font-bold text-primary">1,400+</div>
                <div className="text-xs text-[#6b665f] font-medium">Certified Crafts</div>
              </div>
              <div>
                <div className="font-serif-heading text-2xl font-bold text-secondary">88%</div>
                <div className="text-xs text-[#6b665f] font-medium">Direct Wage Share</div>
              </div>
              <div>
                <div className="font-serif-heading text-2xl font-bold text-emerald-700">100%</div>
                <div className="text-xs text-[#6b665f] font-medium">GI Provenance</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] bg-neutral-100">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBPY7EbJCXidlF6lx6HV-VpQZBfi3UrBiCVxciTPfXYuJxHS1LsdC4DuK2fm6Auj-JUZcP-BiTArfk75pt78-THQNztLr5JS143pOdVGS8g1W4dj8QmfdqpdS-l-TO4C1bMndQlw0sepSGxP8NNogQxD1MQH5fWHewBJwIKC-5pjhj6xZpVMYrhwtA--eiCRCMMrYuivANNGYzuns1N7HZhzHkYiK1GfddD3fZKML2mcZk6-Cak1eX"
                alt="Handwoven Chanderi Silk Saree"
                className="w-full h-full object-cover"
              />
              {/* Floating Provenance Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#ece7df] shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Spotlight Artifact</span>
                  <h4 className="font-serif-heading text-sm font-bold text-[#1e1e1a]">Chanderi Katan Silk Saree</h4>
                  <p className="text-[11px] text-[#6b665f]">Yashoda Bai • Pranpur Pit-Loom Cluster</p>
                </div>
                <button
                  onClick={() => {
                    const chanderi = products.find(p => p.id === 'prod-1') || products[0];
                    if (chanderi) onSelectProduct(chanderi);
                  }}
                  className="p-2.5 bg-primary text-white rounded-lg shadow-sm hover:bg-[#862f0f] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars of Authenticity */}
      <section className="bg-white border-y border-[#ece7df] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">volunteer_activism</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1e1e1a]">85%+ Direct Artisan Wages</h3>
              <p className="text-xs text-[#6b665f] mt-1 leading-relaxed">
                Funds are transparently routed to verified artisan bank accounts via ONDC protocols, eliminating conventional 60-70% agent margins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">verified</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1e1e1a]">Pehchan &amp; GI Verified</h3>
              <p className="text-xs text-[#6b665f] mt-1 leading-relaxed">
                Every handicraft carries Ministry of Textiles Pehchan registration and certified Geographical Indication tagging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">shield</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1e1e1a]">Smart Escrow Doorstep Release</h3>
              <p className="text-xs text-[#6b665f] mt-1 leading-relaxed">
                Payment remains locked in secure escrow until you receive and verify the authentic craftsmanship at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Masterpieces Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Certified Artifacts</span>
            <h2 className="font-serif-heading text-3xl font-bold text-[#1e1e1a] mt-1">
              Curated GI Masterpieces
            </h2>
            <p className="text-xs sm:text-sm text-[#6b665f] mt-1">
              Handcrafted in authentic rural clusters. Each piece directly supports artisan livelihoods.
            </p>
          </div>
          <button
            onClick={() => onNavigateToCatalog()}
            className="text-xs font-bold text-primary hover:text-[#862f0f] flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* Master Karigars Roster Section */}
      <section className="bg-[#f3efe8] py-16 px-4 sm:px-6 border-t border-[#ece7df]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Living National Treasures</span>
            <h2 className="font-serif-heading text-3xl font-bold text-[#1e1e1a] mt-1">
              Meet the Master Artisans
            </h2>
            <p className="text-xs sm:text-sm text-[#6b665f] mt-1">
              Meet the generational weavers and sculptors who bring thousands of years of Indian heritage to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisans.map((art) => (
              <div key={art.id} className="bg-white rounded-xl p-5 border border-[#ece7df] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={art.avatar}
                      alt={art.name}
                      className="w-13 h-13 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#1e1e1a]">{art.name}</h4>
                      <p className="text-[11px] text-primary font-semibold">{art.title}</p>
                      <p className="text-[10px] text-neutral-400">{art.cluster}, {art.state}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6b665f] leading-relaxed line-clamp-3 mb-3">
                    {art.bio}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    {art.pehchanId}
                  </span>
                  <button
                    onClick={() => onNavigateToCatalog(art.cluster.split(',')[0].trim())}
                    className="text-primary font-bold hover:underline cursor-pointer"
                  >
                    View Crafts →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
