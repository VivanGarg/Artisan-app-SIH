import React from 'react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalArtisanWage
  } = useCart();

  if (!cartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#faf8f5] h-full shadow-2xl flex flex-col border-l border-[#ece7df] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#ece7df] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">shopping_bag</span>
            <h2 className="font-serif-heading text-lg font-bold text-[#1e1e1a]">
              Artisan Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Fair Wage Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-3 px-5 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
          <span className="material-symbols-outlined text-emerald-700 text-[18px]">volunteer_activism</span>
          <div>
            <span className="font-bold">₹{totalArtisanWage.toLocaleString()}</span> directly empowers registered master artisans
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 space-y-3">
              <span className="material-symbols-outlined text-5xl">production_quantity_limits</span>
              <p className="text-sm font-medium">Your artisan cart is empty</p>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="mt-2 text-xs font-bold text-primary hover:underline"
              >
                Browse authentic crafts
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-[#ece7df] shadow-xs"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-18 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1e1e1a] truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#6b665f] truncate mt-0.5">
                    Artisan: {item.artisanName}
                  </p>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-1">
                    ₹{(item.artisanWage * item.quantity).toLocaleString()} direct wage
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between items-end self-stretch py-1">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                  <span className="font-serif text-sm font-bold text-primary">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#ece7df] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#6b665f]">
              <div className="flex justify-between">
                <span>Subtotal Net Value</span>
                <span className="text-[#1e1e1a] font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Direct Guild Wage</span>
                <span>₹{totalArtisanWage.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Subsidized Rural Post</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCartDrawerOpen(false);
                if (onProceedToCheckout) onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 bg-primary hover:bg-[#862f0f] text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Lock Escrow &amp; Checkout (₹{subtotal.toLocaleString()})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
