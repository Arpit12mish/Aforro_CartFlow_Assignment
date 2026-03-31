import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';
import { Typography, FontWeight } from '../../theme/typography';
import { AddressInfo } from '../../features/cart/types/cart.types';

type DeliveryMode = 'slot' | 'instant';

type Props = {
  address: AddressInfo | null;
  totalPayable: number;
  canProceed: boolean;
  onAddAddress: () => void;
  onChangeAddress: () => void;
  onProceed: () => void;
  isLoggedIn?: boolean;
  deliveryMode?: DeliveryMode;
};

export const DeliveryAddressSection = ({
  address,
  totalPayable,
  canProceed,
  onAddAddress,
  onChangeAddress,
  onProceed,
  isLoggedIn = true,
  deliveryMode = 'slot',
}: Props) => {
  const hasAddress = !!address;
  const isServiceable = !!address?.serviceable;

  if (!hasAddress) {
    return (
      <View style={styles.sheet}>
        <View style={styles.innerCard}>
          <View style={styles.askAddressHeader}>
            <View style={styles.locationIconWrap}>
              <Text style={styles.locationIcon}>📍</Text>
            </View>

            <Text style={styles.askAddressTitle}>
              Where would you like us to deliver?
            </Text>
          </View>

          <Pressable style={styles.addAddressButton} onPress={onAddAddress}>
            <Text style={styles.addAddressButtonText}>Add address</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const ctaLabel = isLoggedIn ? 'Proceed' : 'Login to continue';

  const titleText = !isServiceable
    ? 'Location is not serviceable'
    : deliveryMode === 'instant'
    ? 'Deliver in 30-60 mins⚡'
    : address.title;

  const subtitleText = deliveryMode === 'instant'
    ? `Home | ${address.addressLine}`
    : address.addressLine;

  return (
    <View style={styles.sheet}>
      <View style={styles.innerCard}>
        <View style={styles.addressTopRow}>
          <View style={styles.addressLeft}>
            <View style={styles.locationIconWrap}>
              <Text style={styles.locationIcon}>📍</Text>
            </View>

            <View style={styles.addressTextWrap}>
              <Text
                style={[
                  styles.addressTitle,
                  !isServiceable && styles.addressTitleNotServiceable,
                ]}
                numberOfLines={1}
              >
                {titleText}
              </Text>

              <Text style={styles.addressLine} numberOfLines={1}>
                {subtitleText}
              </Text>
            </View>
          </View>

          <Pressable onPress={onChangeAddress}>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.toPayLabel}>To Pay</Text>
            <Text style={styles.toPayAmount}>₹{totalPayable}</Text>
          </View>

          <Pressable
            style={[
              styles.proceedButton,
              !canProceed && styles.proceedButtonDisabled,
            ]}
            disabled={!canProceed}
            onPress={onProceed}
          >
            <Text
              style={[
                styles.proceedButtonText,
                !canProceed && styles.proceedButtonTextDisabled,
              ]}
            >
              {ctaLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: 0,
  },
  innerCard: {
    marginHorizontal: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  askAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  locationIconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  locationIcon: {
    fontSize: 20,
  },
  askAddressTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  addAddressButton: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  addAddressButtonText: {
    color: Colors.white,
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  addressTitleNotServiceable: {
    color: Colors.danger,
  },
  addressLine: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  changeText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 14,
    paddingBottom: 18,
  },
  toPayLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  toPayAmount: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 16,
    minWidth: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#C8D7BE',
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: FontWeight.bold,
  },
  proceedButtonTextDisabled: {
    color: '#F5F7F2',
  },
});