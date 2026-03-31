import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';
import { Typography, FontWeight } from '../../theme/typography';
import { Coupon } from '../../features/cart/types/cart.types';
import { TopCouponsSection } from './TopCouponsSection';

type CartSummaryLike = {
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  platformFee: number;
  totalPayable: number;
  savings: number;
  isFreeDeliveryUnlocked: boolean;
  remainingForFreeDelivery: number;
};

type Props = {
  coupons: Coupon[];
  onApplyCoupon: (couponId: string) => Promise<void>;
  cashbackAmount?: number;
  summary: CartSummaryLike | null;
};

export const CartCheckoutDetailsSection = ({
  coupons,
  onApplyCoupon,
  cashbackAmount,
  summary,
}: Props) => {
  return (
    <>
      <TopCouponsSection
        coupons={coupons}
        onApplyCoupon={onApplyCoupon}
      />

      {cashbackAmount ? (
        <View style={styles.sectionCard}>
          <View style={styles.cashbackCard}>
            <View style={styles.cashbackIconCircle}>
              <Text style={styles.cashbackIconText}>₹</Text>
            </View>

            <View style={styles.cashbackTextWrap}>
              <Text style={styles.cashbackTitle}>
                Add items worth ₹45 more to get 1% cashback
              </Text>
              <Text style={styles.cashbackSubtitle}>No coupon needed</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Item total</Text>
          <Text style={styles.priceValue}>₹{summary?.itemTotal ?? 0}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery fee</Text>
          <Text
            style={[
              styles.priceValue,
              summary?.deliveryFee === 0 && styles.freeText,
            ]}
          >
            {summary?.deliveryFee === 0
              ? 'FREE'
              : `₹${summary?.deliveryFee ?? 0}`}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Discount</Text>
          <Text style={[styles.priceValue, styles.discountText]}>
            -₹{summary?.discount ?? 0}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Platform fee</Text>
          <Text style={styles.priceValue}>₹{summary?.platformFee ?? 0}</Text>
        </View>

        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total payable</Text>
          <Text style={styles.totalValue}>₹{summary?.totalPayable ?? 0}</Text>
        </View>

        <View style={styles.savingsBox}>
          <Text style={styles.savingsText}>
            You are saving ₹{summary?.savings ?? 0} on this order
          </Text>
        </View>

        {!summary?.isFreeDeliveryUnlocked ? (
          <Text style={styles.freeDeliveryHint}>
            Add items worth ₹{summary?.remainingForFreeDelivery ?? 0} more for
            free delivery
          </Text>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
        <Text style={styles.policyText}>
          Orders can be cancelled before they are packed for dispatch. Once
          packed, cancellation may not be possible.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  cashbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cashbackIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  cashbackIconText: {
    color: Colors.primaryDark,
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
  },

  cashbackTextWrap: {
    flex: 1,
  },

  cashbackTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  cashbackSubtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },

  priceLabel: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  priceValue: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },

  freeText: {
    color: Colors.success,
  },

  discountText: {
    color: Colors.success,
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },

  totalLabel: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  totalValue: {
    fontSize: Typography.heading,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  savingsBox: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },

  savingsText: {
    fontSize: Typography.body,
    color: Colors.infoText,
    fontWeight: FontWeight.semibold,
  },

  freeDeliveryHint: {
    marginTop: Spacing.md,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },

  policyText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});