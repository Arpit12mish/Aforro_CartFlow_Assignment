import { create } from 'zustand';
import { cartService } from '../services/cart.service';
import {
  AddressInfo,
  CartItem,
  CartMeta,
  Coupon,
  SuggestedProduct,
} from '../types/cart.types';
import {
  calculateCartSummary,
  CartSummary,
} from '../utils/cartCalculations';

type DeliveryMode = 'slot' | 'instant';

type CartStore = {
  items: CartItem[];
  suggestedProducts: SuggestedProduct[];
  coupons: Coupon[];
  address: AddressInfo | null;
  isLoggedIn: boolean;
  deliveryMode: DeliveryMode;
  meta: CartMeta | null;

  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItemToCart: (item: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;

  applyCoupon: (couponId: string) => Promise<void>;
  removeCoupon: () => Promise<void>;

  setAddress: (address: AddressInfo | null) => void;
  setLoggedIn: (value: boolean) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;

  getSummary: () => CartSummary | null;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  suggestedProducts: [],
  coupons: [],
  address: null,
  isLoggedIn: false,
  deliveryMode: 'slot',
  meta: null,

  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });

      const data = await cartService.getCart();

      set(state => ({
        items: state.items,
        suggestedProducts: data.suggestedProducts,
        coupons: data.coupons,
        address: state.address ?? data.address ?? null,
        isLoggedIn: state.isLoggedIn,
        deliveryMode: state.deliveryMode,
        meta: data.meta,
        isLoading: false,
      }));
    } catch {
      set({
        isLoading: false,
        error: 'Failed to load cart',
      });
    }
  },

  addItemToCart: (cartItem: CartItem) => {
    set(state => {
      const existingItem = state.items.find(item => item.id === cartItem.id);

      if (existingItem) {
        const nextQuantity = existingItem.quantity + cartItem.quantity;

        return {
          items: state.items.map(item =>
            item.id === cartItem.id
              ? {
                  ...item,
                  quantity: Math.min(
                    nextQuantity,
                    item.maxQuantity ?? nextQuantity,
                  ),
                }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, cartItem],
      };
    });
  },

  increaseQuantity: (id: string) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.maxQuantity && item.quantity >= item.maxQuantity
                  ? item.quantity
                  : item.quantity + 1,
            }
          : item,
      ),
    }));
  },

  decreaseQuantity: (id: string) => {
    set(state => ({
      items: state.items
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter(item => item.quantity > 0),
    }));
  },

  removeItem: (id: string) => {
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }));
  },

  applyCoupon: async (couponId: string) => {
    try {
      set({ isLoading: true, error: null });

      const updatedCart = await cartService.applyCoupon(couponId);

      set({
        coupons: updatedCart.coupons,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: 'Failed to apply coupon',
      });
    }
  },

  removeCoupon: async () => {
    try {
      set({ isLoading: true, error: null });

      const updatedCart = await cartService.removeCoupon();

      set({
        coupons: updatedCart.coupons,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: 'Failed to remove coupon',
      });
    }
  },

  setAddress: (address: AddressInfo | null) => {
    set({ address });
  },

  setLoggedIn: (value: boolean) => {
    set({ isLoggedIn: value });
  },

  setDeliveryMode: (mode: DeliveryMode) => {
    set({ deliveryMode: mode });
  },

  getSummary: () => {
    const { items, coupons, meta } = get();

    if (!meta) {
      return null;
    }

    return calculateCartSummary(items, coupons, meta);
  },
}));