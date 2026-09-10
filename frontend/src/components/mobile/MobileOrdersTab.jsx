import React, { useState } from 'react';
import { api } from '../../api';

export const MobileOrdersTab = ({ onBrowseCrafts }) => {
  const [searchTracking, setSearchTracking] = useState('KS-98241');
  const [activeOrder, setActiveOrder] = useState({
    trackingNumber: 'KS-98241',
    orderNumber: 'ORD-98241',
    totalAmount: 10740,
    artisanEscrowAmount: 8750,
    status: 'in_transit',
    items: [
      { title: 'Pure Katan Silk Chanderi Saree', artisanName: 'Smt. Yashoda Bai', price: 7850 },
      { title: 'Dokra Bell Metal Sacred Nandi', artisanName: 'Shri Budhram Kashyap', price: 2890 }
    ],
    milestones: [
      { name: 'Ordered', description: 'Escrow locked', completed: true, active: false, time: 'Yesterday, 10:30 AM' },
      { name: 'Loom Finished', description: 'Weaver complete', completed: true, active: false, time: 'Yesterday, 04:15 PM' },
      { name: 'Inspected', description: 'GI tag & Silk Mark verified', completed: true, active: false, time: 'Today, 09:00 AM' },
      { name: 'In Transit', description: 'India Post Craft Logistics Depot', completed: false, active: true, time: 'Out for transit' },
      { name: 'Delivered', description: 'Escrow released on verification', completed: false, active: false, time: 'Expected in 48h' }
    ]
  });

  const handleSearchOrder = async () => {
    if (!searchTracking) return;
    try {
      const res = await api.getOrder(searchTracking.trim());
      if (res.data) {
        setActiveOrder(res.data);
      }
    } catch {
      alert('Could not find order #' + searchTracking);
    }
  };

  return (
    <div className="space-y-3.5 p-3.5 pb-8">
      {/* Search Tracking Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#ece7df] shadow-xs space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#57423b] flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-[15px]">search</span>
          <span>Track Any Consignment</span>
        </label>
        <div className="flex gap-2">
          <input
            value={searchTracking}
            onChange={(e) => setSearchTracking(e.target.value)}
            placeholder="e.g. KS-98241"
            className="flex-1 px-3 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs font-mono focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleSearchOrder}
            className="px-3.5 py-1.5 bg-primary hover:bg-[#862f0f] text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
          >
            Track
          </button>
        </div>
      </div>

      {/* Active Consignment Card */}
      {activeOrder && (
        <div className="bg-white p-4 rounded-2xl border border-[#ece7df] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#ece7df] pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Consignment</span>
              <h3 className="font-mono text-sm font-bold text-[#1c1c19]">#{activeOrder.trackingNumber}</h3>
            </div>
            <span className="text-[10px] font-bold text-secondary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Escrow Locked (₹{activeOrder.artisanEscrowAmount?.toLocaleString()})
            </span>
          </div>

          {/* Loom-to-Doorstep Milestones */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#57423b] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-secondary">timeline</span>
              <span>Loom-to-Doorstep Provenance</span>
            </span>

            <div className="space-y-2">
              {activeOrder.milestones?.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                    m.completed
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : m.active
                      ? 'bg-primary-light border-primary/40 shadow-xs'
                      : 'bg-neutral-50 border-neutral-100 opacity-60'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                      m.completed
                        ? 'bg-emerald-600'
                        : m.active
                        ? 'bg-primary animate-pulse'
                        : 'bg-neutral-300'
                    }`}
                  ></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1c1c19]">{m.name}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">{m.time}</span>
                    </div>
                    <span className="text-[10px] text-[#57423b] block">{m.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consignment Items */}
          <div className="pt-2 border-t border-[#ece7df] space-y-1 text-[11px] text-[#57423b]">
            <span className="font-bold text-[#1c1c19] block mb-1">Items in Shipment:</span>
            {activeOrder.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{it.title}</span>
                <span className="font-bold text-[#1c1c19]">₹{it.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
