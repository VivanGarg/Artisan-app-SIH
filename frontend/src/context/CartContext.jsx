import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kalasetu_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'prod-1',
          productId: 'prod-1',
          title: 'Handwoven Chanderi Katan Silk Saree',
          price: 7850,
          artisanWage: 6900,
          artisanName: 'Smt. Yashoda Bai (MP)',
          cluster: 'Chanderi, MP',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBPY7EbJCXidlF6lx6HV-VpQZBfi3UrBiCVxciTPfXYuJxHS1LsdC4DuK2fm6Auj-JUZcP-BiTArfk75pt78-THQNztLr5JS143pOdVGS8g1W4dj8QmfdqpdS-l-TO4C1bMndQlw0sepSGxP8NNogQxD1MQH5fWHewBJwIKC-5pjhj6xZpVMYrhwtA--eiCRCMMrYuivANNGYzuns1N7HZhzHkYiK1GfddD3fZKML2mcZk6-Cak1eX',
          quantity: 1
        },
        {
          id: 'prod-2',
          productId: 'prod-2',
          title: 'Dokra Bell Metal Sacred Nandi',
          price: 2890,
          artisanWage: 2350,
          artisanName: 'Shri Budhram Kashyap (Bastar)',
          cluster: 'Bastar, Chhattisgarh',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPWcYRuuACjAdse5B084ZirHZxsHD5G2cGLV4atMFpoGFpZEfvDtZ_PPDb4vOw69xJJZ4y225dk08VfDbHP_-9RW12trE7XFQB87H_SoZ1MTlXroIV6RmOTYoILfVvBkQQJNI50VvArAz0rdvY7DxwFwFVViSH1Dn-URtU9J9UIoNuWVj_sV0LKIZXGuwi8BxedbFnUbqJF2zCnt3uGNKh1aoETZoxAXjiuWUCaOIJSQxNqlpwWaer',
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kalasetu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id || item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id || item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          title: product.title,
          price: product.price,
          artisanWage: product.artisanWage || Math.round(product.price * 0.85),
          artisanName: product.artisanName,
          cluster: product.cluster,
          image: product.images?.[0] || '',
          quantity
        }
      ];
    });
    setCartDrawerOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id && item.productId !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id || item.productId === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalArtisanWage = cartItems.reduce((sum, item) => sum + item.artisanWage * item.quantity, 0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalArtisanWage,
        totalItemCount,
        cartDrawerOpen,
        setCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
