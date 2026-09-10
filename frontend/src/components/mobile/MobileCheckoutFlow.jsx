import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { api } from '../../api';

export const MobileCheckoutFlow = ({ onComplete, onCancel }) => {
  const { cartItems, subtotal, totalArtisanWage, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [deliveryPlan, setDeliveryPlan] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [pincode, setPincode] = useState('560001');
  const [mobile, setMobile] = useState('+91 98450 12890');
  const [street, setStreet] = useState('Flat 402, Kaveri Heritage Enclave, 14th Main');
  const [city, setCity] = useState('Bengaluru Urban');
  const [stateName, setStateName] = useState('Karnataka');
  const [isOdopHub, setIsOdopHub] = useState(true);

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

        try {
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#9f3c16', '#4059aa', '#8d4b00', '#15803d']
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      alert('Order notice: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3.5 p-3.5 pb-8">
      {/* Stepper Progress Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#ece7df] shadow-xs text-xs">
        <div className={`flex items-center gap-1 font-bold ${step >= 1 ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">1</span>
          <span>Address</span>
        </div>
        <span className="text-neutral-300">→</span>
        <div className={`flex items-center gap-1 font-bold ${step >= 2 ? 'text-primary' : 'text-neutral-400'}`}>
          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">2</span>
          <span>Payment</span>
        </div>
        <span className="text-neutral-300">→</span>
        <div className={`flex items-center gap-1 font-bold ${step === 3 ? 'text-emerald-700' : 'text-neutral-400'}`}>
          <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px]">3</span>
          <span>Tracking</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-4 rounded-2xl border border-[#ece7df] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#ece7df] pb-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1c1c19]">
              Shipping Destination
            </h3>
            <span className="text-[10px] text-primary font-bold">India Post Network</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#57423b] mb-0.5">Pincode *</label>
              <div className="relative">
                <input
                  value={pincode}
                  onChange={handlePincodeChange}
                  maxLength={6}
                  className="w-full px-3 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs font-mono"
                />
                {isOdopHub && (
                  <span className="absolute right-2 top-1.5 text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    ODOP Hub
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#57423b] mb-0.5">Mobile Number *</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#57423b] mb-0.5">Address *</label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#faf7f2] border border-[#ece7df] rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-0.5">City</label>
                <input
                  value={city}
                  readOnly
                  className="w-full px-3 py-1.5 bg-neutral-100 border border-transparent rounded-xl text-xs text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-0.5">State</label>
                <input
                  value={stateName}
                  readOnly
                  className="w-full px-3 py-1.5 bg-neutral-100 border border-transparent rounded-xl text-xs text-neutral-600"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-primary hover:bg-[#862f0f] text-white rounded-xl text-xs font-bold shadow-xs mt-2 cursor-pointer"
          >
            Continue to Payment &amp; Escrow →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-4 rounded-2xl border border-[#ece7df] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#ece7df] pb-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1c1c19]">
              Escrow Payment Method
            </h3>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Zero Surcharge
            </span>
          </div>

          <div className="space-y-2">
            <label
              onClick={() => setPaymentMethod('upi')}
              className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer ${
                paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-[#ece7df] bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-primary" />
                <div>
                  <span className="text-xs font-bold text-[#1c1c19] block">UPI Instant (GPay / PhonePe / Paytm)</span>
                  <span className="text-[10px] text-[#57423b]">Direct instant lock</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded">Instant</span>
            </label>

            <label
              onClick={() => setPaymentMethod('ondc')}
              className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer ${
                paymentMethod === 'ondc' ? 'border-primary bg-primary/5' : 'border-[#ece7df] bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <input type="radio" checked={paymentMethod === 'ondc'} onChange={() => setPaymentMethod('ondc')} className="text-primary" />
                <div>
                  <span className="text-xs font-bold text-[#1c1c19] block">ONDC Smart Escrow Protocol</span>
                  <span className="text-[10px] text-[#57423b]">Released on doorstep verification</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-primary">hub</span>
            </label>
          </div>

          {/* Cost Summary */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-800">
              <span>Direct Artisan Wages</span>
              <span className="font-bold">₹{totalArtisanWage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-200 font-bold text-sm">
              <span>Total Escrow Amount</span>
              <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary hover:bg-[#862f0f] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>
              {isSubmitting ? 'Locking Escrow...' : `Confirm Order & Lock Escrow (₹${grandTotal.toLocaleString()})`}
            </span>
          </button>
        </div>
      )}

      {step === 3 && confirmedOrder && (
        <div className="bg-white p-4 rounded-2xl border border-[#ece7df] shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#1c1c19]">Order Confirmed!</h3>
            <p className="text-xs text-[#57423b] mt-0.5">
              Escrow funds (₹{confirmedOrder.artisanEscrowAmount?.toLocaleString()}) locked with Ministry of Textiles registry.
            </p>
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-primary font-mono text-xs font-bold">
              Consignment #{confirmedOrder.trackingNumber}
            </div>
          </div>

          {/* Live Milestones */}
          <div className="space-y-2 text-left pt-2 border-t border-[#ece7df]">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#57423b]">
              Loom-to-Doorstep Progress
            </h4>
            {confirmedOrder.milestones?.map((m, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex items-start gap-2 text-xs ${
                  m.completed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m.completed ? 'bg-emerald-600' : 'bg-neutral-300'}`}></span>
                <div>
                  <span className="font-bold block text-[#1c1c19]">{m.name}</span>
                  <span className="text-[10px] text-[#57423b]">{m.description}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-primary hover:bg-[#862f0f] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            Done &amp; Return to Shop
          </button>
        </div>
      )}
    </div>
  );
};
