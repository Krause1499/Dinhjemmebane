import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

// ─── Typer ────────────────────────────────────────────────────────────────────

export type CartItem = {
  id: number;
  name: string;
  team: string;
  season: string;
  league: string;
  size: string;
  price: number;
  pictureUrl: string | null;
};

type CartState = { items: CartItem[] };

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.items.find((i) => i.id === action.payload.id)) return state;
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cart_v1";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: "LOAD_CART", payload: parsed });
        }
      } catch {}
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const itemCount = state.items.length;
  const total = state.items.reduce((sum, i) => sum + i.price, 0);

  function addToCart(item: CartItem) {
    dispatch({ type: "ADD_ITEM", payload: item });
  }

  function removeFromCart(id: number) {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  function isInCart(id: number) {
    return state.items.some((i) => i.id === id);
  }

  return (
    <CartContext.Provider
      value={{ items: state.items, itemCount, total, addToCart, removeFromCart, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart skal bruges inden i CartProvider");
  return ctx;
}
