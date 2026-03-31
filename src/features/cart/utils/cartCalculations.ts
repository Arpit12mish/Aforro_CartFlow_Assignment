import { CartItem, Coupon, CartMeta } from '../types/cart.types';

export type CartSummary = {
  itemTotal: number;
  originalTotal: number;
  deliveryFee: number;
  discount: number;
  platformFee: number;
  totalPayable: number;
  savings: number;
  remainingForFreeDelivery: number;
  isFreeDeliveryUnlocked: boolean;
};

/**
 * Calculates all cart totals
 * IMPORTANT: No hardcoded values should be used in UI
 */
export const calculateCartSummary = (
  items: CartItem[],
  coupons: Coupon[],
  meta: CartMeta,
): CartSummary => {
  // 1. Actual total based on discounted price
  const itemTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 2. Original total (before discount)
  const originalTotal = items.reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.price) * item.quantity,
    0,
  );

  // 3. Get applied coupon
  const appliedCoupon = coupons.find(c => c.applied);
  const discount = appliedCoupon?.discountAmount ?? 0;

  // 4. Delivery logic
  const isFreeDeliveryUnlocked =
    itemTotal >= meta.freeDeliveryThreshold;

  const deliveryFee = isFreeDeliveryUnlocked
    ? 0
    : meta.deliveryFee;

  const remainingForFreeDelivery = Math.max(
    meta.freeDeliveryThreshold - itemTotal,
    0,
  );

  // 5. Final payable
  const totalPayable = Math.max(
    itemTotal + deliveryFee + meta.platformFee - discount,
    0,
  );

  // 6. Total savings (product discount + coupon)
  const savings = Math.max(
    originalTotal - itemTotal + discount,
    0,
  );

  return {
    itemTotal,
    originalTotal,
    deliveryFee,
    discount,
    platformFee: meta.platformFee,
    totalPayable,
    savings,
    remainingForFreeDelivery,
    isFreeDeliveryUnlocked,
  };
};