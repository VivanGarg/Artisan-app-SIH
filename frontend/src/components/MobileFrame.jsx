import React from 'react';

export const MobileFrame = ({ children, onExitMobile }) => {
  return (
    <div className="w-full min-h-screen bg-neutral-900/90 py-4 sm:py-8 px-2 flex flex-col items-center justify-center">
      {/* Top Floating Control */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          KalaSetu Mobile Native Simulator (iOS / Android)
        </span>
        <button
          onClick={onExitMobile}
          className="text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-full border border-neutral-600 transition-colors cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
          <span>Switch to Web App View</span>
        </button>
      </div>

      {/* Simulated Device Frame */}
      <div className="relative w-full max-w-[412px] min-h-[820px] bg-[#faf7f2] rounded-[42px] shadow-2xl border-[10px] border-neutral-800 overflow-hidden flex flex-col">
        {/* Hardware Notch / Island & Status Bar */}
        <div className="w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs text-[#1c1c19]/70 select-none z-30 bg-[#faf7f2]">
          <span className="font-semibold text-[13px] tracking-tight">9:41</span>
          <div className="w-20 h-4 bg-neutral-900 rounded-full mx-auto flex items-center justify-end px-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700"></span>
          </div>
          <div className="flex items-center gap-1 text-[13px]">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="material-symbols-outlined text-[16px]">battery_full</span>
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#faf7f2]">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full py-2 flex justify-center bg-[#faf7f2] select-none">
          <div className="w-32 h-1 bg-neutral-400/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
