import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';
import { FontWeight, Typography } from '../../theme/typography';
import { QuantityStepper } from '../cart/QuantityStepper';
import { ProductListItem } from '../../features/cart/types/product.types';

type Props = {
  item: ProductListItem;
  quantity: number;
  onPressCard: () => void;
  onPressOptions: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const DiscountRibbon = ({ label }: { label: string }) => {
  return (
    <View style={styles.ribbonWrapper}>
      <View style={styles.ribbonBody}>
        <Text style={styles.ribbonText}>{label}</Text>
      </View>

      <View style={styles.ribbonTeethRow}>
        <View style={styles.ribbonTooth} />
        <View style={styles.ribbonTooth} />
        <View style={styles.ribbonTooth} />
      </View>
    </View>
  );
};

export const ProductSuggestionCard = ({
  item,
  quantity,
  onPressCard,
  onPressOptions,
  onIncrease,
  onDecrease,
}: Props) => {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPressCard} style={styles.imageWrap}>
        {item.discountLabel ? (
          <DiscountRibbon label={item.discountLabel} />
        ) : null}

        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable onPress={onPressCard}>
        <Text numberOfLines={1} style={styles.brand}>
          {item.brand}
        </Text>

        <Text numberOfLines={2} style={styles.name}>
          {item.name}
        </Text>
      </Pressable>

      <Text style={styles.weight}>{item.weightLabel}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.price}</Text>
        {item.originalPrice ? (
          <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
        ) : null}
      </View>

      {item.hasOptions ? (
        <Pressable
          style={[
            styles.optionsButton,
            !item.inStock && styles.optionsButtonDisabled,
          ]}
          onPress={onPressOptions}
          disabled={!item.inStock}
        >
          <Text
            style={[
              styles.optionsButtonText,
              !item.inStock && styles.optionsButtonTextDisabled,
            ]}
          >
            {!item.inStock ? 'Out of stock' : `${item.optionCount} options`}
          </Text>
        </Pressable>
      ) : (
        <QuantityStepper
          quantity={quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          disabled={!item.inStock}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 136,
    marginRight: Spacing.md,
  },

  imageWrap: {
    height: 120,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    position: 'relative',
  },

  image: {
    width: 78,
    height: 78,
  },

  brand: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginBottom: 2,
  },

  name: {
    minHeight: 44,
    fontSize: Typography.bodyLarge,
    lineHeight: 22,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  weight: {
    fontSize: Typography.bodyLarge,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  price: {
    fontSize: Typography.heading,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },

  originalPrice: {
    fontSize: Typography.body,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },

  optionsButton: {
    minWidth: 102,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },

  optionsButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  optionsButtonText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  optionsButtonTextDisabled: {
    color: Colors.textSecondary,
  },

  ribbonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },

  ribbonBody: {
    backgroundColor: Colors.couponBlue,
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 6,
    minWidth: 42,
    alignItems: 'center',
  },

  ribbonText: {
    color: Colors.white,
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: FontWeight.bold,
  },

  ribbonTeethRow: {
    flexDirection: 'row',
  },

  ribbonTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.couponBlue,
  },
});