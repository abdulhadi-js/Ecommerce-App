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
    syncCart: (state, action: PayloadAction<{ id: string; name: string; price: number; image?: string; inventory: number }[]>) => {
      const serverItems = action.payload;
      // Filter out items that no longer exist on the server
      state.items = state.items.filter(localItem => 
        serverItems.some(serverItem => serverItem.id === localItem.id)
      );

      // Update remaining items with fresh data
      state.items.forEach(localItem => {
        const serverItem = serverItems.find(s => s.id === localItem.id);
        if (serverItem) {
          localItem.name = serverItem.name;
          localItem.price = serverItem.price;
          localItem.image = serverItem.image;
          // Ensure quantity doesn't exceed available inventory
          if (localItem.quantity > serverItem.inventory) {
             localItem.quantity = serverItem.inventory;
          }
        }
      });
      
      // Remove items with 0 quantity (if stock ran out)
      state.items = state.items.filter(item => item.quantity > 0);

      if (typeof window !== "undefined") {
        localStorage.setItem("redux-cart", JSON.stringify(state));
      }
    },
  },
});

export const { addItem, removeItem, clearCart, updateQuantity, syncCart } = cartSlice.actions;
export default cartSlice.reducer;