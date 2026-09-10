import React from 'react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#f3efe8] border-t border-[#ece7df] text-xs text-[#6b665f] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#ece7df]">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-serif font-bold text-sm">
                क
              </div>
              <span className="font-serif-heading text-lg font-bold text-[#1e1e1a]">
                KalaSetu
              </span>
            </div>
            <p className="text-xs text-[#6b665f] leading-relaxed">
              India's first direct-from-loom decentralized handicraft network. Eliminating exploitative middlemen through ONDC smart escrow and verifiable Geographical Indication (GI) tags.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#ece7df] text-[11px] font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>85%+ Direct Artisan Wage Protocol</span>
            </div>
          </div>

          {/* GI Clusters */}
          <div>
            <h4 className="font-bold text-[#1e1e1a] uppercase tracking-wider mb-3">Key GI Clusters</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('catalog', 'Chanderi')} className="hover:text-primary transition-colors text-left cursor-pointer">Chanderi Silks (Madhya Pradesh)</button></li>
              <li><button onClick={() => onNavigate('catalog', 'Bastar')} className="hover:text-primary transition-colors text-left cursor-pointer">Bastar Dokra Metal (Chhattisgarh)</button></li>
              <li><button onClick={() => onNavigate('catalog', 'Jaipur')} className="hover:text-primary transition-colors text-left cursor-pointer">Blue Pottery of Jaipur (Rajasthan)</button></li>
              <li><button onClick={() => onNavigate('catalog', 'Kashmir')} className="hover:text-primary transition-colors text-left cursor-pointer">Kashmir Pashmina &amp; Sozni (J&amp;K)</button></li>
              <li><button onClick={() => onNavigate('catalog', 'Kutch')} className="hover:text-primary transition-colors text-left cursor-pointer">Kutch Ajrakh Indigo (Gujarat)</button></li>
            </ul>
          </div>

          {/* Patron Safeguards */}
          <div>
            <h4 className="font-bold text-[#1e1e1a] uppercase tracking-wider mb-3">Trust &amp; Governance</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-primary">verified</span> Pehchan Registry Verification</li>
              <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-primary">lock</span> ONDC Smart Escrow Release</li>
              <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span> Insured India Post Rural Logistics</li>
              <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-primary">shield</span> Silk Mark &amp; Craftmark Certified</li>
            </ul>
          </div>

          {/* Audio & Accessibility */}
          <div>
            <h4 className="font-bold text-[#1e1e1a] uppercase tracking-wider mb-3">Accessible Rural Commerce</h4>
            <p className="text-xs text-[#6b665f] leading-relaxed mb-3">
              Multi-lingual voice interfaces empower rural karigars to register their crafts via voice notes in Hindi, Bundelkhandi, Gondi, and local dialects.
            </p>
            <div className="p-3 rounded-lg bg-white border border-[#ece7df] space-y-1">
              <div className="font-semibold text-[#1e1e1a]">Ministry of Textiles Support</div>
              <div className="text-[11px] text-neutral-500">Toll Free Artisan Helpline: 1800-208-4800</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 KalaSetu Federation (KarigarSetu). Built for Smart India Hackathon.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-primary cursor-pointer">Weaver Escrow Terms</span>
            <span className="hover:text-primary cursor-pointer">GI Registry Certification</span>
            <span className="hover:text-primary cursor-pointer">Buyer Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
