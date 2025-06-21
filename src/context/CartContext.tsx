'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/shopping';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('장바구니를 불러오는 중 오류가 발생했습니다:', error);
      }
    }
  }, []);

  // 장바구니가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  // 상품을 장바구니에 추가
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // 이미 장바구니에 있는 상품이면 수량만 증가
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // 새로운 상품이면 장바구니에 추가
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 장바구니에서 상품 제거
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // 상품 수량 업데이트
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCartItems([]);
  };

  // 장바구니에 상품이 있는지 확인
  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  // 장바구니 총 상품 수 계산
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // 장바구니 총 금액 계산
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.discountRate ? 
      (item.price * (100 - item.discountRate) / 100) * item.quantity : 
      item.price * item.quantity
    ), 0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
