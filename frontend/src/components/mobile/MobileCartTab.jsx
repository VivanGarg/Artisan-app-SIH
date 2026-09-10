import React from 'react';
import { useCart } from '../../context/CartContext';

export const MobileCartTab = ({ onProceedToCheckout, onBrowseCrafts }) => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, totalArtisanWage } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
          <span className="material-symbols-outlined text-3xl">production_quantity_limits</span>
        </div>
        <h3 className="font-serif text-base font-bold text-[#1c1c19]">Your Artisan Cart is Empty</h3>
        <p className="text-xs text-[#57423b] max-w-xs">
          Explore thousands of GI certified authentic master weaver creations directly from maker clusters.
        </p>
        <button
          onClick={onBrowseCrafts}
          className="mt-2 py-2.5 px-5 bg-primary text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          Explore Handloom Crafts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 p-3.5 pb-8 flex flex-col flex-1 justify-between">
      <div className="space-y-3">
        {/* Fair Wage Contribution Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium shadow-2xs">
          <span className="material-symbols-outlined text-emerald-700 text-[20px]">volunteer_activism</span>
          <div>
            <span className="font-bold">₹{totalArtisanWage.toLocaleString()}</span> directly empowers master artisans
          </div>
        </div>

        {/* Cart Item Cards */}
        <div className="space-y-2.5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-white border border-[#ece7df] flex items-center gap-3 shadow-xs"
            >
              <img src={item.image} alt={item.title} className="w-16 h-18 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-xs font-bold text-[#1c1c19] truncate">{item.title}</h4>
                <p className="text-[10px] text-[#57423b] truncate">Artisan: {item.artisanName}</p>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                  ₹{(item.artisanWage * item.quantity).toLocaleString()} direct wage
                </div>

                {/* Steppers */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right flex flex-col justify-between items-end self-stretch py-0.5">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                </button>
                <span className="font-serif text-sm font-bold text-primary">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary & Checkout */}
      <div className="pt-4 border-t border-[#ece7df] space-y-3 bg-white p-4 rounded-2xl border shadow-xs">
        <div className="space-y-1 text-xs text-[#57423b]">
          <div className="flex justify-between">
            <span>Crafts Net Value</span>
            <span className="text-[#1c1c19] font-bold">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-emerald-800 font-semibold">
            <span>Direct Guild Wage</span>
            <span>₹{totalArtisanWage.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Subsidized Rural Post</span>
            <span className="text-emerald-800 font-bold">FREE (₹0)</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#ece7df] text-sm font-bold text-[#1c1c19]">
            <span>Total Escrow Payable</span>
            <span className="text-primary font-serif text-base">₹{subtotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onProceedToCheckout}
          className="w-full py-3.5 px-4 bg-primary hover:bg-[#862f0f] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">lock</span>
          <span>Proceed to Escrow Checkout (₹{subtotal.toLocaleString()})</span>
        </button>
      </div>
    </div>
  );
};
