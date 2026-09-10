import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileOnboarding } from './pages/MobileOnboarding';
import { MobileHomeTab } from './components/mobile/MobileHomeTab';
import { MobileCatalogTab } from './components/mobile/MobileCatalogTab';
import { MobileCartTab } from './components/mobile/MobileCartTab';
import { MobileOrdersTab } from './components/mobile/MobileOrdersTab';
import { MobileArtisanTab } from './components/mobile/MobileArtisanTab';
import { MobileCheckoutFlow } from './components/mobile/MobileCheckoutFlow';
import { MobileProductSheet } from './components/mobile/MobileProductSheet';
import { api } from './api';

function MobileKalaSetuApp() {
  // App navigation state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('kalasetu_mobile_onboarded') === 'true';
  });
  const [appMode, setAppMode] = useState('buyer'); // 'buyer' or 'artisan'
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'catalog', 'cart', 'orders', 'checkout', 'studio', 'voice'
  const [currentLang, setCurrentLang] = useState('en');

  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [loading, setLoading] = useState(true);

  // Load initial catalog and artisans from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, artRes] = await Promise.all([
          api.getProducts(),
          api.getArtisans()
        ]);
        if (prodRes.data) setProducts(prodRes.data);
        if (artRes.data) setArtisans(artRes.data);
      } catch (err) {
        console.error('Failed to load initial data from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOnboardingProceed = ({ role, lang }) => {
    setAppMode(role);
    setCurrentLang(lang);
    setHasCompletedOnboarding(true);
    localStorage.setItem('kalasetu_mobile_onboarded', 'true');
    setActiveTab(role === 'artisan' ? 'studio' : 'home');
  };

  const handleSwitchMode = () => {
    if (appMode === 'buyer') {
      setAppMode('artisan');
      setActiveTab('studio');
    } else {
      setAppMode('buyer');
      setActiveTab('home');
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleNavigateCatalogWithCategory = (cat) => {
    setSelectedCategory(cat || 'All Crafts');
    setActiveTab('catalog');
  };

  return (
    <div className="w-full min-h-screen bg-[#1c1c19]/5 sm:py-6 flex justify-center items-center select-none">
      {/* Mobile Application Container */}
      <div className="w-full max-w-[440px] min-h-screen sm:min-h-[850px] sm:max-h-[92vh] bg-[#faf7f2] sm:rounded-[36px] sm:shadow-2xl sm:border-[8px] sm:border-neutral-800 flex flex-col justify-between overflow-hidden relative">
        
        {/* Onboarding Screen (First-time launch or language change) */}
        {!hasCompletedOnboarding ? (
          <MobileOnboarding onProceed={handleOnboardingProceed} />
        ) : (
          <>
            {/* Native Mobile App Header */}
            <MobileHeader
              mode={appMode}
              lang={currentLang}
              onSelectLang={(l) => setCurrentLang(l)}
              onSwitchMode={handleSwitchMode}
              onOpenAuth={() => {}}
            />

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto bg-[#faf7f2] flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-3">
                  <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin"></div>
                  <p className="font-serif text-sm font-bold text-primary">
                    Connecting to ONDC Craft Clusters...
                  </p>
                </div>
              ) : (
                <>
                  {/* BUYER MODE SCREENS */}
                  {appMode === 'buyer' && (
                    <>
                      {activeTab === 'home' && (
                        <MobileHomeTab
                          products={products}
                          artisans={artisans}
                          onSelectProduct={(p) => setSelectedProduct(p)}
                          onNavigateToCatalog={handleNavigateCatalogWithCategory}
                          onSwitchToStudio={handleSwitchMode}
                        />
                      )}

                      {activeTab === 'catalog' && (
                        <MobileCatalogTab
                          products={products}
                          initialCategory={selectedCategory}
                          onSelectProduct={(p) => setSelectedProduct(p)}
                        />
                      )}

                      {activeTab === 'cart' && (
                        <MobileCartTab
                          onProceedToCheckout={() => setActiveTab('checkout')}
                          onBrowseCrafts={() => setActiveTab('catalog')}
                        />
                      )}

                      {activeTab === 'checkout' && (
                        <MobileCheckoutFlow
                          onComplete={() => setActiveTab('orders')}
                          onCancel={() => setActiveTab('cart')}
                        />
                      )}

                      {activeTab === 'orders' && (
                        <MobileOrdersTab onBrowseCrafts={() => setActiveTab('catalog')} />
                      )}
                    </>
                  )}

                  {/* ARTISAN STUDIO SCREENS */}
                  {appMode === 'artisan' && (
                    <>
                      {(activeTab === 'studio' || activeTab === 'voice') && (
                        <MobileArtisanTab
                          onProductAdded={handleProductAdded}
                          onSwitchToBuyer={handleSwitchMode}
                        />
                      )}

                      {activeTab === 'orders' && (
                        <MobileOrdersTab onBrowseCrafts={() => setActiveTab('studio')} />
                      )}
                    </>
                  )}
                </>
              )}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav
              mode={appMode}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSwitchMode={handleSwitchMode}
            />
          </>
        )}

        {/* Product Details Sheet */}
        {selectedProduct && (
          <MobileProductSheet
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onBuyNow={() => {
              setSelectedProduct(null);
              setActiveTab('checkout');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MobileKalaSetuApp />
      </CartProvider>
    </AuthProvider>
  );
}
