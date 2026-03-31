import { mockCartResponse } from '../data/cart.mock';
import { CartResponse } from '../types/cart.types';

/**
 * Simulates network delay
 */
const wait = (ms: number): Promise<void> =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

/**
 * Mock service layer
 * This mimics real API calls
 */
export const cartService = {
  /**
   * Fetch cart data
   */
  async getCart(): Promise<CartResponse> {
    await wait(400);
    return mockCartResponse;
  },

  /**
   * Apply coupon (mock behavior)
   */
  async applyCoupon(couponId: string): Promise<CartResponse> {
    await wait(300);

    const updatedCoupons = mockCartResponse.coupons.map(coupon => ({
      ...coupon,
      applied: coupon.id === couponId,
    }));

    return {
      ...mockCartResponse,
      coupons: updatedCoupons,
    };
  },

  /**
   * Remove coupon
   */
  async removeCoupon(): Promise<CartResponse> {
    await wait(300);

    const updatedCoupons = mockCartResponse.coupons.map(coupon => ({
      ...coupon,
      applied: false,
    }));

    return {
      ...mockCartResponse,
      coupons: updatedCoupons,
    };
  },
};