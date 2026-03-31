import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { FontWeight } from '../../theme/typography';
import { Coupon } from '../../features/cart/types/cart.types';

type Props = {
  coupons: Coupon[];
  onApplyCoupon: (couponId: string) => void;
};

export const TopCouponsSection = ({ coupons, onApplyCoupon }: Props) => {
  const appliedCoupon = coupons.find(coupon => coupon.applied);

  if (!coupons.length) {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.headerWrap}>
        <Text style={styles.headerIcon}>✿</Text>
        <Text style={styles.sectionTitle}>Top coupons for you</Text>
        <Text style={styles.headerIcon}>✿</Text>
      </View>

      <View style={styles.sectionDivider} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {coupons.map(coupon => {
          const isApplied = coupon.applied;

          return (
            <View key={coupon.id} style={styles.couponItemWrap}>
              <View style={styles.badge}>
                <View style={styles.badgeHighlight} />
                <Text style={styles.badgeAmount}>₹{coupon.discountAmount}</Text>
                <Text style={styles.badgeOff}>OFF</Text>
              </View>

              <View style={styles.couponCard}>
                <View style={styles.topContent}>
                  <Text
                    style={[
                      styles.offerText,
                      isApplied
                        ? styles.offerTextDefault
                        : styles.offerTextHighlight,
                    ]}
                    numberOfLines={2}
                  >
                    {coupon.title}
                  </Text>

                  <Text style={styles.codeText} numberOfLines={1}>
                    {coupon.code}
                  </Text>
                </View>

                <View style={styles.leftCut} />
                <View style={styles.rightCut} />

                <View style={styles.dashedDivider} />

                <Pressable
                  style={[
                    styles.bottomAction,
                    isApplied && styles.bottomActionApplied,
                  ]}
                  onPress={() => onApplyCoupon(coupon.id)}
                >
                  {isApplied ? (
                    <View style={styles.appliedRow}>
                      <Text style={styles.appliedTick}>✓</Text>
                      <Text style={styles.appliedText}>APPLIED</Text>
                    </View>
                  ) : (
                    <Text style={styles.applyText}>APPLY</Text>
                  )}
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {appliedCoupon ? (
        <>
          <View style={styles.sectionDivider} />
          <View style={styles.savingRow}>
            <Text style={styles.partyEmoji}>🎉</Text>
            <Text style={styles.savingText}>
              You are{' '}
              <Text style={styles.savingAmount}>
                saving ₹{appliedCoupon.discountAmount}
              </Text>{' '}
              with this coupon
            </Text>
            <Text style={styles.partyEmoji}>🎉</Text>
          </View>
        </>
      ) : null}

      <View style={styles.sectionDivider} />

      <Pressable style={styles.viewMoreRow}>
        <Text style={styles.viewMoreText}>View more coupons and offers</Text>
        <Text style={styles.viewMoreArrow}>›</Text>
      </Pressable>
    </View>
  );
};

const CARD_WIDTH = 118;
const CARD_HEIGHT = 168;
const BADGE_SIZE = 86;
const CUT_SIZE = 26;
const ACTION_HEIGHT = 48;

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },

  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  headerIcon: {
    fontSize: 16,
    color: '#0C7E98',
    marginHorizontal: 10,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    color: '#0C7E98',
    fontWeight: FontWeight.bold,
  },

  sectionDivider: {
    borderTopWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },

  cardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },

  couponItemWrap: {
    width: CARD_WIDTH,
    marginRight: 12,
    alignItems: 'center',
  },

  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: '#0C748C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -24,
    zIndex: 4,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0C748C',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },

  badgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BADGE_SIZE * 0.58,
    backgroundColor: '#0F92B1',
    borderTopLeftRadius: BADGE_SIZE / 2,
    borderTopRightRadius: BADGE_SIZE / 2,
  },

  badgeAmount: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 2,
  },

  badgeOff: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    zIndex: 2,
  },

  couponCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: 30,
  },

  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 8,
  },

  offerText: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    minHeight: 38,
    fontWeight: '400',
  },

  offerTextHighlight: {
    color: '#F16369',
  },

  offerTextDefault: {
    color: '#9B9B9B',
  },

  codeText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.2,
  },

  leftCut: {
    position: 'absolute',
    left: -(CUT_SIZE / 2),
    top: 92,
    width: CUT_SIZE,
    height: CUT_SIZE,
    borderRadius: CUT_SIZE / 2,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    zIndex: 2,
  },

  rightCut: {
    position: 'absolute',
    right: -(CUT_SIZE / 2),
    top: 92,
    width: CUT_SIZE,
    height: CUT_SIZE,
    borderRadius: CUT_SIZE / 2,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    zIndex: 2,
  },

  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: '#D9D9D9',
    borderStyle: 'dashed',
    marginHorizontal: 10,
  },

  bottomAction: {
    height: ACTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  bottomActionApplied: {
    backgroundColor: '#F79347',
  },

  applyText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: '#F79347',
  },

  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  appliedTick: {
    fontSize: 18,
    lineHeight: 18,
    color: Colors.white,
    fontWeight: '800',
    marginRight: 6,
  },

  appliedText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.3,
  },

  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },

  partyEmoji: {
    fontSize: 16,
    marginHorizontal: 6,
  },

  savingText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0C7E98',
    fontWeight: '500',
    textAlign: 'center',
  },

  savingAmount: {
    fontWeight: '800',
    color: '#0C7E98',
  },

  viewMoreRow: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  viewMoreText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: '#A4A4A4',
    fontWeight: '500',
  },

  viewMoreArrow: {
    fontSize: 30,
    lineHeight: 30,
    color: '#A4A4A4',
    marginLeft: 10,
  },
});