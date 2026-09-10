import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { api } from '../api';

export const Checkout = ({ onReturnToShop }) => {
  const { cartItems, subtotal, totalArtisanWage, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Tracking
  const [deliveryPlan, setDeliveryPlan] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Form State
  const [pincode, setPincode] = useState('560001');
  const [mobile, setMobile] = useState('+91 98450 12890');
  const [street, setStreet] = useState('Flat 402, Kaveri Heritage Enclave, 14th Main, Near Cubbon Park');
  const [city, setCity] = useState('Bengaluru Urban');
  const [stateName, setStateName] = useState('Karnataka');
  const [isOdopHub, setIsOdopHub] = useState(true);

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const shippingFee = deliveryPlan === 'express' ? 180 : 0;
  const grandTotal = subtotal + shippingFee;

  const handlePincodeChange = (e) => {
    const val = e.target.value.trim();
    setPincode(val);
    if (val.length === 6) {
      setIsOdopHub(true);
      if (val.startsWith('56')) {
        setCity('Bengaluru Urban');
        setStateName('Karnataka');
      } else if (val.startsWith('11')) {
        setCity('New Delhi');
        setStateName('Delhi');
      } else if (val.startsWith('30')) {
        setCity('Jaipur');
        setStateName('Rajasthan');
      } else if (val.startsWith('47')) {
        setCity('Chanderi');
        setStateName('Madhya Pradesh');
      } else {
        setCity('District Hub');
        setStateName('India');
      }
    } else {
      setIsOdopHub(false);
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          title: item.title,
          price: item.price,
          artisanWage: item.artisanWage,
          artisanName: item.artisanName,
          image: item.image,
          quantity: item.quantity
        })),
        shippingAddress: {
          phone: mobile,
          pincode,
          street,
          city,
          state: stateName
        },
        deliveryPlan,
        paymentMethod
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        setConfirmedOrder(res.data);
        clearCart();
        setStep(3);

        // Confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#9f3c16', '#4059aa', '#8d4b00', '#15803d']
          });
        } catch {
          // fallback ignore
        }
      }
    } catch (err) {
      alert('Order placement note: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf8f5] flex flex-col justify-between">
      {/* Distraction-Free Header */}
      <header className="w-full bg-white border-b border-[#ece7df] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onReturnToShop}
            className="flex items-center gap-2 group border-0 bg-transparent cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-serif font-bold text-base">
              क
            </div>
            <span className="font-serif-heading text-xl font-bold text-primary">KalaSetu</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">shield</span>
            <span>Secure ONDC Fair-Wage Escrow</span>
          </div>

          <button
            onClick={onReturnToShop}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6b665f] hover:text-primary transition-colors cursor-pointer border-0 bg-transparent"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="hidden sm:inline">Return to Shop</span>
          </button>
        </div>
      </header>

      {/* Main Checkout Body */}
      <main className="w-full flex-grow py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {/* 3-Step Stepper Progress */}
          <nav aria-label="Checkout Progress" className="w-full">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#e5e2dd] -z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-500 -z-0"
                style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }}
              ></div>

              {/* Step 1: Shipping */}
              <div
                onClick={() => setStep(1)}
                className="flex flex-col items-center gap-1 bg-[#faf8f5] px-3 z-10 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm shadow-xs transition-all ${
                    step >= 1
                      ? 'bg-primary text-white ring-4 ring-primary/15'
                      : 'bg-[#e5e2dd] text-[#6b665f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </div>
                <span className={`text-xs font-semibold ${step >= 1 ? 'text-primary' : 'text-[#6b665f]'}`}>
                  1. Shipping
                </span>
              </div>

              {/* Step 2: Payment & Escrow */}
              <div
                onClick={() => setStep(2)}
                className="flex flex-col items-center gap-1 bg-[#faf8f5] px-3 z-10 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm shadow-xs transition-all ${
                    step >= 2
                      ? 'bg-primary text-white ring-4 ring-primary/15'
                      : 'bg-[#e5e2dd] text-[#6b665f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <span className={`text-xs font-semibold ${step >= 2 ? 'text-primary' : 'text-[#6b665f]'}`}>
                  2. Payment &amp; Escrow
                </span>
              </div>

              {/* Step 3: Provenance Tracking */}
              <div className="flex flex-col items-center gap-1 bg-[#faf8f5] px-3 z-10">
                <div
                  className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm shadow-xs transition-all ${
                    step === 3
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-600/15 animate-bounce'
                      : 'bg-[#e5e2dd] text-[#6b665f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <span className={`text-xs font-semibold ${step === 3 ? 'text-emerald-700' : 'text-[#6b665f]'}`}>
                  3. Live Provenance
                </span>
              </div>
            </div>
          </nav>

          {/* STEP 1 & 2: Shipping Form & Order Summary */}
          {step <= 2 && (
            <>
              {/* Shipping Address Section */}
              <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#ece7df] shadow-xs space-y-5">
                <div className="flex items-baseline justify-between border-b border-[#ece7df] pb-3">
                  <div>
                    <h2 className="font-serif-heading text-lg font-bold text-[#1e1e1a] flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
                      <span>Shipping Destination</span>
                    </h2>
                    <p className="text-xs text-[#6b665f] mt-0.5">Direct cluster transit via India Post Postal Craft Network</p>
                  </div>
                  <button
                    onClick={() => {
                      setPincode('560001');
                      setCity('Bengaluru Urban');
                      setStateName('Karnataka');
                      setIsOdopHub(true);
                    }}
                    className="text-xs font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    <span>Bengaluru Hub</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Pincode & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1e1e1a] mb-1">
                        Pincode *
                      </label>
                      <div className="relative">
                        <input
                          value={pincode}
                          onChange={handlePincodeChange}
                          maxLength={6}
                          placeholder="e.g. 560001"
                          type="text"
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                        {isOdopHub && (
                          <span className="absolute right-2.5 top-2 text-[11px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <span className="material-symbols-outlined text-[13px] text-emerald-700">check_circle</span>
                            ODOP Hub
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1e1e1a] mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <input
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="+91"
                          type="tel"
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                        <span className="absolute right-2.5 top-2 text-[11px] text-[#6b665f] flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                          SMS Tracking
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1e1e1a] mb-1">
                      Full Street Address &amp; Landmark *
                    </label>
                    <input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="House / Flat No, Road name, Landmark"
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#ece7df] rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* City & State Auto-fill */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        City / District
                      </label>
                      <input
                        value={city}
                        readOnly
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-neutral-100 border border-transparent rounded-lg text-sm text-[#1e1e1a] cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        State
                      </label>
                      <input
                        value={stateName}
                        readOnly
                        type="text"
                        className="w-full px-3.5 py-2.5 bg-neutral-100 border border-transparent rounded-lg text-sm text-[#1e1e1a] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1e1e1a] mb-2">
                    Rural Cluster Delivery Plan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDeliveryPlan('standard')}
                      className={`relative flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryPlan === 'standard'
                          ? 'border-primary bg-primary/5'
                          : 'border-[#ece7df] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery-plan"
                            checked={deliveryPlan === 'standard'}
                            onChange={() => setDeliveryPlan('standard')}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-xs font-bold text-[#1e1e1a]">Standard Rural Post</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">FREE</span>
                      </div>
                      <p className="text-[11px] text-[#6b665f] mt-1.5 pl-6">
                        4-5 days direct transit via India Post Craft Logistics from MP, CG, &amp; RJ clusters.
                      </p>
                    </label>

                    <label
                      onClick={() => setDeliveryPlan('express')}
                      className={`relative flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        deliveryPlan === 'express'
                          ? 'border-primary bg-primary/5'
                          : 'border-[#ece7df] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery-plan"
                            checked={deliveryPlan === 'express'}
                            onChange={() => setDeliveryPlan('express')}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-xs font-bold text-[#1e1e1a]">Express Handcrafted Courier</span>
                        </div>
                        <span className="text-xs font-bold text-[#1e1e1a]">₹180</span>
                      </div>
                      <p className="text-[11px] text-[#6b665f] mt-1.5 pl-6">
                        2-day dedicated air dispatch with silk-grade archival protective packaging.
                      </p>
                    </label>
                  </div>
                </div>
              </section>

              {/* Order Items & Cost Breakdown */}
              <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#ece7df] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#ece7df] pb-3">
                  <h2 className="font-serif-heading text-lg font-bold text-[#1e1e1a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
                    <span>Order Summary ({cartItems.length} Items)</span>
                  </h2>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Fair-Wage Guaranteed
                  </span>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3.5 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                      <img src={item.image} alt={item.title} className="w-14 h-16 object-cover rounded shadow-xs flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#1e1e1a] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#6b665f]">Artisan: {item.artisanName}</p>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          ₹{(item.artisanWage * item.quantity).toLocaleString()} direct artisan wage
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-[#1e1e1a]">₹{(item.price * item.quantity).toLocaleString()}</span>
                        <span className="block text-[10px] text-neutral-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="pt-3 border-t border-[#ece7df] space-y-2 text-xs text-[#6b665f]">
                  <div className="flex justify-between">
                    <span>Craft Items Net Value</span>
                    <span className="text-[#1e1e1a] font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-primary/5 p-2 rounded-lg text-primary font-semibold">
                    <span>Fair Artisan Payout (Direct Guild Ledger)</span>
                    <span className="font-bold">₹{totalArtisanWage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={deliveryPlan === 'free' || shippingFee === 0 ? 'text-emerald-700 font-bold' : 'font-bold text-[#1e1e1a]'}>
                      {shippingFee === 0 ? 'FREE (₹0)' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#ece7df] text-base font-bold text-[#1e1e1a]">
                    <span>Total Payable to Escrow</span>
                    <span className="text-primary font-serif text-xl">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              {/* Payment & Escrow Method */}
              <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#ece7df] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#ece7df] pb-3">
                  <h2 className="font-serif-heading text-lg font-bold text-[#1e1e1a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                    <span>Payment &amp; Escrow Method</span>
                  </h2>
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded font-medium">
                    Zero Gateway Fees
                  </span>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-[#ece7df] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1e1e1a] block">UPI Instant (GPay / PhonePe / QR)</span>
                        <span className="text-[11px] text-[#6b665f]">Direct instant checkout via any UPI application</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary-light px-2 py-1 rounded">Instant</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('ondc')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer ${
                      paymentMethod === 'ondc' ? 'border-primary bg-primary/5' : 'border-[#ece7df] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'ondc'}
                        onChange={() => setPaymentMethod('ondc')}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1e1e1a] block">ONDC Smart Escrow Protocol</span>
                        <span className="text-[11px] text-[#6b665f]">Locked in decentralized escrow until doorstep verification</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer ${
                      paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-[#ece7df] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1e1e1a] block">Credit / Debit Cards</span>
                        <span className="text-[11px] text-[#6b665f]">RuPay, Visa, Mastercard accepted</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-neutral-400 text-[20px]">credit_card</span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-3 space-y-2">
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full py-4 px-6 bg-primary hover:bg-[#862f0f] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span>
                      {isSubmitting
                        ? 'Locking Escrow with Ministry of Textiles...'
                        : `Confirm Order & Lock Artisan Escrow (₹${grandTotal.toLocaleString()})`}
                    </span>
                  </button>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#6b665f]">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">lock</span>
                    <span>Protected with 256-bit SSL encryption &amp; ONDC Fair Wage Guarantee</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* STEP 3: Live Provenance & Consignment Tracking */}
          {step === 3 && confirmedOrder && (
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ece7df] shadow-md space-y-6 animate-in fade-in duration-500">
              <div className="text-center space-y-2 border-b border-[#ece7df] pb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <h2 className="font-serif-heading text-2xl font-bold text-[#1e1e1a]">
                  Order Confirmed &amp; Escrow Locked!
                </h2>
                <p className="text-xs text-[#6b665f] max-w-md mx-auto">
                  Escrow funds (₹{confirmedOrder.artisanEscrowAmount?.toLocaleString()}) are held securely and will be released to the artisan guilds upon your doorstep verification.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary font-bold text-xs">
                  <span>Consignment #{confirmedOrder.trackingNumber}</span>
                </div>
              </div>

              {/* Milestone Tracking Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e1e1a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">timeline</span>
                  <span>Live Loom-to-Doorstep Milestones</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {confirmedOrder.milestones?.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        m.completed
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : m.active
                          ? 'bg-primary-light border-primary/40 shadow-xs'
                          : 'bg-neutral-50 border-neutral-200 opacity-60'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                          m.completed
                            ? 'bg-emerald-600'
                            : m.active
                            ? 'bg-primary animate-pulse'
                            : 'bg-neutral-300'
                        }`}
                      ></span>
                      <div>
                        <span className="text-xs font-bold text-[#1e1e1a] block">{m.name}</span>
                        <span className="text-[11px] text-[#6b665f] block">{m.description}</span>
                        <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items summary in order */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                <div className="font-bold text-[#1e1e1a]">Consignment Items:</div>
                {confirmedOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[#6b665f]">
                    <span>{it.title} × {it.quantity || 1}</span>
                    <span className="font-bold text-[#1e1e1a]">₹{(it.price * (it.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 font-bold text-[#1e1e1a]">
                  <span>Total Escrow Amount</span>
                  <span className="text-primary font-serif text-base">₹{confirmedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Return to Shop Button */}
              <div className="pt-2">
                <button
                  onClick={onReturnToShop}
                  className="w-full py-3.5 px-6 bg-primary hover:bg-[#862f0f] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Continue Exploring Crafts</span>
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
