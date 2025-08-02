'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getCurrentUser } from '@/lib/features/auth/authSlice';
import { loadCartFromStorage } from '@/lib/features/cart/cartSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check for existing token and get current user
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch(loadCartFromStorage(cartItems));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [dispatch]);

  // Save cart to localStorage whenever cart changes
  const cartItems = useAppSelector((state) => state.cart.items);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return <>{children}</>;
}