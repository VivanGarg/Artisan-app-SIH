import React from 'react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav = ({ mode, activeTab, setActiveTab, onSwitchMode }) => {
  const { totalItemCount } = useCart();

  if (mode === 'artisan') {
    return (
      <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ece7df] py-1.5 px-3 select-none shadow-lg">
        <div className="flex items-center justify-around">
          {/* Studio Home */}
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'studio' ? 'text-secondary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-[10px]">Studio</span>
          </button>

          {/* Voice Listing */}
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'voice' ? 'text-secondary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
            }`}
          >
            <div className="w-8 h-8 -mt-3 rounded-full bg-secondary text-white flex items-center justify-center shadow-md animate-pulse">
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </div>
            <span className="text-[10px]">बोलकर लिस्ट</span>
          </button>

          {/* Loom Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders' ? 'text-secondary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
            }`}
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-[8px] font-bold text-white flex items-center justify-center">
                2
              </span>
            </div>
            <span className="text-[10px]">Orders</span>
          </button>

          {/* Switch to Buyer Mode */}
          <button
            onClick={onSwitchMode}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-primary hover:text-[#862f0f] transition-all cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            <span className="text-[10px]">Buyer Mode</span>
          </button>
        </div>
      </nav>
    );
  }

  // Buyer Mode Nav
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ece7df] py-1.5 px-2 select-none shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home / Feed */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-primary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px]">Explore</span>
        </button>

        {/* Catalog */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'catalog' ? 'text-primary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-[10px]">GI Crafts</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'cart' ? 'text-primary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {/* Orders & Tracking */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'orders' ? 'text-primary font-bold' : 'text-[#6b665f] hover:text-[#1e1e1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">local_shipping</span>
          <span className="text-[10px]">Tracking</span>
        </button>

        {/* Karigar Studio Switcher */}
        <button
          onClick={onSwitchMode}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-secondary hover:text-secondary/80 transition-all cursor-pointer font-bold"
        >
          <span className="material-symbols-outlined text-[22px]">handyman</span>
          <span className="text-[10px]">Studio</span>
        </button>
      </div>
    </nav>
  );
};
