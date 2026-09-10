import React from 'react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-[#ece7df] overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* GI Certification Tag */}
        {product.giCertified && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/90 backdrop-blur-md text-[11px] font-bold text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="material-symbols-outlined text-[13px] text-emerald-700">verified</span>
              {product.giCode || 'GI Certified'}
            </span>
          </div>
        )}

        {/* Dispatch Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {product.dispatchTime || 'Ready to Dispatch'}
          </span>
        </div>

        {/* Quick View overlay button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 pointer-events-none">
          <span className="bg-white/95 text-primary text-xs font-bold py-2 px-4 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            View Heritage Dossier
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Cluster & State */}
          <div className="flex items-center justify-between text-[11px] text-[#6b665f] font-medium mb-1">
            <span className="truncate">{product.cluster}, {product.state}</span>
            {product.rating && (
              <span className="flex items-center text-primary font-bold">
                ★ {product.rating} <span className="text-neutral-400 font-normal ml-0.5">({product.reviewCount || 12})</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-base font-bold text-[#1e1e1a] line-clamp-1 hover:text-primary transition-colors cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Artisan Credit */}
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            By <span className="font-semibold text-neutral-700">{product.artisanName}</span>
          </p>

          {/* Direct Wage Payout Highlight */}
          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/60 w-fit">
            <span className="material-symbols-outlined text-[13px] text-emerald-700">volunteer_activism</span>
            <span>₹{product.artisanWage?.toLocaleString() || Math.round(product.price * 0.85).toLocaleString()} direct artisan wage ({product.fairWagePercentage || 85}%)</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-[#ece7df] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-tertiary">{discountPercent}% Fair-Direct Discount</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="py-2 px-3 rounded-lg bg-primary hover:bg-[#862f0f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            type="button"
            title="Add to Cart"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
