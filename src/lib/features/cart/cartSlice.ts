import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const { id, quantity = 1, ...productData } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= productData.stock) {
          existingItem.quantity = newQuantity;
        } else {
          existingItem.quantity = productData.stock;
        }
      } else {
        state.items.push({
          id,
          quantity: Math.min(quantity, productData.stock),
          ...productData,
        });
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else if (quantity <= item.stock) {
          item.quantity = quantity;
        } else {
          item.quantity = item.stock;
        }
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    loadCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  calculateTotals,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;