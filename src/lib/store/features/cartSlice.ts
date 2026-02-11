import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

// 1. Attempt to load from localStorage safely
const getInitialState = (): CartState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("redux-cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { items: [] };
      }
    }
  }
  return { items: [] };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((i) => i.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      // Save to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("redux-cart", JSON.stringify(state));
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("redux-cart", JSON.stringify(state));
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("redux-cart", JSON.stringify(state));
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
         localStorage.removeItem("redux-cart");
      }
    },
  },
});

export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;